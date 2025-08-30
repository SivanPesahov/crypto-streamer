import Link from "next/link";

type FilterNavProps = {
  filter?: string | null;
};

export function FilterNav({ filter }: FilterNavProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex items-center rounded-xl border border-neutral-800 bg-neutral-900/60 p-1 shadow-inner backdrop-blur-sm">
        <Link
          href="/dashboard"
          aria-current={filter ? undefined : "page"}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition
            ${
              !filter
                ? "bg-gradient-to-b from-neutral-700 to-neutral-600 text-white shadow hover:from-neutral-600 hover:to-neutral-500"
                : "text-neutral-300 hover:text-white hover:bg-neutral-800/70"
            }
          `}
        >
          All
        </Link>
        <Link
          href="/dashboard?filter=risers"
          aria-current={filter === "risers" ? "page" : undefined}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition
            ${
              filter === "risers"
                ? "bg-gradient-to-b from-green-700 to-green-600 text-white shadow hover:from-green-600 hover:to-green-500"
                : "text-neutral-300 hover:text-white hover:bg-neutral-800/70"
            }
          `}
        >
          ▲ Top Risers
        </Link>
        <Link
          href="/dashboard?filter=fallers"
          aria-current={filter === "fallers" ? "page" : undefined}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition
            ${
              filter === "fallers"
                ? "bg-gradient-to-b from-red-700 to-red-600 text-white shadow hover:from-red-600 hover:to-red-500"
                : "text-neutral-300 hover:text-white hover:bg-neutral-800/70"
            }
          `}
        >
          ▼ Top Fallers
        </Link>
      </div>
    </div>
  );
}
