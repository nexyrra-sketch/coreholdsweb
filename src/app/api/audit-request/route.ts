import { NextResponse } from "next/server";

/**
 * AUDIT REQUEST — INTEGRATION SEAM
 * ----------------------------------------------------------------------------
 * This is the one place the site talks to the outside world, and it is
 * deliberately the only thing left unwired. Validation, shaping and the error
 * contract are done; what is missing is the delivery step at the bottom.
 *
 * To go live, add exactly one of:
 *   • a transactional email call (Resend, Postmark, SES) to the studio inbox
 *   • a CRM create-lead call (HubSpot, Attio, Pipedrive)
 *   • an insert into your own database
 *
 * Nothing else in the form flow needs to change.
 */

export const runtime = "nodejs";

type Payload = Record<string, unknown>;

const REQUIRED = ["company", "size", "spend", "tools", "name", "role", "email"] as const;

const MAX_LENGTHS: Record<string, number> = {
  company: 200,
  website: 300,
  size: 40,
  spend: 60,
  tools: 4000,
  leak: 4000,
  name: 120,
  role: 120,
  email: 254,
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export async function POST(request: Request) {
  let body: Payload;

  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request body." },
      { status: 400 },
    );
  }

  const errors: string[] = [];

  for (const field of REQUIRED) {
    const value = body[field];
    if (typeof value !== "string" || value.trim() === "") {
      errors.push(`Missing field: ${field}`);
    }
  }

  for (const [field, max] of Object.entries(MAX_LENGTHS)) {
    const value = body[field];
    if (typeof value === "string" && value.length > max) {
      errors.push(`Field too long: ${field}`);
    }
  }

  if (typeof body.email === "string" && !isEmail(body.email)) {
    errors.push("That email address does not look valid.");
  }

  if (errors.length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const submission = {
    receivedAt: new Date().toISOString(),
    company: String(body.company).trim(),
    website: typeof body.website === "string" ? body.website.trim() : "",
    size: String(body.size),
    spend: String(body.spend),
    tools: String(body.tools).trim(),
    leak: typeof body.leak === "string" ? body.leak.trim() : "",
    name: String(body.name).trim(),
    role: String(body.role).trim(),
    email: String(body.email).trim().toLowerCase(),
  };

  // ---------------------------------------------------------------------------
  // TODO(integration): deliver `submission` — email, CRM, or database.
  // Until then it is written to the server log so nothing is silently lost
  // during staging.
  // ---------------------------------------------------------------------------
  console.info("[corehold] audit request", submission);

  return NextResponse.json({ ok: true }, { status: 202 });
}
