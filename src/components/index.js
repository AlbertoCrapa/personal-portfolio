// UI Components
export { default as Button } from "./ui/Button";
export { default as NavLink } from "./ui/NavLink";
export { default as SocialLink } from "./ui/SocialLink";
export { default as Breadcrumb } from "./ui/Breadcrumb";
export { default as Callout } from "./ui/Callout";
export { default as VideoPlayer } from "./ui/VideoPlayer";
export { default as ProjectCard } from "./ui/ProjectCard";
export { default as BlogCard } from "./ui/BlogCard";
export { default as SectionHeader } from "./ui/SectionHeader";
export { default as PageHeader } from "./ui/PageHeader";
export { default as MetaStrip } from "./ui/MetaStrip";
export { default as FilterBar } from "./ui/FilterBar";
export { default as ResultsGrid } from "./ui/ResultsGrid";
export { default as RichText } from "./ui/RichText";
export { default as ArticleBody } from "./ui/ArticleBody";
export {
  getArticleSummary,
  getFirstMediaSrc,
  getTocSections,
  normalizeContent,
} from "./ui/article/normalize";
export { default as RevealSection } from "./ui/RevealSection";

// Motion primitives — the shared animation vocabulary (beUI-flavoured).
// Tokens live in src/utils/motion.js.
export { default as Reveal } from "./ui/motion/Reveal";
export { default as TiltSurface } from "./ui/motion/TiltSurface";
export { default as MediaCard } from "./ui/motion/MediaCard";
export { default as MediaRow } from "./ui/motion/MediaRow";
export { default as BouncyAccordion } from "./ui/motion/BouncyAccordion";
export { default as MultiSelect } from "./ui/motion/MultiSelect";
export { default as SegmentedControl } from "./ui/motion/SegmentedControl";
export { default as SearchField } from "./ui/motion/SearchField";
export { default as AnimatedNumber } from "./ui/motion/AnimatedNumber";
export { default as SocialDock } from "./ui/motion/SocialDock";
export { default as Tag } from "./ui/motion/Tag";
export { default as AvatarFace, FACES } from "./ui/motion/AvatarFace";

// Theme
export { default as ThemeToggle } from "./ui/ThemeToggle";
export { ThemeProvider, useTheme } from "./ui/ThemeProvider";

// Layout Components
export { default as Sidebar } from "./Sidebar";

// Core Components
export { default as SEO } from "./SEO";
export { default as Smile } from "./Smile";
