import { Reveal } from "./Reveal";

const received: [string, string][] = [
  [
    "Source code",
    "The full repository with its history, in your organisation, under a licence you hold.",
  ],
  [
    "Data",
    "Every record, in open formats, in infrastructure registered and billed to you.",
  ],
  [
    "Infrastructure",
    "Cloud accounts, domains, DNS and credentials in your company's name.",
  ],
  [
    "Architecture",
    "Written documentation of the system and of every decision that shaped it.",
  ],
  [
    "Runbooks",
    "Operating procedures for the people who will run this on a Tuesday morning.",
  ],
  [
    "Walkthroughs",
    "Recorded sessions — one set for operators, one set for engineers.",
  ],
  [
    "A written exit",
    "What you own, where it lives, and how to move all of it somewhere else.",
  ],
];

const excluded = [
  "No Corehold licence",
  "No proprietary runtime or hidden dependency",
  "No mandatory retainer",
  "No margin on your hosting",
  "No data retained by us",
  "No permission required to leave",
];

export function HandoverManifest() {
  return (
    <div className="mt-14 grid gap-14 lg:mt-16 lg:grid-cols-12 lg:gap-16">
      <Reveal className="lg:col-span-7">
        <p className="tag text-oxide-deep">Transferred on completion</p>
        <ul className="mt-6 border-t border-limestone-line">
          {received.map(([term, detail], i) => (
            <li
              key={term}
              className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-limestone-line py-5 sm:grid-cols-[3.5rem_1fr]"
            >
              <span className="tag pt-1 text-quarry-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block text-[1.0625rem] font-medium tracking-[-0.015em] text-quarry-950">
                  {term}
                </span>
                <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-quarry-700">
                  {detail}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={120} className="lg:col-span-5">
        <div className="border border-quarry-950/25 bg-quarry-950 p-8 sm:p-10">
          <p className="tag text-quarry-400">Deliberately not included</p>
          <ul className="mt-7 space-y-4">
            {excluded.map((item) => (
              <li
                key={item}
                className="flex items-baseline gap-3.5 text-[0.9375rem] text-bone"
              >
                <span
                  aria-hidden="true"
                  className="relative top-[-1px] h-px w-4 shrink-0 bg-oxide"
                />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-9 border-t border-quarry-800 pt-7 font-mono text-xs leading-relaxed text-quarry-400">
            Most studios call this an exit clause. We call it the deliverable.
            If any part of the system only works because Corehold is still
            attached to it, the engagement is not finished.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
