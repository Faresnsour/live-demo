# Live Demo

You are a senior product designer + front-end engineer. Design and build ONE section for an existing marketing website. It must look like it was always part of the site: same brand, same palette, same fonts, just cleaner, clearer and more trustworthy.

## Product context

Estanza (estanza.dev) sells AI voice agents to small service businesses (clinics, home services, real estate). When a new lead fills out a form, the agent calls them within seconds, answers questions, qualifies them and books an appointment. Audience: busy business owners in the US. Tone: confident, precise, calm. No hype, no jargon, no emojis.

## The section: "Try it live"

A visitor types their first name and mobile number, ticks a consent box, and Estanza's AI voice agent phones them once as a demo. This is the most important trust-building moment on the site, so the form must feel safe, fast and legitimate.

### Layout

- Desktop (>=1024px): two columns. Left: eyebrow, H2, subcopy, three trust chips, a compact 3-step "what happens next" timeline. Right: the form card.

- Mobile: single column: headline, then card, then timeline. Card is full-width, inputs >= 48px tall, tap targets >= 44px.

- Under the card: a quiet secondary row "Prefer to listen first? Hear a sample call" with a slot for an audio player.

- Deliver two variants with identical content and states: A) light (bg-surface), B) dark band (bg-inverse-surface, text-inverse-on-surface).

### Copy (use exactly, English only)

- Eyebrow (mono, uppercase, wide tracking): TRY IT LIVE

- H2: Let our AI call you. Right now.

- Subcopy: Enter your number and Estanza's voice agent calls you within seconds, the same first call your new leads would get.

- Chips: One call only / AI voice, clearly disclosed / No sales pitch

- Timeline (mono numerals): 01 You submit / 02 Your phone rings / 03 The agent qualifies you and offers a slot

- Fields: "First name", "Mobile number" with helper text "US or Canada numbers only"

- Consent checkbox (unchecked by default, whole label clickable): By clicking "Call me now," I authorize Estanza to call the number above once, using an AI-generated voice, to demonstrate its voice agent. Consent is not a condition of any purchase. I can say "stop" during the call to opt out. (with inline links "Privacy" and "Terms")

- Button: Call me now (loading label: Connecting...)

- Security slot: reserved area (min-h 65px) for a Cloudflare Turnstile widget, exposed in code as {turnstileSlot}.

### States (variants of the SAME card, fixed min-height so nothing jumps)

1. idle: empty form, button disabled until name, plausible phone and consent are present.

2. valid: button enabled.

3. fieldError: inline error under the offending field (icon + text, never color alone), wired with aria-describedby.

4. submitting: button shows spinner + "Connecting...", inputs disabled.

5. calling: card swaps to a confirmation: pulsing ring around a phone icon, "Calling you now", "Pick up in a few seconds. The call comes from a US number.", and a mono elapsed timer. After 30 seconds reveal: "Nothing yet? Check that your phone isn't silencing unknown callers, or hear the sample below."

6. capacity: "Today's live demo slots are full." + "Hear a sample call" + primary "Book a 15-minute call" button.

7. unsupported: "The live demo currently supports US and Canadian numbers." + the same two fallbacks.

8. unavailable: "We couldn't start the call. Please try again, or hear a sample call." + retry button.

## Design system (MUST follow exactly; no other colors, fonts or color sources)

Tailwind utilities map 1:1 to token names (e.g. bg-surface-container-lowest, text-on-surface-variant, border-outline-variant, bg-primary, text-on-primary, bg-primary-container).

Colors:

surface #f8faf9 (page bg) | surface-variant #e0e3e8 | surface-container-lowest #ffffff (cards) | surface-container-low #f1f4f3 | surface-container #e9edeb (inputs) | surface-container-high #e3e8e6 (hover) | surface-container-highest #dde3e1 | on-surface #191c1b (primary text) | on-surface-variant #404946 (secondary text) | inverse-surface #2e3130 (dark sections) | inverse-on-surface #eff1ef | primary #006b5e (brand, main CTA) | primary-container #00d1b2 (bright accent: pulse ring, focus glow, highlights) | on-primary #ffffff | on-primary-container #00201b | primary-fixed #8ff8e5 | on-primary-fixed #00201b | secondary #4b635e | secondary-container #cde8e1 | on-secondary-container #08201b | outline-variant #bec9c5 (borders)

Fonts:

Space Grotesk = class font-space (headlines, button labels) | Geist = class font-body-md / font-body-lg (body, inputs, helper text) | JetBrains Mono = class font-mono-custom (eyebrow, timeline numerals, timer, number displays)

If your preview needs a Tailwind config to render, extend theme colors and fontFamily with exactly these names. I will discard your config and use mine, so never use arbitrary hex values or non-token classes in the markup.

## Design direction

- It should feel like the rest of the site: generous whitespace, hairline borders (border-outline-variant), soft rounded cards (rounded-2xl), a very subtle shadow, teal used sparingly for emphasis. "Better" means clearer hierarchy, a form that obviously looks safe and legitimate, larger touch targets, calmer motion.

- Card: bg-surface-container-lowest with a 1px outline-variant border. Inputs: bg-surface-container; focus ring in primary plus a soft primary-container glow.

- Primary CTA: bg-primary text-on-primary, font-space, full width inside the card, with clear hover / active / disabled / focus-visible states.

- Motion: CSS only (transform/opacity), 150-250ms, one gentle pulse for the calling state. Respect prefers-reduced-motion. No animation libraries. No layout shift.

- Icons: small inline SVGs only (phone, check, alert, shield). No icon packages, images, external fonts or assets.

## Accessibility

WCAG AA contrast, visible labels (not placeholder-only), errors announced via aria-live="polite", the calling state has role="status", full keyboard operation, focus-visible rings. Inputs: phone uses type="tel" inputMode="tel" autoComplete="tel-national"; name uses type="text" autoComplete="given-name".

## Deliverable

One self-contained React + TypeScript + Tailwind file, TryItLive.tsx, "use client", default export, renders standalone with no required props. Optional props:

type DemoStatus = "idle" | "submitting" | "calling" | "fieldError" | "capacity" | "unsupported" | "unavailable";

{ status?: DemoStatus; errors?: { firstName?: string; phone?: string; consent?: string }; onSubmit?: (v: { firstName: string; phone: string; consent: boolean }) => void; turnstileSlot?: ReactNode; sampleCallSlot?: ReactNode; onBookCall?: () => void; variant?: "light" | "dark" }

Include a tiny preview-only state switcher at the top, wrapped in a clearly marked {/* PREVIEW ONLY - REMOVE */} block, so I can click through every state. No dependencies beyond React.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cd34ea91-44a5-48e2-b34a-3a33c9b84f2b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
