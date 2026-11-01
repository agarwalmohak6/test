/* ClaudePath interactive offline Messages API laboratory.
 * React 16 compatible. No real model, account, key, inference or tokenization is performed.
 */
const CL_R = window.React;
const FIELD_GUIDE = {
    'model': ['Model identifier', 'Selects the model used by a real API call. mock-* identifiers are local teaching fixtures, not Claude model names.'],
    'max_tokens': ['Output budget', 'Maximum output tokens the model may generate. Not a guarantee it will use all of them. Here truncation uses an approximation.'],
    'system': ['System instructions', 'Higher-priority application instructions. On the Messages API, this is a top-level field rather than a system role in messages.'],
    'messages': ['Conversation history', 'Stateless API calls must include the turns needed to provide context. The assistant does not remember previous API calls automatically.'],
    'role': ['Role', 'Who authored the message. Most Messages API conversation messages use user and assistant; tool results are sent under user role.'],
    'content': ['Content blocks', 'Content may be plain text or typed blocks such as text, tool_use and tool_result. Streaming sends deltas.'],
    'temperature': ['Sampling control', 'Controls randomness in a real model, subject to model support. Our deterministic fixture does not randomly generate output.'],
    'stream': ['Streaming toggle', 'When enabled, an API may deliver server-sent events incrementally. Our SSE timeline uses real network streaming but mock content.'],
    'stop_sequences': ['Custom stop text', 'Optional sequences that terminate text generation, reflected by stop_reason stop_sequence when matched.'],
    'tools': ['Client tool definitions', 'JSON Schema and descriptions let a model request a tool. The host app executes it and sends the result back.'],
    'name': ['Tool name', 'A machine-readable identifier for a tool supplied to the model.'],
    'description': ['Tool description', 'A description helps the model determine when a tool should be called.'],
    'input_schema': ['Tool JSON Schema', 'Defines the expected input arguments to the tool. Your backend must still validate the data before execution.'],
    'properties': ['Schema properties', 'Names and validation constraints of arguments accepted by a tool.'],
    'required': ['Required properties', 'Tool arguments required by the tool schema.'],
    'type': ['Block or object type', 'Identifies whether this is a message, text block, tool_use request, tool_result or error.'],
    'id': ['Response or tool ID', 'Identifier useful for logs; tool_result must reference the matching tool_use ID. Mock identifiers are invented and marked sim.'],
    'input': ['Tool arguments', 'The model-proposed arguments passed to your tool only after validation.'],
    'tool_use_id': ['Tool call correlation', 'Connects a tool_result block to the tool_use block that requested it.'],
    'is_error': ['Tool failure marker', 'Flags an error result so the model can consider the failure rather than silently using bad data.'],
    'stop_reason': ['Why generation stopped', 'end_turn: finished; tool_use: application must run tool; max_tokens: hit output cap; stop_sequence: matched delimiter; refusal: declined request.'],
    'stop_sequence': ['Matched delimiter', 'The custom stop sequence that caused the model to end, when applicable; otherwise null.'],
    'usage': ['Provider accounting', 'In real responses, usage contains billed token counts. We deliberately leave these null because no Anthropic tokenizer or model runs.'],
    'input_tokens': ['Provider input count', 'Actual input tokens reported by a real service. Null in this simulator; see separately labelled approximation.'],
    'output_tokens': ['Provider output count', 'Actual output tokens reported by a real service. Null in this simulator; see separately labelled approximation.'],
    'cache_creation_input_tokens': ['Cache-write tokens', 'In actual Claude usage, cache creation input tokens are reported separately when applicable. Not measured here.'],
    'cache_read_input_tokens': ['Cache-read tokens', 'In actual Claude usage, cache read input tokens are reported separately when applicable. Not measured here.'],
    'error': ['Error details', 'Structured error type and message. Retry transient conditions but repair malformed requests before retry.'],
    'message': ['Error message', 'Human-readable problem description; consider not showing sensitive raw backend data to an end user.'],
    'simulation': ['Simulator mode', 'True means this is a local classroom fixture, not an actual Anthropic API result.'],
    'estimated_input_tokens': ['Approximate input tokens', 'Estimated from characters. Not Anthropic token counts, not billing, and unsuitable for exact context limits.'],
    'estimated_output_tokens': ['Approximate output tokens', 'Estimated from characters. In real usage rely on the provider response.'],
    'server_processing_ms': ['Backend work time', 'Measured local JavaScript fixture execution time, separate from deliberately added network delay.'],
    'simulated_model_delay_ms': ['Artificial delay', 'A classroom delay to make UI timing observable. Not an actual model benchmark.'],
    'model_delay_ms': ['Artificial delay', 'Controlled fixture delay, not model inference latency.'],
    'cache_demo': ['Cache demonstration', 'A teaching-only map comparing repeated prompt inputs; no provider cache is used.'],
    'hit': ['Cache demonstration hit', 'True indicates a repeated fixture input, not a real Anthropic cache hit.'],
    'source': ['Content origin', 'This app uses predetermined instructional examples and deterministic rules rather than an inference API.'],
    'authenticClaudeUsage': ['Real usage flag', 'False because no paid or free Claude API inference occurs.'],
    'stop_sequence_demo': ['Stop sequence demo', 'Custom stop sequence behavior illustrated locally.'],
    'index': ['Block index', 'Position of a content block in a streamed message.'],
    'delta': ['Streaming change', 'The incremental fragment that clients must assemble in the correct order.'],
    'text': ['Text content', 'Text carried in a content block or streamed text delta.'],
    'partial_json': ['Incremental JSON', 'During tool input streaming, JSON arguments may arrive in fragments; do not parse until complete.'],
    'status': ['Status', 'A state or status code associated with a tool record or server response.'],
    'retry_after_ms': ['Retry guidance', 'When a transient 429 or 529 appears, a service may recommend waiting before retrying. This is a simulated delay in our lesson.'],
    'prompt': ['User request text', 'The current user turn, sent alongside the relevant earlier messages. This simulator uses topic rules and fixtures, not natural-language inference.']
};
const CL_SCENARIO_FALLBACK = [{ id: 'basics', name: 'First Messages request', group: 'Foundations', prompt: 'Explain what an API is', system: 'You are a patient developer mentor.', skill: 'Request construction' }];
const CL_TABS = ['Guided JSON', 'Raw JSON', 'Event timeline', 'How it works'];
const pretty = v => JSON.stringify(v, null, 2);
const ms = n => Number.isFinite(n) ? `${n.toFixed(0)} ms` : '—';
const copyText = async (text) => { try {
    await navigator.clipboard.writeText(text);
    return true;
}
catch (_a) {
    return false;
} };
function showFieldTip(e, field) { const panel = document.getElementById('cl-floating-help'); const desc = FIELD_GUIDE[field]; if (!panel || !desc)
    return; panel.textContent = field + ' — ' + desc[1]; panel.style.display = 'block'; const rect = e.currentTarget.getBoundingClientRect(); panel.style.left = Math.max(12, Math.min(window.innerWidth - 310, rect.left)) + 'px'; panel.style.top = (rect.bottom + 10 > window.innerHeight - 105 ? Math.max(12, rect.top - 116) : rect.bottom + 9) + 'px'; }
function hideFieldTip() { const panel = document.getElementById('cl-floating-help'); if (panel)
    panel.style.display = 'none'; }
function FieldHint({ field, small = false }) { const info = FIELD_GUIDE[field]; if (!info)
    return null; return React.createElement("span", { onMouseEnter: e => showFieldTip(e, field), onFocus: e => showFieldTip(e, field), onMouseLeave: hideFieldTip, onBlur: hideFieldTip, className: 'cl-help ' + (small ? 'cl-help-small' : ''), tabIndex: "0", role: "note", "aria-label": `About ${field}: ${info[1]}`, "data-help": info[1], title: `${info[0]}: ${info[1]}` }, "?"); }
function GuidedNode({ value, k, depth = 0, path = '' }) {
    const obj = value !== null && typeof value === 'object';
    const isArray = Array.isArray(value);
    if (!obj)
        return React.createElement("div", { className: "cl-json-line", style: { paddingLeft: Math.min(depth, 7) * 15 } },
            React.createElement("span", { className: "cl-json-key" }, k == null ? '' : `${k}: `),
            React.createElement("span", { className: typeof value === 'string' ? 'cl-str' : typeof value === 'number' ? 'cl-num' : 'cl-other' }, pretty(value) === undefined ? 'undefined' : pretty(value)),
            k != null && React.createElement(FieldHint, { field: k, small: true }));
    const entries = Object.entries(value);
    return React.createElement("details", { className: "cl-json-node", open: depth <= 1 },
        React.createElement("summary", { style: { paddingLeft: Math.min(depth, 7) * 15 } },
            React.createElement("span", { className: "cl-json-key" }, k == null ? 'root' : k),
            React.createElement(FieldHint, { field: k || '', small: true }),
            React.createElement("span", { className: "cl-json-bracket" },
                isArray ? '[' : '{',
                " ",
                entries.length,
                " ",
                isArray ? 'items' : 'fields',
                " ",
                isArray ? ']' : '}')),
        React.createElement("div", null, entries.length ? entries.map(([key, val]) => React.createElement(GuidedNode, { key: path + '/' + key, k: isArray ? key : key, value: val, depth: depth + 1, path: path + '/' + key })) : React.createElement("span", { className: "cl-json-empty" }, "Empty")));
}
class ClaudePathPlayground extends CL_R.Component {
    constructor(p) {
        super(p);
        this.pick = (id) => { var _a; const s = this.state.catalog.find(x => x.id === id) || CL_SCENARIO_FALLBACK[0]; this.cancel(); this.setState({ scenario: id, prompt: s.prompt || '', system: s.system || '', stream: !!s.stream, max_tokens: s.max_tokens || 256, stop_sequences: ((_a = s.stop_sequences) === null || _a === void 0 ? void 0 : _a.join(', ')) || '', history: [], result: null, error: null, events: [], attempts: [], elapsed: null, ttft: null, ttfb: null, toolOutput: null, toolTrace: null, liveText: '', selectedTab: 'Guided JSON' }); };
        this.change = (k, v) => this.setState({ [k]: v });
        this.request = (extra = {}) => { const s = this.state; return { scenario: s.scenario, model: s.model, prompt: s.prompt, system: s.system, max_tokens: Number(s.max_tokens), temperature: Number(s.temperature), stream: s.stream, history: s.history.map(x => ({ role: x.role, content: x.content })), stop_sequences: s.stop_sequences.split(',').map(x => x.trim()).filter(Boolean), ...extra }; };
        this.cancel = () => { var _a; this.runId++; (_a = this.ctrl) === null || _a === void 0 ? void 0 : _a.abort(); clearTimeout(this.deadline); this.ctrl = null; this.setState({ loading: false, toolLoading: false }); };
        this.fetchJSON = async (url, payload, signal, timing) => { var _a; const sent = performance.now(); const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal }); if (timing)
            timing.firstByteMs = performance.now() - sent; let d = await r.json(); if (!r.ok) {
            const e = new Error(((_a = d === null || d === void 0 ? void 0 : d.error) === null || _a === void 0 ? void 0 : _a.message) || (d === null || d === void 0 ? void 0 : d.error) || `HTTP ${r.status}`);
            e.httpStatus = r.status;
            e.data = d;
            throw e;
        } return d; };
        this.streamRun = async (payload, signal, progress) => {
            var _a, _b;
            const begin = performance.now();
            const r = await fetch('/api/playground/stream', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal });
            if (!r.ok) {
                const d = await r.json();
                const err = new Error(((_a = d === null || d === void 0 ? void 0 : d.error) === null || _a === void 0 ? void 0 : _a.message) || `HTTP ${r.status}`);
                err.httpStatus = r.status;
                err.data = d;
                throw err;
            }
            if (timing)
                timing.firstByte = performance.now() - requestStart;
            if (!r.body || !r.body.getReader)
                throw new Error('This browser does not support streaming fetch. Turn streaming off and retry.');
            const reader = r.body.getReader(), decoder = new TextDecoder();
            let buffer = '', result = null, events = [], text = '', ttft = null, firstByteMs = null;
            while (true) {
                const part = await reader.read();
                if (part.done)
                    break;
                if (firstByteMs === null)
                    firstByteMs = performance.now() - begin;
                buffer += decoder.decode(part.value, { stream: true });
                let split;
                while ((split = buffer.indexOf('\n\n')) >= 0) {
                    const raw = buffer.slice(0, split);
                    buffer = buffer.slice(split + 2);
                    let eName = '', dataLine = '';
                    for (const ln of raw.split('\n')) {
                        if (ln.startsWith('event: '))
                            eName = ln.slice(7);
                        if (ln.startsWith('data: '))
                            dataLine = ln.slice(6);
                    }
                    if (!dataLine)
                        continue;
                    let data;
                    try {
                        data = JSON.parse(dataLine);
                    }
                    catch (_c) {
                        continue;
                    }
                    if (eName === 'simulation_summary') {
                        result = data.result;
                        continue;
                    }
                    events.push({ name: eName, at: Math.round(performance.now() - begin), data });
                    if (eName === 'content_block_delta' && ((_b = data.delta) === null || _b === void 0 ? void 0 : _b.text)) {
                        text += data.delta.text;
                        if (ttft === null)
                            ttft = performance.now() - begin;
                    }
                    progress({ events: [...events], liveText: text, ttft });
                }
            }
            if (!result)
                throw new Error('Stream ended without the simulation summary.');
            return { result, events, ttft, firstByteMs };
        };
        this.run = async (options = {}) => {
            var _a;
            if (!this.state.prompt.trim() && this.state.scenario !== 'validation') {
                this.setState({ error: { message: 'Write a user message before running.' } });
                return;
            }
            this.cancel();
            const ownId = ++this.runId, ctrl = new AbortController();
            this.ctrl = ctrl;
            const payload = this.request(options);
            this.setState({ loading: true, result: null, error: null, events: [], liveText: '', attempts: [], toolTrace: null, toolOutput: null, ttfb: null, ttft: null, elapsed: null, selectedTab: this.state.stream ? 'Event timeline' : 'Guided JSON' });
            const started = performance.now(), attempts = [];
            let finished = null, timings = {};
            try {
                for (let attempt = 1; attempt <= 3; attempt++) {
                    const t = performance.now();
                    const body = { ...payload, attempt };
                    let result = null, ev = [], ttft = null, firstByteMs = null;
                    clearTimeout(this.deadline);
                    this.deadline = setTimeout(() => ctrl.abort(), Number(this.state.timeout));
                    try {
                        if (payload.stream) {
                            const streamed = await this.streamRun(body, ctrl.signal, p => { if (ownId === this.runId)
                                this.setState(p); }, networkTiming);
                            result = streamed.result;
                            ev = streamed.events;
                            ttft = streamed.ttft;
                            firstByteMs = streamed.firstByteMs;
                        }
                        else {
                            const timing = {};
                            result = await this.fetchJSON('/api/playground/run', body, ctrl.signal, timing);
                            firstByteMs = timing.firstByteMs;
                        }
                        clearTimeout(this.deadline);
                        if (ownId !== this.runId)
                            return;
                        const duration = performance.now() - t;
                        attempts.push({ attempt, status: 200, elapsed: Math.round(duration) });
                        finished = result;
                        timings = { duration: performance.now() - started, ttfb: firstByteMs, ttft: payload.stream ? ttft : null, events: ev };
                        break;
                    }
                    catch (e) {
                        clearTimeout(this.deadline);
                        if (ownId !== this.runId)
                            return;
                        const duration = performance.now() - t, status = e.httpStatus || 0;
                        attempts.push({ attempt, status: status || 'ABORT', elapsed: Math.round(duration), message: e.message });
                        if (e.name === 'AbortError')
                            throw new Error(`Request cancelled or exceeded the ${this.state.timeout} ms timeout.`);
                        if (!this.state.autoRetry || ![429, 529].includes(status) || attempt === 3)
                            throw e;
                        const delay = Math.min(1200, Math.max(((_a = e.data) === null || _a === void 0 ? void 0 : _a.retry_after_ms) || 0, 200 * attempt));
                        this.setState({ attempts: [...attempts] });
                        await new Promise((resolve, reject) => { const timer = setTimeout(resolve, delay); ctrl.signal.addEventListener('abort', () => { clearTimeout(timer); reject(new Error('Cancelled during retry delay.')); }, { once: true }); });
                    }
                }
                if (ownId !== this.runId)
                    return;
                this.setState(s => ({ loading: false, result: finished, elapsed: timings.duration, ttfb: timings.ttfb, ttft: timings.ttft, events: timings.events || [], attempts, runCount: s.runCount + 1 }));
            }
            catch (e) {
                if (ownId !== this.runId)
                    return;
                this.setState({ loading: false, elapsed: performance.now() - started, error: { message: e.message, status: e.httpStatus || null, details: e.data || null }, attempts });
            }
        };
        this.executeTool = async () => {
            var _a, _b, _c;
            const s = this.state;
            const tool = (_c = (_b = (_a = s.result) === null || _a === void 0 ? void 0 : _a.response) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.find(c => c.type === 'tool_use');
            if (!tool)
                return;
            this.setState({ toolLoading: true, error: null });
            try {
                const output = await this.fetchJSON('/api/playground/tool', { name: tool.name, input: tool.input });
                const oldRequest = s.result.request;
                // Pass the existing turns and the tool response separately: normalize() appends
                // exactly one assistant tool_use and exactly one user tool_result message.
                const after = await this.fetchJSON('/api/playground/run', this.request({ history: oldRequest.messages, continued: true, toolUse: tool, toolResult: output.tool_result, stream: false }));
                this.setState({ toolLoading: false, toolOutput: output, toolTrace: { first: s.result, second: after }, result: after, selectedTab: 'Guided JSON' });
            }
            catch (e) {
                this.setState({ toolLoading: false, error: { message: e.message } });
            }
        };
        this.addTurn = () => { var _a; const r = (_a = this.state.result) === null || _a === void 0 ? void 0 : _a.response; if (!r)
            return; const texts = r.content.filter(x => x.type === 'text').map(x => x.text).join('\n'); const history = [...this.state.history, { role: 'user', content: this.state.prompt }, { role: 'assistant', content: texts || '[A tool call is pending; finish it first]' }].slice(-14); this.setState({ history, prompt: '', result: null, error: null, events: [], liveText: '', toolTrace: null }); };
        this.exportRun = () => { var _a, _b, _c; const data = { exportedAt: new Date().toISOString(), notice: 'Educational simulator. Timing is real browser elapsed time; token counts are rough estimates, not Anthropic usage.', scenario: this.state.scenario, request: ((_a = this.state.result) === null || _a === void 0 ? void 0 : _a.request) || this.request(), response: ((_b = this.state.result) === null || _b === void 0 ? void 0 : _b.response) || null, metrics: ((_c = this.state.result) === null || _c === void 0 ? void 0 : _c.metrics) || null, timing: { elapsed_ms: this.state.elapsed, first_byte_ms: this.state.ttfb, first_delta_ms: this.state.ttft }, attempts: this.state.attempts, events: this.state.events }; const file = new Blob([pretty(data)], { type: 'application/json' }), href = URL.createObjectURL(file), a = document.createElement('a'); a.href = href; a.download = 'claudepath-simulation.json'; a.click(); URL.revokeObjectURL(href); };
        this.state = { catalog: CL_SCENARIO_FALLBACK, scenario: 'basics', model: 'mock-balanced', prompt: 'Explain what an API is and give one useful example.', system: 'You are a clear, patient developer mentor.', max_tokens: 256, temperature: 0.5, timeout: 5000, stop_sequences: '', stream: false, autoRetry: true, history: [], result: null, error: null, loading: false, events: [], liveText: '', attempts: [], selectedTab: 'Guided JSON', elapsed: null, ttfb: null, ttft: null, toolOutput: null, toolLoading: false, toolTrace: null, runCount: 0, cacheExample: false, expandHistory: false, search: '', showAdvanced: false };
        this.ctrl = null;
        this.deadline = null;
        this.runId = 0;
    }
    componentDidMount() { this.mounted = true; fetch('/api/playground/scenarios').then(async (r) => { if (!r.ok)
        throw Error('Cannot load scenarios'); return r.json(); }).then(x => { if (this.mounted)
        this.setState({ catalog: x.scenarios || CL_SCENARIO_FALLBACK }); }).catch(() => { }); }
    componentWillUnmount() { var _a; this.mounted = false; this.runId++; (_a = this.ctrl) === null || _a === void 0 ? void 0 : _a.abort(); clearTimeout(this.deadline); }
    render() {
        var _a, _b, _c, _d, _e;
        const s = this.state, selected = s.catalog.find(x => x.id === s.scenario) || CL_SCENARIO_FALLBACK[0], result = s.result, request = (result === null || result === void 0 ? void 0 : result.request) || { model: s.model, max_tokens: s.max_tokens, system: s.system, messages: [...s.history, { role: 'user', content: s.prompt }], temperature: s.temperature, stream: s.stream, ...(s.stop_sequences.trim() ? { stop_sequences: s.stop_sequences.split(',').map(x => x.trim()).filter(Boolean) } : {}) }, response = (result === null || result === void 0 ? void 0 : result.response) || null, raw = (response || ((_a = s.error) === null || _a === void 0 ? void 0 : _a.details) || null), cache = result === null || result === void 0 ? void 0 : result.cache_demo, metrics = result === null || result === void 0 ? void 0 : result.metrics;
        const filtered = s.catalog.filter(x => (x.name + ' ' + x.skill + ' ' + x.group).toLowerCase().includes(s.search.toLowerCase()));
        const etaOutput = (metrics === null || metrics === void 0 ? void 0 : metrics.estimated_output_tokens) || 0;
        const throughput = s.elapsed > 0 ? (etaOutput / (s.elapsed / 1000)).toFixed(1) : null;
        return React.createElement("div", { className: "page-content cl-page" },
            React.createElement("div", { id: "cl-floating-help", role: "tooltip", className: "cl-floating-help" }),
            React.createElement("div", { className: "cl-topline" },
                React.createElement("div", null,
                    React.createElement("div", { className: "eyebrow" }, "INTERACTIVE DEVELOPER LAB \u00B7 NO API KEY"),
                    React.createElement("h1", null,
                        "Messages API Playground ",
                        React.createElement("span", { className: "cl-top-spark" }, "\u2733")),
                    React.createElement("p", null,
                        "Build requests, watch the lifecycle, and understand every field. All responses are ",
                        React.createElement("b", null, "scripted local simulations"),
                        ", never generated by Claude.")),
                React.createElement("div", { className: "cl-top-actions" },
                    React.createElement("span", { className: "cl-running-dot" }),
                    " Offline teaching engine")),
            React.createElement("div", { className: "cl-notice" },
                React.createElement(Icon, { name: "shield", size: 18 }),
                React.createElement("div", null,
                    React.createElement("strong", null, "Measured time \u00B7 Estimated tokens \u00B7 0 API charges"),
                    React.createElement("p", null,
                        "Network timing below is measured in your browser, with intentional fixture delays. Token approximations are based on text length (not an Anthropic tokenizer); actual provider usage stays ",
                        React.createElement("code", null, "null"),
                        ". No API credentials or user prompts are sent to Anthropic."))),
            React.createElement("div", { className: "cl-stats", "aria-live": "polite" }, [['TOTAL TIME', s.elapsed == null ? '—' : ms(s.elapsed), 'Real browser time, including mock delay and retries'], ['INPUT TOKENS', metrics ? '~' + metrics.estimated_input_tokens : '—', 'Approximate; actual input_tokens remains null'], ['OUTPUT TOKENS', metrics ? '~' + metrics.estimated_output_tokens : '—', 'Approximate; actual output_tokens remains null'], ['FIRST BYTE', s.ttfb == null ? '—' : ms(s.ttfb), 'Measured first HTTP bytes / headers from our simulator'], ['FIRST TOKEN', s.ttft == null ? '—' : ms(s.ttft), 'First streamed text delta measured from request start; only for SSE'], ['RETRY ATTEMPTS', s.attempts.length || '—', 'Measured HTTP attempts, including failures']].map(([label, value, tip]) => React.createElement("div", { key: label, className: "cl-stat", title: tip },
                React.createElement("span", null, label),
                React.createElement("strong", null, value),
                React.createElement("small", null, tip)))),
            React.createElement("div", { className: "cl-layout" },
                React.createElement("section", { className: "cl-panel cl-config" },
                    React.createElement("div", { className: "cl-panel-head" },
                        React.createElement("span", null,
                            React.createElement(Icon, { name: "sliders", size: 17 }),
                            " Request builder"),
                        React.createElement("span", { className: "cl-label" }, "EDITABLE")),
                    React.createElement("div", { className: "cl-config-inner" },
                        React.createElement("label", { className: "cl-field", htmlFor: "cl-search" },
                            "Browse ",
                            s.catalog.length,
                            " scenarios ",
                            React.createElement(FieldHint, { field: "messages" })),
                        React.createElement("input", { id: "cl-search", className: "cl-input cl-search", placeholder: "Filter: streaming, tools, safety, caching...", value: s.search, onChange: e => this.change('search', e.target.value) }),
                        React.createElement("div", { className: "cl-scenario-grid", role: "group", "aria-label": "Choose a scenario" },
                            filtered.map(x => React.createElement("button", { key: x.id, className: 'cl-scenario ' + (x.id === s.scenario ? 'active' : ''), onClick: () => this.pick(x.id), type: "button" },
                                React.createElement("span", null, x.name),
                                React.createElement("small", null, x.group))),
                            !filtered.length && React.createElement("p", null, "No scenarios match. Try \u201Ctool\u201D, \u201Ctoken\u201D or \u201Cerror\u201D.")),
                        React.createElement("div", { className: "cl-active-scenario" },
                            React.createElement("strong", null, selected.name),
                            React.createElement("span", null, selected.skill),
                            React.createElement("p", null, selected.tip)),
                        React.createElement("div", { className: "cl-fieldrow" },
                            React.createElement("label", { className: "cl-field", htmlFor: "cl-model" },
                                "Model ",
                                React.createElement(FieldHint, { field: "model" })),
                            React.createElement("select", { id: "cl-model", className: "cl-input", value: s.model, onChange: e => this.change('model', e.target.value) },
                                React.createElement("option", { value: "mock-fast" }, "mock-fast \u00B7 40ms lesson delay"),
                                React.createElement("option", { value: "mock-balanced" }, "mock-balanced \u00B7 110ms"),
                                React.createElement("option", { value: "mock-deep" }, "mock-deep \u00B7 230ms"))),
                        React.createElement("label", { className: "cl-field", htmlFor: "cl-system" },
                            "System instructions ",
                            React.createElement(FieldHint, { field: "system" })),
                        React.createElement("textarea", { className: "cl-input cl-textarea", id: "cl-system", rows: "3", value: s.system, onChange: e => this.change('system', e.target.value) }),
                        React.createElement("label", { className: "cl-field", htmlFor: "cl-prompt" },
                            "User message ",
                            React.createElement(FieldHint, { field: "messages" })),
                        React.createElement("textarea", { className: "cl-input cl-textarea", id: "cl-prompt", rows: "4", value: s.prompt, onChange: e => this.change('prompt', e.target.value), placeholder: "Ask about an API, tokens, MCP, retrying errors..." }),
                        s.history.length > 0 && React.createElement("div", { className: "cl-history" },
                            React.createElement("button", { onClick: () => this.change('expandHistory', !s.expandHistory) },
                                "Conversation history \u00B7 ",
                                s.history.length,
                                " turns ",
                                React.createElement(Icon, { name: "down", size: 14 })),
                            s.expandHistory && s.history.map((x, i) => React.createElement("div", { key: i },
                                React.createElement("b", null, x.role),
                                " ",
                                typeof x.content === 'string' ? x.content : pretty(x.content))),
                            React.createElement("button", { className: "cl-clear", onClick: () => this.setState({ history: [], result: null }) }, "Clear history")),
                        React.createElement("div", { className: "cl-slider-head" },
                            React.createElement("label", { className: "cl-field", htmlFor: "cl-max" },
                                "Maximum output tokens ",
                                React.createElement(FieldHint, { field: "max_tokens" })),
                            React.createElement("b", null, s.max_tokens)),
                        React.createElement("input", { id: "cl-max", className: "cl-slider", type: "range", min: "8", max: "2048", step: "8", value: s.max_tokens, onChange: e => this.change('max_tokens', +e.target.value) }),
                        React.createElement("button", { type: "button", className: "cl-advanced-toggle", onClick: () => this.change('showAdvanced', !s.showAdvanced), "aria-expanded": s.showAdvanced },
                            "Advanced request controls ",
                            React.createElement(Icon, { name: "down", size: 15 })),
                        s.showAdvanced && React.createElement("div", { className: "cl-advanced" },
                            React.createElement("div", { className: "cl-fieldrow" },
                                React.createElement("label", { className: "cl-field", htmlFor: "cl-temp" },
                                    "Temperature ",
                                    React.createElement(FieldHint, { field: "temperature" })),
                                React.createElement("input", { id: "cl-temp", className: "cl-input", type: "number", step: "0.1", min: "0", max: "1", value: s.temperature, onChange: e => this.change('temperature', Math.max(0, Math.min(1, +e.target.value || 0))) })),
                            React.createElement("label", { className: "cl-field", htmlFor: "cl-stop" },
                                "Stop sequences (comma separated) ",
                                React.createElement(FieldHint, { field: "stop_sequences" })),
                            React.createElement("input", { id: "cl-stop", className: "cl-input", value: s.stop_sequences, placeholder: "e.g. ###", onChange: e => this.change('stop_sequences', e.target.value) }),
                            React.createElement("div", { className: "cl-fieldrow" },
                                React.createElement("label", { className: "cl-field", htmlFor: "cl-timeout" }, "Client timeout (ms)"),
                                React.createElement("input", { id: "cl-timeout", className: "cl-input", type: "number", min: "250", max: "30000", value: s.timeout, onChange: e => this.change('timeout', Math.max(250, Math.min(30000, +e.target.value || 5000))) })),
                            React.createElement("label", { className: "cl-toggle" },
                                React.createElement("input", { type: "checkbox", checked: s.autoRetry, onChange: e => this.change('autoRetry', e.target.checked) }),
                                " Retry 429 / 529 up to 3 times")),
                        React.createElement("div", { className: "cl-run-actions" },
                            React.createElement("label", { className: "cl-toggle" },
                                React.createElement("input", { type: "checkbox", checked: s.stream, onChange: e => this.change('stream', e.target.checked) }),
                                " Stream events (SSE) ",
                                React.createElement(FieldHint, { field: "stream" })),
                            React.createElement("div", { className: "cl-runbuttons" },
                                React.createElement("button", { disabled: s.loading || s.toolLoading, className: "btn btn-coral", onClick: () => this.run() },
                                    React.createElement(Icon, { name: "play", size: 14 }),
                                    s.loading ? 'Running…' : 'Run simulation'),
                                React.createElement("button", { className: "btn btn-outline", disabled: !s.loading, onClick: this.cancel }, "Cancel"))),
                        s.result && !s.result.response.content.some(x => x.type === 'tool_use') && React.createElement("button", { className: "cl-addturn", onClick: this.addTurn },
                            "Add reply to conversation & ask a follow-up ",
                            React.createElement(Icon, { name: "arrow", size: 15 })),
                        ((_d = (_c = (_b = s.result) === null || _b === void 0 ? void 0 : _b.response) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.some(x => x.type === 'tool_use')) && React.createElement("button", { disabled: s.toolLoading, className: "cl-addturn cl-toolbutton", onClick: this.executeTool },
                            s.toolLoading ? 'Executing local fixture…' : 'Execute tool → send result → continue',
                            " ",
                            React.createElement(Icon, { name: "arrow", size: 15 })))),
                React.createElement("section", { className: "cl-panel cl-inspect" },
                    React.createElement("div", { className: "cl-panel-head" },
                        React.createElement("span", null,
                            React.createElement(Icon, { name: "terminal", size: 17 }),
                            " Response inspector"),
                        React.createElement("button", { className: "cl-download", disabled: !s.result, onClick: this.exportRun, title: "Download simulation trace JSON" },
                            React.createElement(Icon, { name: "download", size: 14 }),
                            " Export trace")),
                    React.createElement("div", { className: "cl-tabs", role: "tablist", "aria-label": "Inspect simulation details" }, CL_TABS.map(t => React.createElement("button", { key: t, role: "tab", "aria-selected": s.selectedTab === t, className: s.selectedTab === t ? 'active' : '', onClick: () => this.change('selectedTab', t) }, t))),
                    React.createElement("div", { className: "cl-inspect-content" },
                        s.loading && React.createElement("div", { className: "cl-live", role: "status" },
                            React.createElement("div", { className: "cl-spinner" }),
                            " ",
                            React.createElement("strong", null, "Processing mock request"),
                            React.createElement("span", null, s.stream ? 'SSE streaming enabled; chunks appear below.' : 'Waiting for scripted response.'),
                            s.liveText && React.createElement("pre", null, s.liveText)),
                        s.error && React.createElement("div", { className: "cl-error", role: "alert" },
                            React.createElement("b", null,
                                "Request failed ",
                                s.error.status ? `· HTTP ${s.error.status}` : ''),
                            React.createElement("p", null, s.error.message),
                            React.createElement("small", null, "Open the error details in the inspector. For 400, fix the request; for 429 or 529, use a bounded retry.")),
                        s.selectedTab === 'Guided JSON' && React.createElement("div", { className: "cl-inspector-split" },
                            React.createElement("div", null,
                                React.createElement("div", { className: "cl-prehead" },
                                    "REQUEST ",
                                    React.createElement("button", { onClick: () => copyText(pretty(request)), title: "Copy request" }, "Copy")),
                                React.createElement("div", { className: "cl-code" },
                                    React.createElement(GuidedNode, { value: request, k: "request" }))),
                            React.createElement("div", null,
                                React.createElement("div", { className: "cl-prehead" },
                                    s.error ? 'ERROR RESPONSE' : 'SIMULATED RESPONSE',
                                    " ",
                                    React.createElement("button", { disabled: !raw, onClick: () => copyText(pretty(raw)), title: "Copy response" }, "Copy")),
                                React.createElement("div", { className: "cl-code" }, raw ? React.createElement(GuidedNode, { value: raw, k: "response" }) : React.createElement("div", { className: "cl-empty" },
                                    "Run any scenario to inspect every response field. Hover a ",
                                    React.createElement("strong", null, "?"),
                                    " icon or tap it for a definition.")))),
                        s.selectedTab === 'Raw JSON' && React.createElement("div", { className: "cl-inspector-split" },
                            React.createElement("div", null,
                                React.createElement("div", { className: "cl-prehead" }, "REQUEST JSON"),
                                React.createElement("pre", { className: "cl-raw" }, pretty(request))),
                            React.createElement("div", null,
                                React.createElement("div", { className: "cl-prehead" }, s.error ? 'ERROR JSON' : 'RESPONSE JSON'),
                                React.createElement("pre", { className: "cl-raw" }, raw ? pretty(raw) : '// Run a simulation to view the result.'))),
                        s.selectedTab === 'Event timeline' && React.createElement("div", { className: "cl-events" },
                            React.createElement("p", null, "Real SSE messages are received over HTTP, while their content and scheduled delivery are entirely simulated."),
                            s.events.length ? s.events.map((e, i) => React.createElement("details", { key: i },
                                React.createElement("summary", null,
                                    React.createElement("span", { className: "cl-event-num" }, i + 1),
                                    React.createElement("span", null, e.name),
                                    React.createElement("small", null,
                                        "+",
                                        e.at,
                                        " ms")),
                                React.createElement("pre", null, pretty(e.data)))) : React.createElement("div", { className: "cl-empty" },
                                "Enable streaming, then Run. The complete sequence of ",
                                React.createElement("code", null, "message_start"),
                                ", ",
                                React.createElement("code", null, "content_block_delta"),
                                ", and ",
                                React.createElement("code", null, "message_stop"),
                                " appears here.")),
                        s.selectedTab === 'How it works' && React.createElement("div", { className: "cl-explain-detail" },
                            React.createElement("h3", null, selected.name),
                            React.createElement("p", null, selected.skill),
                            React.createElement("p", null, selected.tip),
                            React.createElement("h4", null, "What is happening underneath?"),
                            React.createElement("ol", null,
                                React.createElement("li", null, "Your browser prepares a Messages-shaped JSON request."),
                                React.createElement("li", null, "Node.js validates the scenario, fields, conversation history and limits."),
                                React.createElement("li", null, "The offline rules engine returns deterministic content or a controlled error."),
                                React.createElement("li", null, "Browser clocks measure the elapsed network time; a rough character formula estimates token counts."),
                                React.createElement("li", null,
                                    "Tool examples add a ",
                                    React.createElement("code", null, "tool_use"),
                                    " block and require an application-side ",
                                    React.createElement("code", null, "tool_result"),
                                    " continuation.")),
                            React.createElement("h4", null, "What this cannot demonstrate"),
                            React.createElement("p", null, "Claude's true intelligence, reasoning quality, precise tokenization, real cache hits, billing, model benchmarks, live MCP server connectivity, or model-generated tool decisions. Use the official Messages API documentation for exact contracts."),
                            React.createElement("a", { target: "_blank", rel: "noopener noreferrer", href: "https://platform.claude.com/docs/en/api/messages/create" }, "Official Messages API documentation \u2197")),
                        s.result && React.createElement("div", { className: "cl-debug-summary" },
                            React.createElement("div", null,
                                React.createElement("b", null, "stop_reason"),
                                React.createElement("code", null, (response === null || response === void 0 ? void 0 : response.stop_reason) || '—'),
                                React.createElement(FieldHint, { field: "stop_reason" })),
                            React.createElement("div", null,
                                React.createElement("b", null, "Time to first byte"),
                                React.createElement("code", null, s.ttfb == null ? '—' : ms(s.ttfb))),
                            React.createElement("div", null,
                                React.createElement("b", null, "Input / output"),
                                React.createElement("code", null,
                                    "~",
                                    (metrics === null || metrics === void 0 ? void 0 : metrics.estimated_input_tokens) || 0,
                                    " / ~",
                                    (metrics === null || metrics === void 0 ? void 0 : metrics.estimated_output_tokens) || 0,
                                    " tokens")),
                            React.createElement("div", null,
                                React.createElement("b", null, "Approx. throughput"),
                                React.createElement("code", null,
                                    throughput || '—',
                                    " estimated tok/s")),
                            React.createElement("div", null,
                                React.createElement("b", null, "Local processing"),
                                React.createElement("code", null,
                                    ms(metrics === null || metrics === void 0 ? void 0 : metrics.server_processing_ms),
                                    " \u00B7 artificial delay ",
                                    ms(metrics === null || metrics === void 0 ? void 0 : metrics.simulated_model_delay_ms))),
                            React.createElement("div", null,
                                React.createElement("b", null, "First byte"),
                                React.createElement("code", null, s.ttfb == null ? 'Not measured' : ms(s.ttfb))),
                            React.createElement("div", null,
                                React.createElement("b", null, "Provider token usage"),
                                React.createElement("code", null, "null \u00B7 not measured")),
                            (cache === null || cache === void 0 ? void 0 : cache.enabled) && React.createElement("div", null,
                                React.createElement("b", null, "Local cache demo"),
                                React.createElement("code", null, cache.hit ? 'Repeated request ✓' : 'First request')),
                            s.toolTrace && React.createElement("div", null,
                                React.createElement("b", null, "Tool round trip"),
                                React.createElement("code", null, "2 model-shaped requests + 1 fixture"))),
                        s.attempts.length > 0 && React.createElement("div", { className: "cl-attempts" },
                            React.createElement("div", { className: "cl-prehead" }, "HTTP ATTEMPT TRACE"),
                            s.attempts.map((a, i) => React.createElement("div", { key: i, className: "cl-attempt" },
                                React.createElement("strong", null,
                                    "Attempt ",
                                    a.attempt),
                                React.createElement("span", { className: a.status === 200 ? 'cl-success' : 'cl-fail' }, a.status === 200 ? '200 success' : `HTTP ${a.status}`),
                                React.createElement("span", null,
                                    a.elapsed,
                                    " ms"),
                                a.message && React.createElement("small", null, a.message)))),
                        s.toolTrace && React.createElement("div", { className: "cl-tooltrace" },
                            React.createElement("div", { className: "cl-prehead" }, "TOOL LOOP TRACE"),
                            React.createElement("details", null,
                                React.createElement("summary", null, "1. Assistant requested tool_use"),
                                React.createElement("pre", null, pretty(s.toolTrace.first.response.content))),
                            React.createElement("details", null,
                                React.createElement("summary", null, "2. Local fixture tool_result"),
                                React.createElement("pre", null, pretty((_e = s.toolOutput) === null || _e === void 0 ? void 0 : _e.tool_result))),
                            React.createElement("details", null,
                                React.createElement("summary", null, "3. Assistant response after tool result"),
                                React.createElement("pre", null, pretty(s.toolTrace.second.response))))))),
            React.createElement("div", { className: "cl-bottom-guide" },
                React.createElement("div", null,
                    React.createElement("span", { className: "cl-guide-icon" }, "01"),
                    React.createElement("strong", null, "Choose a scenario"),
                    React.createElement("p", null, "18 exercises from conversation history to streaming, context, error handling, security and MCP concepts.")),
                React.createElement("div", null,
                    React.createElement("span", { className: "cl-guide-icon" }, "02"),
                    React.createElement("strong", null, "Edit & run"),
                    React.createElement("p", null, "Try your own prompts and parameters. The scripted lesson engine still works with arbitrary inputs, but never pretends to be a model.")),
                React.createElement("div", null,
                    React.createElement("span", { className: "cl-guide-icon" }, "03"),
                    React.createElement("strong", null, "Inspect deeply"),
                    React.createElement("p", null, "Hover or focus ? for field definitions. Export traces, retry failures, complete tool loops and compare token estimates with wall time."))));
    }
}
window.ClaudePathPlayground = ClaudePathPlayground;
