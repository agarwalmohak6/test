# ClaudePath — Developer Academy

**A complete no-API-key React + Node.js preparation website for a 21-day Claude Certified Developer – Foundations learning plan.**

> Independent educational project. Not affiliated with Anthropic; not an official exam or a certification service.

## Run it (no account, API key, or npm install)

Prerequisite: **Node.js 18 or later**. Download/extract the repository and run:

```bash
npm start
```

Open **http://localhost:4173**. The React runtime is included locally in `public/vendor`, and the backend uses Node's built-in `http` module, so no package installation or internet connection is required to run the already-built app.

For frontend source editing, run `npm install` (TypeScript is an optional build-time dependency), then `npm run build` to compile `src/app.jsx` into `public/app.js`. The included build uses the classic React JSX transform for compatibility with the bundled no-install runtime. In this self-contained demo the included runtime is React 16; an upgrade to a maintained React version and modern bundler is recommended for production deployment.

## What's inside

- **21 complete daily lessons** covering Messages API, prompting, tools, MCP, agents, caching, model selection, evaluations, security, Claude Code, Skills, retrieval and deployment.
- **63 teaching sections**, clear objectives, key takeaways, official docs and step-by-step hands-on labs.
- **Daily quizzes** with four authored questions each, one after every day.
- **Three timed 12-question weekly mocks**, due November **7**, **14** and **21**, 2026; they can be taken early for extra practice.
- **36-question, 90-minute final assessment**, with server-side scoring, feedback, per-domain breakdown and a practice readiness verdict.
- **156 authored questions**. Answers are not sent to the browser until the attempt is submitted; option order is shuffled per learner.
- **Local progress persistence** for notes completed, labs completed, attempts, best scores and mastery.
- **Searchable lesson notes**, progress charts, mastery timeline, responsive UI and a mock Messages API playground.
- **Calendar export** in `public/study-calendar.ics` (21 daily lessons, three weekly mocks, final assessment).
- **No Anthropic API key required**. The playground uses deterministic simulated responses. MCP labs link to free local tools/Inspector.

## Mastery and readiness policy

A day counts as **mastered** when its notes and lab are checked off **and** the best daily quiz score is **at least 75%**.

**Practice-ready** is awarded *only if all* the following are true:
1. At least **18/21** days mastered.
2. All three weekly mock best scores are **75% or higher**.
3. Final assessment best score is **85% or higher**.
4. Every domain represented in the learner's best final result is **60% or higher**.

These are study thresholds, **not** the official exam's scoring standards. This product cannot predict an official result with certainty.

## Schedule

| Phase | Dates | Coverage | Checkpoint |
|---|---|---|---|
| Week 1 | Nov 1–7 | API, prompting, tool use, agent fundamentals | Nov 7 mock |
| Week 2 | Nov 8–14 | Agents, MCP, model choice, evals, safety, Claude Code | Nov 14 mock |
| Week 3 | Nov 15–21 | Skills, RAG, production, capstone and revision | Nov 21 mock + final assessment |

Daily quizzes are available immediately after opening a lesson. Weekly mocks and the final are listed with due dates but can be practised before their scheduled dates. The calendar export creates all-day events; it does not automatically send notifications by itself.

## Technology & source structure

```text
public/                      React UI assets (works without npm install)
  index.html                  HTML entry
  styles.css                  Responsive design system
  app.js                      Compiled React frontend
  vendor/                     MIT-licensed React UMD runtime
  study-calendar.ics          Downloadable study schedule
src/app.jsx                   Editable React source
server/index.cjs              Node HTTP API + static file host
server/core.cjs               Quiz, grading, mastery, mock simulation
server/data/progress.json     Auto-created local state (gitignored)
shared/curriculum.json        21 lesson manuscripts
shared/questions.json         Private-to-server question answer bank
shared/questions.txt          Readable authoring text for future updates
tests/core.test.cjs           Unit, HTTP and React-render smoke tests
scripts/build.cjs             Optional JSX rebuild
```

The app stores one anonymous learner identifier in the browser's `localStorage`; the server persists that learner's progress in `server/data/progress.json`. It has **no password-based accounts, production-grade authentication, shared-device isolation or cloud sync**. For a public hosted website, implement proper account security and durable database storage first.

## API routes

| Endpoint | What it does |
|---|---|
| `GET /api/health` | Health + offline mode |
| `GET /api/bootstrap?learner=<id>` | Curriculum and learner summary |
| `POST /api/lesson` | Mark notes/lab review status |
| `GET /api/quiz/:id?learner=<id>` | Questions with no answer keys (`day1`–`day21`, `week1`–`week3`, `final`) |
| `POST /api/quiz/:id/submit` | Grade on the server; save attempt |
| `POST /api/simulate` | Deterministic mock Messages-shaped response |
| `POST /api/reset` | Clear the local learner's progress |

## Testing

```bash
npm test
```

The test suite verifies the curriculum/question bank, shuffling and scoring, mastery/readiness gates, simulated responses, React rendering of all primary views, and the HTTP endpoints. The browser end-to-end visual test was not executed in the development environment; the server and React-render smoke tests were run.

## External resources

Daily lesson reading links point to official documentation and references, including:

- [Using the Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages)
- [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works)
- [MCP documentation](https://modelcontextprotocol.io/introduction)
- [Claude Code documentation](https://code.claude.com/docs/en/overview)

## Limitations and next steps

- Mocked replies **do not** validate Claude's real outputs, current token usage, pricing or model quality.
- The quizzes use a finite, visible-to-repository-author bank. Scores are for learning, not official proctoring; repeated attempts can become familiar.
- The app is self-contained and suitable for a personal demo. Before public production use, upgrade React, add authentication and a database, protect against account enumeration and abuse, and configure deployment/hosting.
- No live hosted URL is provided by this source repository; start locally or deploy to an appropriate Node.js host.

Built to make daily study measurable and enjoyable, while remaining upfront about what free simulation can—and cannot—prove.
