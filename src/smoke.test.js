/* Smoke tests for the shared UI system.
 *
 * A production build only proves the code parses. These render every page and
 * drive the new interactive pieces (filter, combobox, accordion, theme switch),
 * failing on any console.error — which is what catches hook-order mistakes,
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

test("home renders", async () => {
  const Home = require("./pages/Home/Home").default;
  await renderPage(Home, "/");
  expect(screen.getByText(/Featured Projects/i)).toBeTruthy();
  expect(screen.getByText(/More about me/i)).toBeTruthy();
});

test("projects page filters", async () => {
  const Projects = require("./pages/Projects/Projects").default;
  await renderPage(Projects, "/projects");
  expect(screen.getByText(/Selected work with clear role/i)).toBeTruthy();

  const search = screen.getByPlaceholderText(/Search projects/i);
  await act(async () => {
    fireEvent.change(search, { target: { value: "zzzzzz-no-match" } });
  });
  expect(screen.getByText(/Nothing matches those filters/i)).toBeTruthy();

  await act(async () => {
    fireEvent.change(search, { target: { value: "" } });
  });
  expect(screen.queryByText(/Nothing matches those filters/i)).toBeNull();
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
    .filter((a) => /\/work\//.test(a.getAttribute("href") || ""));
  expect(shown).toHaveLength(expected);
  expect(expected).toBeLessThan(projects.length);
  expect(screen.getByText(/Clear filters/i)).toBeTruthy();
});

test("playground renders", async () => {
  const Playground = require("./pages/Playground/Playground").default;
  await renderPage(Playground, "/playground");
  expect(screen.getByText(/Experimental projects, demos/i)).toBeTruthy();
});

test("blog list renders", async () => {
  const BlogList = require("./pages/Blog/BlogList").default;
  await renderPage(BlogList, "/blog");
  expect(screen.getByText(/Latest/i)).toBeTruthy();
});

test("blog post renders with meta strip", async () => {
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
});

test("project page renders with meta strip", async () => {
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
  // Stack chips link to the listing, already narrowed to that tag.
  expect(
    screen.getAllByRole("link").some((a) => /\/projects\?tag=/.test(a.getAttribute("href") || "")),
  ).toBe(true);
});

test("theme toggle switches data-theme", async () => {
  const ThemeToggle = require("./components/ui/ThemeToggle").default;
  await renderPage(ThemeToggle, "/");
  await act(async () => {
    fireEvent.click(screen.getByLabelText(/Light theme/i));
  });
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  await act(async () => {
    fireEvent.click(screen.getByLabelText(/Dark theme/i));
  });
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
});

test("multi select adds and removes a facet chip", async () => {
  const Projects = require("./pages/Projects/Projects").default;
  await renderPage(Projects, "/projects");

  const combobox = screen.getByRole("combobox", { name: /stack/i });
  await act(async () => {
    fireEvent.focus(combobox);
  });

  const options = screen.getAllByRole("option");
  const firstLabel = options[0].textContent.replace(/\d+$/, "").trim();
  await act(async () => {
    fireEvent.click(options[0]);
  });
  const chipName = new RegExp(`Remove ${firstLabel}`, "i");
  expect(screen.getByRole("button", { name: chipName })).toBeTruthy();

  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: chipName }));
  });
  // The chip leaves through an exit animation, so it lingers in the DOM for a
  // few frames — waiting also proves AnimatePresence actually unmounts it.
  await waitFor(() => expect(screen.queryByRole("button", { name: chipName })).toBeNull(), {
    timeout: 4000,
  });
});

test("bouncy accordion toggles a row", async () => {
  const Home = require("./pages/Home/Home").default;
  await renderPage(Home, "/");

  const row = screen.getByRole("button", { name: /who i am/i });
  expect(row.getAttribute("aria-expanded")).toBe("true"); // first row opens by default

  await act(async () => {
    fireEvent.click(row);
  });
  expect(row.getAttribute("aria-expanded")).toBe("false");

  const interests = screen.getByRole("button", { name: /what i/i });
  await act(async () => {
    fireEvent.click(interests);
  });
  expect(interests.getAttribute("aria-expanded")).toBe("true");
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
