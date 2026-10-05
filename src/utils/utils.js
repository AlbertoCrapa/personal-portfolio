import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSpring, useTransform } from "framer-motion";

let previousItems = [];

export function randomWithoutRepetition(arr) {
  if (arr.length === 0) {
    throw new Error("Array must contain at least one item.");
  }
  if (previousItems.length === arr.length) {
    previousItems = [];
  }
  const availableItems = arr.filter((item) => !previousItems.includes(item));
  const randomItem =
    availableItems[Math.floor(Math.random() * availableItems.length)];
  previousItems.push(randomItem);

  return randomItem;
}

export function useSmoothTransform(value, springOptions, transformer) {
  return useSpring(useTransform(value, transformer), springOptions);
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Shared cover for projects that ship without their own artwork (NDA work).
 */
export const NDA_COVER = "/img/nda-cover.svg";

/**
 * Resolve a project's cover image: its own cover, else its first screenshot,
 * else the NDA placeholder.
 * @param {Object} project - Project or playground item
 * @returns {string}
 */
export function getProjectCover(project) {
  const firstImage = (project?.media || []).find(
    (item) => item?.src && !/\.(mp4|webm|mov)$/i.test(item.src),
  )?.src;
  return project?.thumbnailImage || project?.cover || firstImage || NDA_COVER;
}

/**
 * Comprehensive device detection utilities
 */
export const deviceDetection = {
  // Check if device is mobile (phones)
  isMobile: () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = [
      "android",
      "webos",
      "iphone",
      "ipod",
      "blackberry",
      "windows phone",
      "opera mini",
      "iemobile",
      "mobile",
    ];
    return (
      mobileKeywords.some((keyword) => userAgent.includes(keyword)) ||
      (window.innerWidth <= 768 && "ontouchstart" in window)
    );
  },

  // Check if device is tablet
  isTablet: () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIPad =
      userAgent.includes("ipad") ||
      (userAgent.includes("macintosh") && "ontouchstart" in window);
    const isAndroidTablet =
      userAgent.includes("android") && !userAgent.includes("mobile");
    const isGenericTablet =
      window.innerWidth > 768 &&
      window.innerWidth <= 1024 &&
      "ontouchstart" in window;

    return isIPad || isAndroidTablet || isGenericTablet;
  },

  // Check if device is desktop
  isDesktop: () => {
    return !deviceDetection.isMobile() && !deviceDetection.isTablet();
  },

  // Check if device has touch capabilities
  isTouchDevice: () => {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  },

  // Check if device supports hover (fine pointer)
  supportsHover: () => {
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  },

  // Get device type as string
  getDeviceType: () => {
    if (deviceDetection.isMobile()) return "mobile";
    if (deviceDetection.isTablet()) return "tablet";
    return "desktop";
  },

  // Get screen size category
  getScreenSize: () => {
    const width = window.innerWidth;
    if (width < 640) return "xs";
    if (width < 768) return "sm";
    if (width < 1024) return "md";
    if (width < 1280) return "lg";
    if (width < 1536) return "xl";
    return "2xl";
  },

  // Check if device should use custom cursor (desktop with fine pointer)
  shouldUseCustomCursor: () => {
    return (
      deviceDetection.isDesktop() &&
      deviceDetection.supportsHover() &&
      !deviceDetection.isTouchDevice()
    );
  },

  // Get device info object
  getDeviceInfo: () => {
    return {
      type: deviceDetection.getDeviceType(),
      screenSize: deviceDetection.getScreenSize(),
      isMobile: deviceDetection.isMobile(),
      isTablet: deviceDetection.isTablet(),
      isDesktop: deviceDetection.isDesktop(),
      isTouchDevice: deviceDetection.isTouchDevice(),
      supportsHover: deviceDetection.supportsHover(),
      shouldUseCustomCursor: deviceDetection.shouldUseCustomCursor(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };
  },
};

/**
 * Format an ISO-ish date for reading surfaces (cards, meta strips).
 * @param {string} value - ISO date string
 * @param {'short'|'long'} style - "May 2, 2024" vs "May 2, 2024" with full month
 */
export function formatDate(value, style = "short") {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
    // Data dates are calendar days ("2025-07-30" parses as UTC midnight), so
    // format in UTC or a visitor west of Greenwich sees the day before.
    timeZone: "UTC",
  });
}

/**
 * Rough reading time for an article, in minutes.
 * Counts the prose blocks only — captions and code are skimmed, not read —
 * at the usual 200 wpm, floored at 1 so nothing reads "0 min".
 * @param {Object} entry - Blog or project record with a `content` array
 */
export function estimateReadTime(entry) {
  const words = (entry?.content || []).reduce((total, block) => {
    if (typeof block === "string") return total + block.split(/\s+/).length;
    if (block && typeof block.text === "string")
      return total + block.text.split(/\s+/).length;
    return total;
  }, 0);
  return Math.max(1, Math.ceil(words / 200));
}
