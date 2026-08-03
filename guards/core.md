# Core Guards

Non-negotiable rules for any agent working in this repo. Pull this file into
your Claude Code context (it is referenced from the root CLAUDE.md).

## 1. Log-driven validation — no assumptions

A change is not done because the code looks right. It is done when you have
**observed it working**: server logs, a curl response, a test run, a browser
screenshot. Every "done" claim must cite the evidence.

- Before changing behavior, capture the baseline (run it, log it).
- After changing behavior, capture the proof (run it, log it, compare).
- If you cannot observe it, you cannot claim it.

## 2. Scope ownership — stay in your lane

You only create or modify files inside your assigned scope (defined by your
lane's Issue and scope file). If the right fix lives outside your scope:

- Do NOT make the change.
- Comment on the owning lane's Issue describing what you need.
- Wait for the interface, or build against the agreed contract.

## 3. Contracts before code

Shared shapes (JSON payloads, function signatures, endpoint paths) are agreed
in the Issue **before** implementation starts. If you must deviate from a
contract, stop and raise it on the Issue — never silently redefine an
interface another lane depends on.

## 4. Traceable commits

- Every commit message references its Issue: `feat: add price filter (refs #4)`
- Commit small and often. Each commit should leave the app runnable.
- Never commit secrets, tokens, or credentials. `.env` files stay out of git.

## 5. Destructive actions need a human

Deletes, force-pushes, history rewrites, and dependency major-version bumps
require explicit human approval first. State what you want to do, why, and how
to undo it.
