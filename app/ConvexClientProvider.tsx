"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const convex = useMemo(() => {
    if (!convexUrl) return null;
    return new ConvexReactClient(convexUrl);
  }, [convexUrl]);

  if (!convexUrl || !convex) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-zinc-100 px-4 py-16 text-center text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
        <p className="max-w-md text-lg leading-relaxed">
          Set{" "}
          <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
            NEXT_PUBLIC_CONVEX_URL
          </code>{" "}
          in{" "}
          <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
            .env.local
          </code>
          . Run{" "}
          <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
            npx convex dev
          </code>{" "}
          once to link this project and write your deployment URL.
        </p>
      </div>
    );
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
