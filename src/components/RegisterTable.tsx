"use client";

import { useId, useMemo, useState } from "react";
import { register, groups, verdictCopy, type Verdict } from "@/data/register";

const VERDICTS: Verdict[] = ["build", "rent", "depends"];

const verdictStyle: Record<Verdict, string> = {
  build: "text-oxide",
  rent: "text-quarry-300",
  depends: "text-quarry-400",
};

const lockStyle: Record<string, string> = {
  high: "text-oxide",
  medium: "text-quarry-300",
  low: "text-quarry-500",
};

export function RegisterTable() {
  const [query, setQuery] = useState("");
  const [verdict, setVerdict] = useState<Verdict | "all">("all");
  const [group, setGroup] = useState<string | "all">("all");
  const searchId = useId();
  const groupId = useId();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return register.filter((entry) => {
      if (verdict !== "all" && entry.verdict !== verdict) return false;
      if (group !== "all" && entry.group !== group) return false;
      if (!q) return true;
      return (
        entry.name.toLowerCase().includes(q) ||
        entry.reason.toLowerCase().includes(q) ||
        entry.flips.toLowerCase().includes(q) ||
        entry.group.toLowerCase().includes(q)
      );
    });
  }, [query, verdict, group]);

  const counts = useMemo(
    () => ({
      build: register.filter((e) => e.verdict === "build").length,
      rent: register.filter((e) => e.verdict === "rent").length,
      depends: register.filter((e) => e.verdict === "depends").length,
    }),
    [],
  );

  return (
    <div className="mt-14 lg:mt-16">
      {/* ------------------------------------------------------- controls -- */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-quarry-800 pb-6">
        <div className="flex flex-wrap items-end gap-6">
          <div>
            <span className="tag block text-quarry-500">Verdict</span>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <FilterButton
                active={verdict === "all"}
                onClick={() => setVerdict("all")}
              >
                All {register.length}
              </FilterButton>
              {VERDICTS.map((v) => (
                <FilterButton
                  key={v}
                  active={verdict === v}
                  onClick={() => setVerdict(v)}
                >
                  {verdictCopy[v].label} {counts[v]}
                </FilterButton>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor={groupId} className="tag block text-quarry-500">
              Area
            </label>
            <select
              id={groupId}
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="mt-2.5 h-10 rounded-[2px] border border-quarry-700 bg-quarry-900 px-3 text-[0.9375rem] text-bone transition-colors hover:border-quarry-600"
            >
              <option value="all">Every area</option>
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor={searchId} className="tag block text-quarry-500">
            Search
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="CRM, quoting, payroll…"
            className="mt-2.5 h-10 w-full rounded-[2px] border border-quarry-700 bg-quarry-900 px-3.5 text-[0.9375rem] text-bone transition-colors placeholder:text-quarry-500 hover:border-quarry-600 focus:border-oxide sm:w-72"
          />
        </div>
      </div>

      <p aria-live="polite" className="tag mt-5 text-quarry-500">
        {results.length} of {register.length} entries
      </p>

      {/* --------------------------------------------------------- table -- */}
      <div className="reg mt-6">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Build-or-rent verdicts by software category, with lock-in risk and
            the threshold at which each verdict changes.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="tag w-[26%] pb-4 text-quarry-500">
                Category
              </th>
              <th scope="col" className="tag w-[10%] pb-4 text-quarry-500">
                Verdict
              </th>
              <th scope="col" className="tag w-[10%] pb-4 text-quarry-500">
                Lock-in
              </th>
              <th scope="col" className="tag w-[54%] pb-4 text-quarry-500">
                Reasoning
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((entry) => (
              <tr key={entry.id} id={entry.id}>
                <th scope="row" className="align-top">
                  <span className="block text-[1.0625rem] font-medium text-bone">
                    {entry.name}
                  </span>
                  <span className="tag mt-1.5 block text-quarry-500">
                    {entry.group}
                  </span>
                </th>
                <td data-col="Verdict" className="align-top">
                  <span className={`tag ${verdictStyle[entry.verdict]}`}>
                    {verdictCopy[entry.verdict].label}
                  </span>
                </td>
                <td data-col="Lock-in" className="align-top">
                  <span className={`tag ${lockStyle[entry.lockIn]}`}>
                    {entry.lockIn}
                  </span>
                </td>
                <td data-col="Reasoning" className="align-top">
                  <span className="block text-[0.9375rem] leading-relaxed text-quarry-300">
                    {entry.reason}
                  </span>
                  <span className="mt-3 block font-mono text-xs leading-relaxed text-quarry-500">
                    <span className="text-quarry-400">CHANGES WHEN — </span>
                    {entry.flips}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {results.length === 0 && (
          <p className="border-t border-quarry-800 py-12 text-[0.9375rem] text-quarry-400">
            Nothing in the register matches that. If a category is missing that
            you think should be here, tell us — this document is versioned and
            revised quarterly.
          </p>
        )}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`tag h-10 rounded-[2px] border px-3.5 transition-colors duration-200 ${
        active
          ? "border-oxide bg-oxide/10 text-oxide"
          : "border-quarry-700 text-quarry-300 hover:border-quarry-600 hover:text-bone"
      }`}
    >
      {children}
    </button>
  );
}
