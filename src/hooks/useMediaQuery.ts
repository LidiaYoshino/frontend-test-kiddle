import { useEffect, useState } from "react";
import { BREAKPOINTS, BREAKPOINT_QUERIES, type BreakpointKey } from "../constants/styles";

/**
 * Custom hook to check if the media query matches.
 * @param query - The media query to check.
 * @returns True if the media query matches, false otherwise.
 */

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

export type BreakpointBucket = "base" | BreakpointKey;

const BREAKPOINT_BUCKET_ORDER: BreakpointBucket[] = ["base", "sm", "md", "lg", "xl", "2xl"];

function resolveBreakpointBucket(width: number): BreakpointBucket {
  if (width >= BREAKPOINTS["2xl"]) {
    return "2xl";
  }

  if (width >= BREAKPOINTS.xl) {
    return "xl";
  }

  if (width >= BREAKPOINTS.lg) {
    return "lg";
  }

  if (width >= BREAKPOINTS.md) {
    return "md";
  }

  if (width >= BREAKPOINTS.sm) {
    return "sm";
  }

  return "base";
}

export function useBreakpointUp(breakpoint: BreakpointKey): boolean {
  return useMediaQuery(BREAKPOINT_QUERIES[breakpoint]);
}

export function useBreakpointBucket(): BreakpointBucket {
  const [breakpointBucket, setBreakpointBucket] = useState<BreakpointBucket>(() => {
    if (typeof window === "undefined") {
      return "base";
    }

    return resolveBreakpointBucket(window.innerWidth);
  });

  useEffect(() => {
    const onResize = () => {
      const nextBucket = resolveBreakpointBucket(window.innerWidth);
      setBreakpointBucket((currentBucket) => (currentBucket === nextBucket ? currentBucket : nextBucket));
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return breakpointBucket;
}

export function isBreakpointAtOrAbove(current: BreakpointBucket, target: BreakpointBucket): boolean {
  return BREAKPOINT_BUCKET_ORDER.indexOf(current) >= BREAKPOINT_BUCKET_ORDER.indexOf(target);
}
