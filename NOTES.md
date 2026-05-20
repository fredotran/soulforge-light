# SoulForge Light — Decision Log

## 2026-05-20 — Refactored to CLI-first agentic tool
- **What**: Rewrote agent loop (AI SDK v6 `streamText` + `stopWhen: stepCountIs(25)` + `fullStream`), created project-aware system prompt, built rich CLI with ANSI colors, made CLI the default mode (TUI opt-in via `--tui`), deleted dead `src/headless/`.
- **Why**: Transform from TUI-heavy app into a light CLI agentic coding tool (like opencode/copilot-cli).
- **Files changed**: `src/core/agent.ts` (rewritten), `src/core/system-prompt.ts` (new), `src/cli/index.ts` (new), `src/cli/format.ts` (new), `src/boot.tsx` (CLI-first), `src/headless/index.ts` (deleted).
- **Follow-ups**: Pre-existing type errors in `SettingsPanel.tsx` and `Wizard.tsx` (TUI components) remain unfixed — not related to this refactor.
