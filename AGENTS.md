# Collaboration Guide

This file defines the normal workflow for this repository. Hard project boundaries are in `AGENTS.override.md`; more specific instructions closer to a target file take precedence.

## Start with the repository

- Reconstruct the complete request from the current conversation before acting, especially after a summarized or interrupted task.
- Read the relevant implementation, tests, documentation, and configuration before changing them.
- Confirm ownership and call paths rather than designing from assumptions.
- Preserve unrelated user changes and make the smallest coherent change that solves the requested problem.

## Repository responsibilities

- `src/` contains the published component, types, request helpers, and chunk-upload implementation.
- `docs/` contains the documentation application, examples, translations, and the HTML template.
- `test/` contains automated behavior tests.
- Root JavaScript, TypeScript, Babel, ESLint, Vitest, Rollup, Webpack, browser, and package files define development, build, test, and release behavior.
- `TESTING.md` is the authority for verification scope and commands. Keep command details there instead of duplicating them in other instructions.

## Implementation and documentation

- Follow the existing Vue, JavaScript, and TypeScript style in the target area.
- Keep state and behavior near the component or helper that owns them. Add abstractions only when there is a concrete repeated responsibility or contract.
- Validate external input and preserve useful error context. Do not hide failures with broad fallbacks.
- Synchronize public behavior changes across source types, tests, English and Chinese documentation, and examples.
- Keep English and Chinese content semantically aligned when editing user-facing documentation.
- Keep generated files tied to their declared source and build process.

## Dependencies and configuration

- Upgrade only dependencies included in the task. Update `package.json` and `package-lock.json` together.
- Check changelogs or official APIs for major upgrades and update every affected integration.
- Keep configuration simple and explicit. Do not add one-off compatibility wrappers or global switches without a real project requirement.
- Use stable configuration values for policy; do not hard-code changeable application behavior inside implementation code.

## Verification and delivery

- Choose checks from `TESTING.md` based on the affected behavior. Documentation-only edits need content and link checks, not unrelated behavior tests.
- Never describe an unrun, skipped, or non-matching check as passed.
- Report the files changed, checks actually run and their results, and any relevant boundary that remains unverified.
