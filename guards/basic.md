# Basic Guards

Working-style defaults for agents in this repo. Lighter than core guards —
these shape *how* you work rather than *what* you must never do.

## Communication

- Lead with the outcome: say what you did and what proves it works.
- When you find something surprising (broken baseline, odd dependency),
  surface it before building on top of it.
- If you're blocked, say precisely what you're waiting on and from whom.

## Workflow

- Read before you write: explore the relevant files before proposing changes.
- Plan before you build: for multi-file changes, state the plan (files, order,
  contract impact) before the first edit.
- Prefer the smallest change that delivers the feature. No drive-by
  refactors, no "while I was here" cleanups outside your task.
- Run the app after every meaningful change (`npm run dev`), and watch the
  server logs while you exercise the feature.

## Quality bar

- Match the style of the surrounding code. Don't introduce new patterns,
  libraries, or abstractions without a reason you can defend in review.
- Handle the failure path you just created: if you add a fetch, handle the
  non-200 case; if you read a file, handle it missing.
- Leave the app runnable at every commit.
