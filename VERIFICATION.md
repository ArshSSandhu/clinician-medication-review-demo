# Verification notes

These notes distinguish automated results, agent browser checks, and user-reported observations. A passing check covers only the behavior described below. No result is inferred from general approval of the design.

## Automated checks performed by the agent

Final application-source checks on 2026-10-09 used Node.js 24.19.0 and pnpm 11.25.0:

| Check | Observed result |
| --- | --- |
| `pnpm test` | 12 passed; 0 failed; 0 skipped |
| Strict TypeScript checking (`tsc --noEmit`, included in `pnpm build`) | Passed with no diagnostics |
| Vite production build (`pnpm build`) | Passed |

Eight data-model tests cover:

1. Rejecting an empty recorded allergy history instead of converting it to a negative.
2. Rejecting an empty recorded medication history.
3. Distinguishing explicit negative histories from unknown histories and generating unknown-history notices.
4. Retaining known allergies with missing details and retaining unknown medication status.
5. Retaining discontinued medication details and reporting a missing discontinuation date.
6. Reporting missing review dates and prior visit summary.
7. Formatting a supplied calendar date without timezone conversion.
8. Validating supplied fixture IDs and rejecting duplicate patient IDs.

Four focused behavior tests cover:

1. React-rendered unknown allergy history remains distinct from known allergy entries and the separate explicit `No known allergies` state.
2. Missing medication dose and frequency render as `Not recorded`, with missing-information notices and no inferred status changes.
3. A discontinued medication row retains dose/frequency and contains a textual `Discontinued` badge and missing-date label.
4. Checking and unchecking one task preserves another checked task, other patients' state, and the original state objects.

The rendering tests use the actual React components with `renderToStaticMarkup`. The checklist test exercises the updater used by the app. These tests do not simulate browser events, apply CSS, or establish screen-reader usability. Their HTML assertions are focused on the supplied fixtures, not every possible input.

## Agent browser checks

The agent inspected the running development app in the Codex in-app browser during implementation and subsequent reviews. These were interactive checks, not a committed automated browser suite.

Observed results:

- All four fictional fixtures displayed their distinct recorded, explicit-negative, and unknown history states.
- Avery's recorded counts were active 0, discontinued 0, and unknown 1; the only full medication group was unknown, directly after the summary.
- Mina's populated groups retained active-before-discontinued order; the empty unknown group was omitted.
- Explicit-negative and unknown medication histories retained their own wording and did not display numeric zero counts.
- Known allergies stayed visible when reaction or severity was not recorded.
- Missing medication fields and discontinued status had explicit text labels.
- Checklist state remained scoped to each patient while switching fixtures; reload reset was checked during the initial implementation pass.
- Tab reached the patient selector, medication table scroll regions, and checklist. Visible focus outlines appeared. Space toggled a checklist item. Keyboard patient selection updated the workspace once the selection was committed. The skip link led keyboard navigation into the workspace.
- Wide and stacked layouts were inspected. Narrow-layout measurements showed no page-wide horizontal overflow at the inspected sizes; tables could overflow within their scroll regions.
- Browser warnings/errors were not captured during the recorded fixture checks. This does not guarantee no errors in other browsers or scenarios.

Review findings that remain unresolved:

- In the stacked layout and DOM reading order, allergies follow medications and the prior visit summary.
- Status badges are approximately 11.4px; some labels may be small for rapid scanning.
- Explanatory copy adds scanning effort; the zero-active explanation appears even when active entries exist.
- `Explicit negative` is less direct wording than the main `No known allergies` heading.

The browser checks above used the development server. Production-build rendering was not separately inspected in a browser. Browser screenshots and machine-specific details are excluded from this submission.

## User-performed/reported observations

The user visually reviewed previews and reported that the app looked good. The user also supplied an Avery screenshot and identified that empty active/discontinued sections delayed scanning to the unknown-status medication. That reported issue led to the compact count-summary change.

The conversation contains **no explicit user-reported execution results** for automated commands, keyboard interactions, screen-reader checks, or a formal acceptance test suite. Those checks are not attributed to the user. General positive feedback is recorded as visual feedback, not proof of specific test outcomes.

## Checks not performed or not established

- Full screen-reader testing and announcement behavior.
- Contrast compliance, high-contrast mode, or a formal accessibility audit.
- Cross-browser testing, real mobile-device testing, and every responsive/zoom size.
- Browser-event regression tests in the automated suite.
- Populated discontinuation-date rendering in a fixture; supplied discontinued data has a missing date.
- Comprehensive malformed-input validation, ingestion of external data, or date-format validation.
- A dedicated dependency vulnerability audit or clinical validation.
- GitHub-hosted CI checks or deployment checks.

## Suggested manual checks for the reviewer

These are instructions, not claimed completed results:

1. Select each fixture and compare recorded histories, explicit negatives, and unknown histories.
2. For Avery, confirm the 0/0/1 summary and direct access to the unknown-status medication, without empty full sections.
3. For Mina, check two tasks, then uncheck one; confirm the other stays checked. Repeat with keyboard Space. Switch patients and return, then reload to check the documented temporary-state behavior.
4. Inspect text labels without relying on colors, at comfortable zoom and on a narrow window. Confirm visible keyboard focus and usable table scrolling.
5. Check heading/table reading order and checklist announcements with your preferred screen reader.

## Clean submission-package checks

On 2026-10-09, the agent copied this submission's runnable files into a separate,
initially dependency-free validation directory and ran:

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
```

All commands passed. Installation reused packages from the package-manager cache;
it was not a test of registry access from a new machine. The copied source produced
12 passing tests, no failed/skipped tests, a successful strict TypeScript check, and
a successful production build. Dependencies and generated assets remained in the
separate validation directory and are not part of the submission.

The submission was assembled from an explicit file allowlist rather than copying
the development directory wholesale. No original Git repository/history,
installed dependency directory, generated build directory, screenshots, or
machine-specific runtime setup is included.
