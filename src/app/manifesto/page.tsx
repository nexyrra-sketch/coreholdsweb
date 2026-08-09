import type { Metadata } from "next";
import { Manifesto } from "@/components/Manifesto";
import { BreadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Manifesto — Software You Rent Is a Cost. Systems You Own Are a Position.",
  description:
    "The Corehold position in eight chapters: how companies become tenants in their own operations, what a subscription actually buys, and why owning the system your business runs on compounds while renting keeps you level with everyone renting the same tools.",
  alternates: { canonical: "/manifesto" },
  openGraph: {
    title: "Corehold — Manifesto",
    description:
      "Renting keeps you average. Owning compounds. The argument in eight chapters.",
    url: "/manifesto",
  },
};

export default function ManifestoPage() {
  return (
    <>
      <Manifesto />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Manifesto", path: "/manifesto" },
        ]}
      />
    </>
  );
}
