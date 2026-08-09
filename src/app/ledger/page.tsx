import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { RentLedger } from "@/components/RentLedger";
import { CtaBand } from "@/components/CtaBand";
import { BreadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "The Rent Ledger — Price Your Own Stack Over Five Years",
  description:
    "Add up what your company actually pays to rent its software, project it across five years with renewal escalation, set an ownership scenario against it, and take the whole thing away as a one-page PDF built in your browser.",
  alternates: { canonical: "/ledger" },
  openGraph: {
    title: "The Rent Ledger — what are you actually renting?",
    description:
      "Your numbers, five years, and a downloadable sheet. Nothing uploaded, nothing stored.",
    url: "/ledger",
  },
};

export default function LedgerPage() {
  return (
    <>
      <PageHeader
        eyebrow="The ledger"
        title={
          <>
            Add it up
            <span className="block text-quarry-500">honestly, once.</span>
          </>
        }
        lede={
          <>
            Nobody decides to rent their entire operation — it accumulates, one
            reasonable decision at a time, and it never arrives as a single
            number. So here is the single number. Replace the placeholders with
            what you actually pay, set your own ownership scenario against it,
            and take the result with you.
          </>
        }
        meta={[
          ["Your figures", "Encoded in the URL, stored nowhere"],
          ["The sheet", "A real PDF, built in your browser"],
          ["Corehold prices", "None appear. We quote after an audit."],
        ]}
        breadcrumb={{ label: "Home", href: "/" }}
      />

      <Section ground="light" film id="ledger">
        <RentLedger />
      </Section>

      <CtaBand
        eyebrow="Arithmetic is not an audit"
        heading="This is the general shape. Yours will surprise you."
        body="Every audit we run finds at least one thing nobody in the business had on their list — and often concludes that some of what you pay for is worth keeping. That is the part a calculator cannot do."
        secondary={{ href: "/specimen", label: "See a worked audit" }}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "The Ledger", path: "/ledger" },
        ]}
      />
    </>
  );
}
