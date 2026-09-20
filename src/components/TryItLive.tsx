"use client";

import { FormEvent, ReactNode, useEffect, useId, useState } from "react";

export type DemoStatus =
  | "idle"
  | "submitting"
  | "calling"
  | "fieldError"
  | "capacity"
  | "unsupported"
  | "unavailable";

type DemoErrors = {
  firstName?: string;
  phone?: string;
  consent?: string;
};

type TryItLiveProps = {
  status?: DemoStatus;
  errors?: DemoErrors;
  onSubmit?: (value: { firstName: string; phone: string; consent: boolean }) => void;
  turnstileSlot?: ReactNode;
  sampleCallSlot?: ReactNode;
  onBookCall?: () => void;
  variant?: "light" | "dark";
};

type PreviewState = DemoStatus | "valid";

const previewStates: PreviewState[] = [
  "idle",
  "valid",
  "fieldError",
  "submitting",
  "calling",
  "capacity",
  "unsupported",
  "unavailable",
];

function PhoneIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.2 3.6 9.7 8l-2 1.8c1.1 2.5 3 4.4 5.5 5.5l1.8-2 4.4 2.5-.8 3.1c-.2.8-.9 1.4-1.8 1.4C9.6 20.3 3.7 14.4 3.7 7.2c0-.9.6-1.6 1.4-1.8l2.1-.8Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="size-4 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 10 3.5 3.5L16 5.5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="mt-0.5 size-4 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" />
      <path strokeLinecap="round" d="M10 6.5v4M10 13.5h.01" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="size-4 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinejoin="round" d="M10 2.8 16 5v4.3c0 3.8-2.4 6.4-6 7.9-3.6-1.5-6-4.1-6-7.9V5l6-2.2Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m7.3 10 1.7 1.7 3.7-4" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="size-5 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" fill="currentColor" d="M12 3a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6V3Z" />
    </svg>
  );
}

function SampleCall({ slot, variant }: { slot?: ReactNode; variant: "light" | "dark" }) {
  return (
    <div className="mt-5 border-t border-outline-variant pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={`font-body-md text-sm ${variant === "dark" ? "text-inverse-on-surface" : "text-on-surface-variant"}`}>
          Prefer to listen first? <a href="#sample-call" className={`font-medium underline decoration-outline-variant underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container ${variant === "dark" ? "text-primary-fixed" : "text-primary"}`}>Hear a sample call</a>
        </p>
        {slot ? <div id="sample-call" className="min-w-0">{slot}</div> : <div id="sample-call" className="h-11 w-40 rounded-lg border border-outline-variant bg-surface-container" aria-label="Sample call player slot" />}
      </div>
    </div>
  );
}

function OutcomeActions({ onBookCall, onRetry, sampleCallSlot }: { onBookCall?: (() => void) | undefined; onRetry?: (() => void) | undefined; sampleCallSlot?: ReactNode }) {
  return (
    <div className="mt-8 w-full space-y-3">
      {onRetry ? (
        <button type="button" onClick={onRetry} className="flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 py-3 font-space font-semibold text-on-primary transition-[transform,opacity] duration-200 hover:opacity-90 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest">
          Try again
        </button>
      ) : (
        <button type="button" onClick={onBookCall} className="flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 py-3 font-space font-semibold text-on-primary transition-[transform,opacity] duration-200 hover:opacity-90 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest">
          Book a 15-minute call
        </button>
      )}
      <a href="#sample-call" className="flex min-h-11 w-full items-center justify-center rounded-xl border border-outline-variant px-4 font-space font-semibold text-on-surface transition-colors duration-200 hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        Hear a sample call
      </a>
      {sampleCallSlot ? <div id="sample-call" className="pt-2">{sampleCallSlot}</div> : null}
    </div>
  );
}

export default function TryItLive({
  status = "idle",
  errors = {},
  onSubmit,
  turnstileSlot,
  sampleCallSlot,
  onBookCall,
  variant = "light",
}: TryItLiveProps) {
  const [previewState, setPreviewState] = useState<PreviewState>(status);
  const [previewVariant, setPreviewVariant] = useState<"light" | "dark">(variant);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const nameId = useId();
  const phoneId = useId();
  const consentId = useId();

  const activeStatus: DemoStatus = previewState === "valid" ? "idle" : previewState;
  const activeErrors: DemoErrors = activeStatus === "fieldError"
    ? {
        firstName: errors.firstName ?? "Enter your first name.",
        phone: errors.phone ?? "Enter a valid US or Canadian mobile number.",
        ...(errors.consent ? { consent: errors.consent } : {}),
      }
    : errors;
  const digits = phone.replace(/\D/g, "");
  const plausiblePhone = digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
  const isValid = firstName.trim().length > 0 && plausiblePhone && consent;
  const isSubmitting = activeStatus === "submitting";

  useEffect(() => {
    if (activeStatus !== "calling") {
      setElapsed(0);
      return;
    }
    const startedAt = Date.now();
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [activeStatus]);

  const choosePreviewState = (next: PreviewState) => {
    setPreviewState(next);
    if (next === "valid" || next === "submitting" || next === "calling") {
      setFirstName("Alex");
      setPhone("(415) 555-0142");
      setConsent(true);
    } else if (next === "fieldError") {
      setFirstName("");
      setPhone("123");
      setConsent(false);
    } else if (next === "idle") {
      setFirstName("");
      setPhone("");
      setConsent(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || isSubmitting) return;
    onSubmit?.({ firstName: firstName.trim(), phone, consent });
    if (!onSubmit) setPreviewState("calling");
  };

  const sectionTone = previewVariant === "dark"
    ? "bg-inverse-surface text-inverse-on-surface"
    : "bg-surface text-on-surface";
  const secondaryTone = previewVariant === "dark" ? "text-inverse-on-surface" : "text-on-surface-variant";

  return (
    <section className={`${sectionTone} font-body-md`} aria-labelledby="try-it-live-heading">
      {/* PREVIEW ONLY - REMOVE */}
      <div className="border-b border-outline-variant px-4 py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2" aria-label="Preview controls">
          <span className={`mr-1 font-mono-custom text-xs uppercase ${secondaryTone}`}>Preview</span>
          {previewStates.map((item) => (
            <button key={item} type="button" onClick={() => choosePreviewState(item)} aria-pressed={previewState === item} className={`min-h-11 rounded-lg border px-3 py-2 font-mono-custom text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container ${previewState === item ? "border-primary-container bg-primary-container text-on-primary-container" : "border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"}`}>
              {item}
            </button>
          ))}
          <button type="button" onClick={() => setPreviewVariant(previewVariant === "light" ? "dark" : "light")} className="min-h-11 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 font-mono-custom text-xs text-on-surface transition-colors duration-200 hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container">
            {previewVariant === "light" ? "dark variant" : "light variant"}
          </button>
        </div>
      </div>
      {/* PREVIEW ONLY - REMOVE */}

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-16 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(28rem,0.88fr)] lg:grid-rows-[auto_1fr] lg:py-24">
        <div className="lg:pr-4">
          <p className={`font-mono-custom text-xs font-semibold uppercase tracking-[0.2em] ${previewVariant === "dark" ? "text-primary-fixed" : "text-primary"}`}>TRY IT LIVE</p>
          <h2 id="try-it-live-heading" className="mt-5 max-w-xl font-space text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
            Let our AI call you. Right now.
          </h2>
          <p className={`mt-6 max-w-xl font-body-lg text-lg leading-8 ${secondaryTone}`}>
            Enter your number and Estanza's voice agent calls you within seconds, the same first call your new leads would get.
          </p>
          <ul className="mt-7 flex flex-wrap gap-2" aria-label="Demo assurances">
            {["One call only", "AI voice, clearly disclosed", "No sales pitch"].map((chip) => (
              <li key={chip} className={`flex min-h-11 items-center gap-2 rounded-full border border-outline-variant px-4 py-2 text-sm ${previewVariant === "dark" ? "bg-inverse-surface text-inverse-on-surface" : "bg-surface-container-low text-on-surface-variant"}`}>
                <CheckIcon />{chip}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0">
          <div className="min-h-[46rem] rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 text-on-surface shadow-sm sm:p-8">
            {activeStatus === "calling" ? (
              <div className="flex min-h-[40rem] flex-col items-center justify-center text-center" role="status" aria-live="polite">
                <div className="relative grid size-24 place-items-center rounded-full bg-secondary-container text-on-secondary-container">
                  <span className="absolute inset-0 rounded-full border-2 border-primary-container animate-[calling-pulse_2s_ease-out_infinite] motion-reduce:animate-none" />
                  <PhoneIcon className="size-9" />
                </div>
                <h3 className="mt-8 font-space text-3xl font-semibold">Calling you now</h3>
                <p className="mt-3 max-w-sm font-body-lg leading-7 text-on-surface-variant">Pick up in a few seconds. The call comes from a US number.</p>
                <p className="mt-7 font-mono-custom text-lg text-primary" aria-label={`${elapsed} seconds elapsed`}>00:{String(elapsed).padStart(2, "0")}</p>
                <div className={`mt-8 min-h-20 max-w-sm border-t border-outline-variant pt-6 text-sm leading-6 text-on-surface-variant transition-opacity duration-200 ${elapsed >= 30 ? "opacity-100" : "opacity-0"}`} aria-hidden={elapsed < 30}>
                  Nothing yet? Check that your phone isn't silencing unknown callers, or hear the sample below.
                </div>
              </div>
            ) : activeStatus === "capacity" || activeStatus === "unsupported" || activeStatus === "unavailable" ? (
              <div className="flex min-h-[40rem] flex-col items-center justify-center text-center" role="status" aria-live="polite">
                <div className="grid size-16 place-items-center rounded-full bg-secondary-container text-on-secondary-container"><PhoneIcon className="size-7" /></div>
                <h3 className="mt-7 max-w-sm font-space text-2xl font-semibold">
                  {activeStatus === "capacity" && "Today's live demo slots are full."}
                  {activeStatus === "unsupported" && "The live demo currently supports US and Canadian numbers."}
                  {activeStatus === "unavailable" && "We couldn't start the call. Please try again, or hear a sample call."}
                </h3>
                <OutcomeActions onBookCall={onBookCall} onRetry={activeStatus === "unavailable" ? () => setPreviewState("idle") : undefined} sampleCallSlot={sampleCallSlot} />
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
                <div className="flex items-start gap-3 border-b border-outline-variant pb-6">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary-container text-on-secondary-container"><ShieldIcon /></span>
                  <div>
                    <h3 className="font-space text-xl font-semibold">Request your demo call</h3>
                    <p className="mt-1 text-sm leading-6 text-on-surface-variant">Your number is used for this one-time demonstration.</p>
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <label htmlFor={nameId} className="mb-2 block font-body-md text-sm font-medium">First name</label>
                    <input id={nameId} type="text" autoComplete="given-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} disabled={isSubmitting} aria-invalid={Boolean(activeErrors.firstName)} aria-describedby={activeErrors.firstName ? `${nameId}-error` : undefined} className="min-h-12 w-full rounded-xl border border-outline-variant bg-surface-container px-4 font-body-md text-base text-on-surface outline-none transition-[box-shadow,border-color,background-color] duration-200 placeholder:text-on-surface-variant hover:bg-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary-container focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60" />
                    {activeErrors.firstName ? <p id={`${nameId}-error`} className="mt-2 flex items-start gap-2 text-sm text-on-surface" aria-live="polite"><AlertIcon />{activeErrors.firstName}</p> : null}
                  </div>
                  <div>
                    <label htmlFor={phoneId} className="mb-2 block font-body-md text-sm font-medium">Mobile number</label>
                    <input id={phoneId} type="tel" inputMode="tel" autoComplete="tel-national" value={phone} onChange={(event) => setPhone(event.target.value)} disabled={isSubmitting} aria-invalid={Boolean(activeErrors.phone)} aria-describedby={`${phoneId}-help${activeErrors.phone ? ` ${phoneId}-error` : ""}`} className="min-h-12 w-full rounded-xl border border-outline-variant bg-surface-container px-4 font-body-md text-base text-on-surface outline-none transition-[box-shadow,border-color,background-color] duration-200 placeholder:text-on-surface-variant hover:bg-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary-container focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60" />
                    <p id={`${phoneId}-help`} className="mt-2 text-sm text-on-surface-variant">US or Canada numbers only</p>
                    {activeErrors.phone ? <p id={`${phoneId}-error`} className="mt-2 flex items-start gap-2 text-sm text-on-surface" aria-live="polite"><AlertIcon />{activeErrors.phone}</p> : null}
                  </div>

                  <div className="min-h-[4.063rem] rounded-xl border border-outline-variant bg-surface-container-low p-3">
                    {turnstileSlot ?? <div className="flex min-h-[2.5rem] items-center gap-2 text-sm text-on-surface-variant"><ShieldIcon />Security verification slot</div>}
                  </div>

                  <div>
                    <label htmlFor={consentId} className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-on-surface-variant">
                      <input id={consentId} type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} disabled={isSubmitting} aria-invalid={Boolean(activeErrors.consent)} aria-describedby={activeErrors.consent ? `${consentId}-error` : undefined} className="mt-1 size-5 shrink-0 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60" />
                      <span>By clicking &quot;Call me now,&quot; I authorize Estanza to call the number above once, using an AI-generated voice, to demonstrate its voice agent. Consent is not a condition of any purchase. I can say &quot;stop&quot; during the call to opt out. (<a href="/privacy" className="font-medium text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Privacy</a> and <a href="/terms" className="font-medium text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Terms</a>)</span>
                    </label>
                    {activeErrors.consent ? <p id={`${consentId}-error`} className="mt-2 flex items-start gap-2 text-sm text-on-surface" aria-live="polite"><AlertIcon />{activeErrors.consent}</p> : null}
                  </div>
                </div>

                <button type="submit" disabled={!isValid || isSubmitting} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-space font-semibold text-on-primary transition-[transform,opacity] duration-200 hover:opacity-90 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100">
                  {isSubmitting ? <><Spinner />Connecting...</> : "Call me now"}
                </button>
              </form>
            )}
          </div>
          <SampleCall slot={sampleCallSlot} variant={previewVariant} />
        </div>

        <div className="mt-14 lg:col-start-1 lg:row-start-2 lg:self-end lg:pr-8">
          <ol className="border-t border-outline-variant">
            {[
              ["01", "You submit"],
              ["02", "Your phone rings"],
              ["03", "The agent qualifies you and offers a slot"],
            ].map(([number, label]) => (
              <li key={number} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-outline-variant py-4">
                <span className={`font-mono-custom text-sm ${previewVariant === "dark" ? "text-primary-fixed" : "text-primary"}`}>{number}</span>
                <span className="font-body-md text-sm font-medium">{label}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
