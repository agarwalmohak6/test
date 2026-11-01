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

## Interactive Messages API Lab (v2)

Open **API playground** in the sidebar. This is an executable training simulator, not a live Claude endpoint:

- **18 guided scenarios**: API request basics, system vs user roles, multi-turn history, structured JSON, tool use, MCP lookup fixture, SSE streaming, output limits, stop sequences, prompt caching demonstration, model selection, HTTP 429 and 529 retries, timeout/cancellation, malformed request (400), prompt-injection handling, refusal shapes, and context budgets.
- Edit system and user messages, mock model, temperature, stop sequences, maximum output tokens, timeout, and retry policy.
- **Real timing measurement**: elapsed wall time, time to first byte, and time to first streamed text delta (when streaming) measured by the browser. Fixture delays are **artificial**, not live model benchmarks.
- **Estimated token counts**: explicitly prefixed with `~`. They are rough character estimates; response `usage.input_tokens`, `usage.output_tokens`, and cache usage values deliberately remain `null`, since no Anthropic tokenizer or inference runs. The simulator **cannot** compute real billed usage or exact model throughput.
- **Guided JSON inspector**: hover or focus `?` for field explanations. Mobile users can tap focusable help markers. View raw request/response JSON, SSE events, HTTP attempts, and tool loop traces, or export a JSON record.
- **Real local HTTP mechanics**: SSE event streams over HTTP, bounded retry for simulated 429/529 responses, and a local fixture tool execution followed by a tool_result continuation. Nothing is sent to Anthropic.
- This is **not** an unrestricted chatbot. Unknown prompts receive clearly labeled generic educational explanations rather than hallucinated Claude responses.

### API routes (training only)

`GET /api/playground/scenarios` · `POST /api/playground/run` · `POST /api/playground/stream` · `POST /api/playground/tool`.

For real inference without a paid Anthropic key, run a local model on your own computer (for example, Ollama) and compare outputs separately; it is **not Claude**, and isn't offered by this hosted demo. Don't put API credentials into this public playground.
- **18 interactive API lab scenarios**: multi-turn history; system and user instructions; structured JSON; client tools and MCP-style fixtures; SSE streaming; output limits and stop sequences; local cache demonstration; mock model-selection delays; HTTP 429/529 with bounded retries; cancellation/timeouts; validation and context-size errors; prompt injection and refusal handling.
- **Editable request inspector + developer field guide**: inspect request, response, errors, stream events and tool-result history as JSON. On desktop hover or keyboard-focus the `?` beside fields for detailed explanations; on mobile tap them.
- **Timing and token education**: real browser wall-clock duration, first HTTP bytes, first streamed text and retry timings are displayed alongside **estimated** input/output tokens. No real Anthropic request is sent, so actual `usage.input_tokens`, `usage.output_tokens`, model latency and billing **cannot** be measured. The estimates use a rough text-length heuristic and should never be used for billing or exact context limits.

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

The app stores one anonymous learner identifier in the browser's `localStorage`. The server temporarily persists progress in `server/data/progress.json` and returns a **compact progress backup** to the browser after each completed action. On reload, the browser sends the local backup to `/api/restore`, protecting same-browser progress from Render Free's ephemeral filesystem resets. Progress is **not synced across devices or browsers** and is lost if browser storage is cleared. It has **no password-based accounts or production-grade authentication**. Do not enter sensitive personal information. For a multi-user production website, replace the anonymous profile mechanism with authenticated users and a managed database.

## API routes

| Endpoint | What it does |
|---|---|
| `GET /api/health` | Health + offline mode |
| `GET /api/bootstrap?learner=<id>` | Curriculum and learner summary |
| `POST /api/lesson` | Mark notes/lab review status and return a portable backup |
| `POST /api/restore` | Restore a validated browser-local progress backup |
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
- The app is suitable for a **public hobby demo** with browser-local progress backup. Before production use, upgrade React, add authentication and a database, and protect against account enumeration and abuse.
- No live hosted URL is provided by this source repository; start locally or deploy to an appropriate Node.js host.

Built to make daily study measurable and enjoyable, while remaining upfront about what free simulation can—and cannot—prove.

## Interactive Messages API learning lab

Open **API playground** from the sidebar. It contains **18 local, deterministic exercises**, rather than only three fixed example prompts. You can edit the request and system instruction, select a mock model (different artificial delays), change `max_tokens`, temperature and stop sequences, add stateless multi-turn context, and practise structured output, client tool calls, an MCP-style lookup, SSE streaming, cache concepts, 429/529 retries, cancellation, context limits and security-handling patterns.

The Node.js simulator exposes `/api/playground/scenarios`, `/api/playground/run`, `/api/playground/stream`, and `/api/playground/tool`. A guided JSON inspector explains individual request and response fields on hover or keyboard focus. The SSE timeline displays real HTTP chunks containing **scripted** content, and the tool loop runs local fixtures only. Downloading a trace exports the request, response, events and timings for study.

**Important:** Claude is **not** called. Browser elapsed time and response-start measurements are real for *this app*, but model delays are intentionally artificial and **not** Anthropic inference benchmarks. Token values prefixed with `~` are coarse character-derived estimates; official `usage.input_tokens`, `usage.output_tokens` and prompt-cache counts are returned as `null`. Actual tokenizer counts, inference quality and billing cannot be demonstrated without Claude API access. All 21 lessons, quizzes, and progress tools continue to work without an API key.
