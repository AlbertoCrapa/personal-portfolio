/* Smoke tests for the shared UI system.
 *
 * A production build only proves the code parses. These render every page and
 * drive the interactive pieces (filters, tag links, theme control, contact form),
 * failing on any console.error, which is what catches hook-order mistakes,
 * bad props and missing exports. */
import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { ThemeProvider } from "./components/ui/ThemeProvider";
import { NotificationProvider } from "./components/ui/NotificationProvider";

class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = RO;
global.IntersectionObserver = class {
  constructor(cb) {
    this.cb = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
};
window.scrollTo = () => {};
// Not implemented by jsdom; real browsers all have it.
window.Element.prototype.scrollIntoView = () => {};
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};
// jsdom ships matchMedia but its MediaQueryList lacks the deprecated
// addListener/removeListener pair that framer-motion still feature-detects.
window.matchMedia = (q) => ({
  matches: false,
  media: q,
  onchange: null,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {
    return false;
  },
});
global.TextDecoder = require("util").TextDecoder;
global.TextEncoder = require("util").TextEncoder;

const Wrap = ({ route, children }) => (
  <HelmetProvider>
    <ThemeProvider>
      <MemoryRouter initialEntries={[route]}>
        <NotificationProvider>{children}</NotificationProvider>
      </MemoryRouter>
    </ThemeProvider>
  </HelmetProvider>
);

const errors = [];
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((...args) => {
    errors.push(args.join(" "));
  });
});
beforeEach(() => {
  errors.length = 0;
});

const renderPage = async (Component, route, props = {}) => {
  let utils;
  await act(async () => {
    utils = render(
      <Wrap route={route}>
        <Component {...props} />
      </Wrap>,
    );
  });
  const real = errors.filter((e) => !/not wrapped in act|Warning: validateDOMNesting/.test(e));
  if (real.length) throw new Error(real.slice(0, 3).join("\n---\n"));
  return utils;
};

test("home renders every section", async () => {
  const Home = require("./pages/Home/Home").default;
  await renderPage(Home, "/");
  expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/alberto crapanzano/i);
  [/selected work/, /try it in your browser/, /writing/, /about me/, /let.s build something/].forEach((title) =>
    expect(screen.getByRole("heading", { name: title })).toBeTruthy(),
  );
});

test("projects page filters and recovers from an empty result", async () => {
  const Projects = require("./pages/Projects/Projects").default;
  await renderPage(Projects, "/projects");

  const search = screen.getByLabelText(/Search projects/i);
  await act(async () => {
    fireEvent.change(search, { target: { value: "zzzzzz-no-match" } });
  });
  expect(screen.getByText(/No projects match these filters/i)).toBeTruthy();

  // The empty state's one next step clears everything.
  const clear = screen.getAllByRole("button", { name: /Clear filters/i });
  await act(async () => {
    fireEvent.click(clear[clear.length - 1]);
  });
  expect(screen.queryByText(/No projects match these filters/i)).toBeNull();
});

test("?tag= in the url pre-applies the facet", async () => {
  const Projects = require("./pages/Projects/Projects").default;
  const projectData = require("./data/projects.json");
  const projects = Object.values(projectData.projects);
  const tag = projects.find((p) => (p.technologies || []).length)?.technologies[0];
  const expected = projects.filter((p) => (p.technologies || []).includes(tag)).length;

  await renderPage(Projects, `/projects?tag=${encodeURIComponent(tag)}`);
  const shown = screen
    .getAllByRole("link")
    .filter((a) => /^\/work\/[^/]+$/.test(a.getAttribute("href") || ""));
  expect(shown).toHaveLength(expected);
  expect(expected).toBeLessThan(projects.length);
  expect(screen.getAllByText(tag).length).toBeGreaterThan(0);
  expect(screen.getByText(new RegExp(`${expected} of ${projects.length} projects`))).toBeTruthy();
});

test("the tag picker finds a tag by typing, adds it and removes it", async () => {
  const Projects = require("./pages/Projects/Projects").default;
  const projects = Object.values(require("./data/projects.json").projects);
  await renderPage(Projects, "/projects");
  const workLinks = () => screen.getAllByRole("link").filter((a) => /^\/work\/[^/]+$/.test(a.getAttribute("href") || ""));
  expect(workLinks()).toHaveLength(projects.length);

  const field = screen.getByLabelText("Stack");
  await act(async () => {
    fireEvent.focus(field);
    fireEvent.change(field, { target: { value: "unit" } });
  });
  const unity = screen.getAllByRole("option").find((o) => /^Unity \(\d+\)$/.test(o.textContent.trim()));
  await act(async () => {
    fireEvent.click(unity);
  });
  await waitFor(() => expect(workLinks().length).toBeLessThan(projects.length));
  expect(field.value).toBe("");

  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Remove Unity" }));
  });
  await waitFor(() => expect(workLinks()).toHaveLength(projects.length));
});

test("a tag inside a card links to the filtered listing", async () => {
  const Projects = require("./pages/Projects/Projects").default;
  await renderPage(Projects, "/projects");
  const tagLinks = screen.getAllByRole("link").filter((a) => /^\/projects\?tag=/.test(a.getAttribute("href") || ""));
  expect(tagLinks.length).toBeGreaterThan(0);
});

test("playground renders", async () => {
  const Playground = require("./pages/Playground/Playground").default;
  await renderPage(Playground, "/playground");
  expect(screen.getByRole("heading", { level: 1, name: "playground" })).toBeTruthy();
});

test("blog list renders and reads ?tag=", async () => {
  const BlogList = require("./pages/Blog/BlogList").default;
  const { blogs } = require("./data/blog.json");
  const tag = blogs[0].tags[0];
  await renderPage(BlogList, `/blog?tag=${encodeURIComponent(tag)}`);
  expect(screen.getByRole("heading", { level: 1, name: "blog" })).toBeTruthy();
  expect(screen.getByText(new RegExp(`of ${blogs.length} posts`))).toBeTruthy();
});

test("blog post renders with meta strip and topic links", async () => {
  const BlogPage = require("./pages/Blog/BlogPage").default;
  const { blogs } = require("./data/blog.json");
  const { Routes, Route } = require("react-router-dom");
  await act(async () => {
    render(
      <Wrap route={`/blog/${blogs[0].slug}`}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPage />} />
        </Routes>
      </Wrap>,
    );
  });
  const real = errors.filter((e) => !/not wrapped in act|validateDOMNesting/.test(e));
  if (real.length) throw new Error(real.slice(0, 3).join("\n---\n"));
  expect(screen.getByText(/Reading time/i)).toBeTruthy();
  expect(screen.getByText(/Published/i)).toBeTruthy();
  expect(
    screen.getAllByRole("link").some((a) => /^\/blog\?tag=/.test(a.getAttribute("href") || "")),
  ).toBe(true);
});

test("project page renders with meta strip and stack links", async () => {
  const Work = require("./pages/Work/Work").default;
  const projectData = require("./data/projects.json");
  const slug = Object.values(projectData.projects)[0].slug;
  const { Routes, Route } = require("react-router-dom");
  await act(async () => {
    render(
      <Wrap route={`/work/${slug}`}>
        <Routes>
          <Route path="/work/:slug" element={<Work />} />
        </Routes>
      </Wrap>,
    );
  });
  const real = errors.filter((e) => !/not wrapped in act|validateDOMNesting/.test(e));
  if (real.length) throw new Error(real.slice(0, 3).join("\n---\n"));
  expect(screen.getByText(/^Role$/i)).toBeTruthy();
  expect(screen.getByText(/^Stack$/i)).toBeTruthy();
  // Stack tags are real links to the listing, already narrowed to that tag.
  expect(
    screen.getAllByRole("link").some((a) => /^\/projects\?tag=/.test(a.getAttribute("href") || "")),
  ).toBe(true);
});

test("missing project shows a way back to the list", async () => {
  const Work = require("./pages/Work/Work").default;
  const { Routes, Route } = require("react-router-dom");
  await act(async () => {
    render(
      <Wrap route="/work/does-not-exist">
        <Routes>
          <Route path="/work/:slug" element={<Work />} />
        </Routes>
      </Wrap>,
    );
  });
  expect(screen.getByRole("heading", { level: 1, name: /Project not found/i })).toBeTruthy();
  expect(screen.getByRole("link", { name: /Browse projects/i }).getAttribute("href")).toBe("/projects");
});

test("theme control switches data-theme", async () => {
  const ThemeControl = require("./components/ui/ThemeControl").default;
  await renderPage(ThemeControl, "/");
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Light" }));
  });
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Dark" }));
  });
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
});

test("contact form validates inline, then confirms in place", async () => {
  const Home = require("./pages/Home/Home").default;
  await renderPage(Home, "/");
  const submit = screen.getByRole("button", { name: /Send message/i });
  await act(async () => {
    fireEvent.click(submit);
  });
  expect(screen.getAllByText(/Enter your email so I can reply/i).length).toBeGreaterThan(0);

  delete window.location;
  window.location = { href: "" };
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Your email/i), { target: { value: "me@studio.com" } });
    fireEvent.change(screen.getByLabelText(/^Subject/i), { target: { value: "Role" } });
    fireEvent.change(screen.getByLabelText(/^Message/i), { target: { value: "Hello there" } });
  });
  await act(async () => {
    fireEvent.click(submit);
  });
  expect(window.location.href).toMatch(/^mailto:/);
  expect(screen.getAllByText(/Your mail app is open/i).length).toBeGreaterThan(0);
});

test("avatar face poses stay morphable and react to clicks", async () => {
  const { FACES } = require("./components/ui/motion/AvatarFace");

  // Every mouth must carry the same ten numbers in the same slots — that is the
  // only reason framer-motion can tween one pose's `d` into another's. A path
  // with a different command signature snaps instead, silently.
  Object.entries(FACES).forEach(([name, pose]) => {
    expect(`${name}:${pose.mouth.replace(/-?[\d.]+/g, "n")}`).toBe(
      `${name}:M n n Q n n n n Q n n n n`,
    );
  });

  const AvatarFace = require("./components/ui/motion/AvatarFace").default;
  render(<AvatarFace />);

  const avatar = screen.getByRole("button", { name: /avatar, currently/i });
  const before = avatar.getAttribute("aria-label");
  await act(async () => {
    fireEvent.click(avatar);
  });
  expect(avatar.getAttribute("aria-label")).not.toBe(before);
});
