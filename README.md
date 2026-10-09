# Fictional clinician medication review workspace

A small React and TypeScript demonstration for a clinician preparing for a live visit. It helps the clinician scan recorded medications, allergy history, missing information, a prior visit summary, and follow-up tasks.

**Demonstration only. All names and records are fictional. This is not a clinical decision tool.**

## Scope

The app includes four local patient fixtures with realistic missing-information cases, a patient selector, medication histories, allergy histories, a short prior visit summary, and a preparation checklist. Medication rows show name, dose, frequency, and textual status.

There are no prescribing recommendations, drug-interaction checks, real patient records, authentication, external APIs, database, analytics, or LLM integration. The application runs locally. The checklist is stored only in memory and resets on reload.

## Setup and commands

Use **Node.js 24** and **pnpm 11.25.0**, the versions used for verification. If pnpm is not installed, install that version using your preferred package-manager setup, for example:

```sh
npm install --global pnpm@11.25.0
```

From this project directory:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL Vite prints, normally `http://127.0.0.1:5173/`. If that port is occupied, Vite selects another. Stop the server with Ctrl+C.

To run automated checks and build:

```sh
pnpm test
pnpm build
```

`pnpm build` runs strict TypeScript checking followed by Vite's production build. To serve the resulting build locally:

```sh
pnpm preview
```

The lock file fixes the resolved dependency graph. React and React DOM are the only runtime dependencies. Vite, TypeScript, and React type definitions are development dependencies. Tests use Node's built-in runner and React's server renderer; no extra test framework is required. Dependency installation needs registry access; the running application has no external-data requests. Vite's development tooling uses a local connection for hot reload.

## Design decisions

- **Missing information is explicit.** Missing dose, frequency, reaction, or severity is represented by `null` and displayed as `Not recorded`. The app does not infer a default value.
- **History state is separate from list contents.** Medication history is `recorded`, `explicitly-none-reported`, or `unknown`. Allergy history is `known`, `no-known-allergies`, or `unknown`. Recorded/known histories require nonempty entries; an empty array never becomes an explicit negative assertion.
- **Status describes the record.** Active does not establish current use. Discontinued entries retain dose and frequency, show a textual `Discontinued` badge, and display a recorded discontinuation date or its missing label.
- **Counts support scanning.** Recorded histories show counts for active, discontinued, and unknown statuses. Only groups containing entries render full tables, in that order. Zero recorded active entries does not establish that the patient takes no medications. Explicit negative and unknown histories use separate statements without numeric counts.
- **Allergy states retain their meaning.** Known substances remain visible when reaction or severity is missing. `No known allergies` is an explicit recorded statement, not a conclusion drawn from absent information; unknown status has its own heading and explanation.
- **Missing-information notices are deterministic.** They report gaps in the supplied fixtures, including historical discontinued entries. They do not establish clinical priority or risk.
- **Dates do not establish verification.** Review dates and prior visit dates are displayed as literal calendar dates; no freshness, completeness, or reconciliation is inferred.
- **Checklist completion is independent.** Checks are kept per patient and do not change medication or allergy records or establish clinical verification.
- **Color is supplementary.** Medication and allergy states use headings and text; checklist completion has a native checkmark and strikethrough. Controls have labels and visible focus styles, and tables can scroll within their panels on narrow screens.

## Source map

| File | Purpose |
| --- | --- |
| `src/fixtures.ts` | Four entirely fictional patient histories and preparation tasks |
| `src/model.ts` | Domain types, limited fixture validation, missing-information notices, date formatting |
| `src/App.tsx` | React workspace, medication/allergy components, patient selection, checklist wiring |
| `src/checklist.ts` | Immutable checklist state update |
| `src/main.tsx` | Application entry point |
| `src/styles.css` | Responsive layout, typography, textual badges, and focus styles |
| `tests/model.test.mjs` | Eight data-model tests |
| `tests/behavior.test.mjs` | Four rendering/state tests |
| `tests/tsx-loader.mjs` | Loads JSX for the existing Node test runner using TypeScript |

## Acceptance criteria

- Medication rows show name, dose, frequency, and text status with explicit missing-value labels.
- Active, discontinued, and unknown medication statuses are distinguishable without color; populated groups preserve their order.
- Known allergies, explicitly recorded no known allergies, and unknown allergy history are distinct.
- Missing details do not erase known allergies or imply negative histories.
- Prior visit summaries display their dates, or an unavailable state.
- Checklist items toggle independently, with separate state per patient.
- No displayed completion or absence of detected gaps establishes a complete or current clinical history.
- The selector and checklist are keyboard reachable, with visible focus; narrow layouts stack and tables scroll internally.
- Automated tests, strict TypeScript checking, and production build pass.

## Limitations

- Local fixture validation checks nonempty recorded histories and duplicate IDs; it is not a complete validator for arbitrary external input. Missing values are expected to be `null`, not empty strings or malformed data.
- The fixtures and summaries are authored demonstration content and have not undergone clinical validation. Do not use the app for actual clinical decisions or patient records.
- Checklist state is temporary; there is no durable storage or multiuser behavior.
- Automated rendering tests inspect HTML and state logic, not CSS, browser events, or screen-reader output. See `VERIFICATION.md` for the exact evidence and remaining manual checks.
- Browser review found small status text (approximately 11.4px), repeated explanatory copy, and allergies appearing after the prior visit summary in stacked layouts. These remain usability limitations; no additional features were added after the agreed scope was complete.
- Full screen-reader testing, contrast/high-contrast verification, cross-browser/device testing, and a dedicated dependency vulnerability audit have not been performed.

## Submission contents

This folder includes only authored application source, tests, dependency manifests and lock file, setup configuration, and documentation. It excludes installed dependencies, build output, Git history, screenshots, environment files, credentials, machine-specific paths, personal information, and unrelated/proprietary material. The synthetic names in the fixtures are demonstration data.
