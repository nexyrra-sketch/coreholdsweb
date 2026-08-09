import { Reveal } from "./Reveal";

const rows: [string, string, string][] = [
  [
    "The software itself",
    "Licensed to you for exactly as long as you keep paying.",
    "Yours. In your repository, under your organisation, from the first commit.",
  ],
  [
    "Your company's data",
    "On their infrastructure, exportable on their terms and in their format.",
    "In accounts registered to you and billed to you. You hold the keys.",
  ],
  [
    "The cost curve",
    "Renews upward every year. There is no final payment.",
    "Front-loaded, then it flattens. Maintenance, not rent.",
  ],
  [
    "Fit to the business",
    "Your team bends its process around whatever the tool allows.",
    "The system is shaped to how the company actually operates.",
  ],
  [
    "Leverage",
    "You are one pricing email away from a new budget.",
    "Nobody outside the company can change your terms.",
  ],
  [
    "What it becomes",
    "An expense. Years of it, and nothing to show at the end.",
    "An asset the business holds — and can sell, extend or move.",
  ],
  [
    "If you stop paying",
    "It switches off.",
    "Nothing happens. It keeps running.",
  ],
];

export function PositionTable() {
  return (
    <Reveal className="cmp mt-14 lg:mt-16">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          A comparison of renting software versus owning the system your
          business runs on, across seven dimensions.
        </caption>
        <thead>
          <tr>
            <th scope="col" className="tag w-[24%] pb-4 text-quarry-500">
              Dimension
            </th>
            <th scope="col" className="tag w-[38%] pb-4 text-quarry-500">
              Rented
            </th>
            <th scope="col" className="tag w-[38%] pb-4 text-oxide">
              Owned
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([dimension, rented, owned]) => (
            <tr key={dimension}>
              <th
                scope="row"
                className="align-top text-[0.9375rem] font-medium text-bone"
              >
                {dimension}
              </th>
              <td
                data-col="Rented"
                className="align-top text-[0.9375rem] leading-relaxed text-quarry-400"
              >
                {rented}
              </td>
              <td
                data-col="Owned"
                className="align-top text-[0.9375rem] leading-relaxed text-quarry-200"
              >
                {owned}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Reveal>
  );
}
