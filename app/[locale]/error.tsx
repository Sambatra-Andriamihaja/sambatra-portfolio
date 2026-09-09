"use client";

import { useEffect } from "react";
import { Frame } from "@/components/ui/section";
import { ActionButton } from "@/components/ui/action";
import { Return } from "@/components/ui/icon";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Frame className="grid min-h-[100svh] place-items-center py-band">
      <div className="w-full max-w-xl text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-gold">
          Runtime error
        </p>
        <h1 className="mt-4 text-display-sm font-bold tracking-crush text-ink">
          Something went wrong.
        </h1>
        <p className="mx-auto mt-4 max-w-prose text-fluid-base leading-relaxed text-muted">
          The page failed to render. Retrying usually clears it — if it does
          not, the reference below is the one worth quoting.
        </p>
        {error.digest && (
          <p className="mt-4 font-mono text-xs text-faint">
            digest: {error.digest}
          </p>
        )}
        <div className="mt-10 flex justify-center">
          <ActionButton
            onClick={reset}
            variant="primary"
            icon={<Return />}
            trailing={false}
          >
            Try again
          </ActionButton>
        </div>
      </div>
    </Frame>
  );
}
