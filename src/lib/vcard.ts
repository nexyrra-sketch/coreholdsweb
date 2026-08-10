import { card } from "@/data/card";

/**
 * A vCard, assembled by hand.
 *
 * RFC 6350 is a text format. Every "QR contact card" product on the market
 * charges a subscription to generate one, which is a fairly neat illustration
 * of the argument the rest of this site makes: the thing being rented is forty
 * lines of string concatenation.
 *
 * Version 3.0 rather than 4.0 deliberately — iOS and Android both import 3.0
 * cleanly, and 4.0 still trips some older address books.
 */

/** Long lines must be folded at 75 octets with a leading space on continuations. */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [line.slice(0, 75)];
  let rest = line.slice(75);
  while (rest.length > 74) {
    parts.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  if (rest) parts.push(` ${rest}`);
  return parts.join("\r\n");
}

/** Commas, semicolons, backslashes and newlines are structural in vCard. */
function escape(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function buildVCard(): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escape(card.last)};${escape(card.first)};;;`,
    `FN:${escape(card.name)}`,
    `ORG:${escape(card.org)}`,
    `TITLE:${escape(card.title)}`,
    `TEL;TYPE=CELL,VOICE:${card.phone}`,
    `EMAIL;TYPE=INTERNET,WORK:${card.email}`,
    `URL:${card.website}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${card.linkedin}`,
    `X-SOCIALPROFILE;TYPE=twitter:${card.x}`,
    `ADR;TYPE=WORK:;;;${escape(card.city)};;;${escape(card.country)}`,
    `NOTE:${escape(card.claim)} ${escape(card.cardUrl)}`,
    "END:VCARD",
  ];
  return lines.map(fold).join("\r\n");
}

export function downloadVCard() {
  const blob = new Blob([buildVCard()], {
    type: "text/vcard;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "ghassan-adil-corehold.vcf";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoke on the next tick — Safari needs the URL to survive the click.
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}
