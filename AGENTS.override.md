# Project Boundaries

This file contains hard project-specific boundaries and takes precedence over `AGENTS.md`. If a requested change conflicts with these rules, follow the user's current explicit instruction or stop and ask.

## Scope and compatibility

- Change only files required by the current task. Do not reformat, rename, move, or refactor unrelated code.
- Treat every `.js` and `.vue` file under `src/` as high-priority review scope. When any of them changes, review the affected public behavior, emitted events, props, types, request flow, upload paths, and error handling.
- Do not alter or remove compatibility code unless the user explicitly includes it in scope. In particular, preserve the HTML4 upload path and its related fields, selectors, tests, and documentation.
- Do not change public defaults or API behavior as a side effect of cleanup, dependency work, or documentation changes.
- Report related problems outside the requested scope instead of fixing them silently.

## Source and generated files

- Edit source files and build configuration, not generated copies.
- `src/`, `docs/` excluding `docs/dist/`, tests, and root configuration files are maintained sources.
- `dist/`, `docs/dist/`, the root `index.html`, and generated declaration copies are build outputs. Regenerate them through `npm run build` when required; do not hand-edit them.
- Do not spend review time on generated output unless the user explicitly asks for artifact inspection or a packaging problem requires it.

## Dependencies and documentation assets

- Keep package dependencies current and mutually compatible. Check peer ranges, runtime APIs, build tools, type checking, and the lockfile when upgrading.
- After a major dependency upgrade, verify each integration against the installed API instead of assuming the previous API still works.
- Documentation-only assets such as Bootstrap, Font Awesome, Cropper.js, Highlight.js, and ES6 Promise should remain pinned CDN references in `docs/index.template.html`. Do not copy or bundle them locally unless the user explicitly asks.
- Keep CDN URLs on explicit versions; never use floating tags such as `latest`.
- Cropper examples must use the installed CDN version's current API and remain usable in both the full and avatar examples. Editing dialogs must fit within the viewport.

## Git and destructive actions

- Inspect or change Git state only when the user explicitly asks for Git work.
- Never discard, overwrite, clean, reset, or rewrite user changes or history without explicit authorization.
- Before deleting a file, verify that it has no source, configuration, documentation, test, or build reference.
