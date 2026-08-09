"use client";

import { useState, type FormEvent } from "react";
import { Button, Arrow } from "./Button";
import { Mark } from "./Logo";
import { site, whatsappHref, whatsappOpeners } from "@/lib/site";

/**
 * The UI, validation, states and confirmation flow are complete and real, and
 * the request genuinely reaches the server at /api/audit-request. The only
 * thing left unwired is the last step inside that route handler — delivering
 * the submission to an inbox, a CRM or a database. Nothing here needs to
 * change when that is connected.
 */
async function submit(payload: Record<string, FormDataEntryValue>) {
  const response = await fetch("/api/audit-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as { ok: boolean };
}

const fieldBase =
  "mt-2.5 block w-full rounded-[2px] border border-quarry-700 bg-quarry-900 px-3.5 py-3 text-[0.9375rem] text-bone transition-colors duration-200 placeholder:text-quarry-500 hover:border-quarry-600 focus:border-oxide";

function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="tag block text-quarry-400">
      {children}
      {optional && (
        <span className="ml-2 font-normal tracking-normal text-quarry-500 lowercase">
          · optional
        </span>
      )}
    </label>
  );
}

function Legend({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <legend className="mb-8 flex w-full items-center gap-4 border-b border-quarry-800 pb-4">
      <span className="tag text-oxide">{index}</span>
      <span className="text-[0.9375rem] tracking-[-0.01em] text-bone">
        {children}
      </span>
    </legend>
  );
}

export function AuditForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setState("sending");
    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      await submit(payload);
      setState("done");
      form.reset();
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div
        role="status"
        tabIndex={-1}
        className="settle mt-14 border border-quarry-700 bg-quarry-900 p-8 sm:p-12 lg:mt-16"
      >
        <Mark className="h-8 w-8 text-oxide" title="Corehold" />
        <p className="tag mt-8 text-oxide">Request logged</p>
        <h2 className="mt-5 max-w-[20ch] text-minor text-bone">
          We&apos;ll read it properly before we reply.
        </h2>
        <ol className="mt-10 max-w-[60ch] space-y-0 border-t border-quarry-800">
          {[
            [
              "Within two working days",
              "A person — not a sequence — replies with either a time to talk or an honest reason we are not the right studio for this.",
            ],
            [
              "The first conversation",
              "Forty-five minutes on how the business actually operates. No deck, no pitch. We are working out whether an audit would find anything worth acting on.",
            ],
            [
              "Then, only if it earns it",
              "A scoped audit with a fixed fee and a fixed window. If the audit concludes you should not build anything, that is what it will say.",
            ],
          ].map(([term, detail], i) => (
            <li
              key={term}
              className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-quarry-800 py-5"
            >
              <span className="tag pt-1 text-quarry-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block text-[0.9375rem] font-medium text-bone">
                  {term}
                </span>
                <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-quarry-400">
                  {detail}
                </span>
              </span>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="tag mt-9 text-quarry-400 underline underline-offset-4 transition-colors hover:text-oxide"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate={false}
      className="mt-14 space-y-14 lg:mt-16"
    >
      <fieldset className="border-0 p-0">
        <Legend index="01">The company</Legend>
        <div className="grid gap-7 sm:grid-cols-2">
          <div>
            <Label htmlFor="company">Company name</Label>
            <input
              id="company"
              name="company"
              required
              autoComplete="organization"
              className={fieldBase}
              placeholder="Legal or trading name"
            />
          </div>
          <div>
            <Label htmlFor="website" optional>
              Website
            </Label>
            <input
              id="website"
              name="website"
              type="url"
              autoComplete="url"
              className={fieldBase}
              placeholder="https://"
            />
          </div>
          <div>
            <Label htmlFor="size">People in the company</Label>
            <select id="size" name="size" required className={fieldBase} defaultValue="">
              <option value="" disabled>
                Select a range
              </option>
              <option>1–10</option>
              <option>11–50</option>
              <option>51–200</option>
              <option>201–1,000</option>
              <option>1,000+</option>
            </select>
          </div>
          <div>
            <Label htmlFor="spend">Annual spend on software subscriptions</Label>
            <select id="spend" name="spend" required className={fieldBase} defaultValue="">
              <option value="" disabled>
                Select a range
              </option>
              <option>Under 50,000</option>
              <option>50,000 – 250,000</option>
              <option>250,000 – 1,000,000</option>
              <option>Over 1,000,000</option>
              <option>We have never totalled it</option>
            </select>
          </div>
        </div>
        <p className="mt-4 font-mono text-xs text-quarry-500">
          Ranges in any currency. &ldquo;We have never totalled it&rdquo; is a
          common and entirely respectable answer.
        </p>
      </fieldset>

      <fieldset className="border-0 p-0">
        <Legend index="02">The stack</Legend>
        <div className="space-y-7">
          <div>
            <Label htmlFor="tools">
              What is currently running the business?
            </Label>
            <textarea
              id="tools"
              name="tools"
              required
              rows={4}
              className={fieldBase}
              placeholder="The tools you pay for, the spreadsheets doing real work, and the steps someone performs by hand between them."
            />
          </div>
          <div>
            <Label htmlFor="leak" optional>
              Where do you already suspect the leak is?
            </Label>
            <textarea
              id="leak"
              name="leak"
              rows={3}
              className={fieldBase}
              placeholder="Most people know. It's usually the process everyone complains about and nobody owns."
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="border-0 p-0">
        <Legend index="03">You</Legend>
        <div className="grid gap-7 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Your name</Label>
            <input
              id="name"
              name="name"
              required
              autoComplete="name"
              className={fieldBase}
              placeholder="First and last"
            />
          </div>
          <div>
            <Label htmlFor="role">Your role</Label>
            <input
              id="role"
              name="role"
              required
              autoComplete="organization-title"
              className={fieldBase}
              placeholder="Founder, COO, CTO…"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="email">Work email</Label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={fieldBase}
              placeholder="you@company.com"
            />
          </div>
        </div>
      </fieldset>

      <div className="flex flex-col gap-6 border-t border-quarry-800 pt-9 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[42ch] font-mono text-xs leading-relaxed text-quarry-500">
          We read every request ourselves. If we are not the right studio for
          this, we will say so and tell you what we would do instead.
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={state === "sending"}
          trailing={state === "sending" ? null : <Arrow />}
        >
          {state === "sending" ? "Sending…" : "Request the audit"}
        </Button>
      </div>

      {state === "error" && (
        <p role="alert" className="font-mono text-sm text-oxide-bright">
          Something went wrong sending that. Message{" "}
          <a
            className="underline"
            href={whatsappHref(whatsappOpeners.audit)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {site.phoneDisplay}
          </a>{" "}
          on WhatsApp, or email{" "}
          <a className="underline" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          , and we will pick it up from there.
        </p>
      )}
    </form>
  );
}
