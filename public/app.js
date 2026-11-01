/* Claude Cert Academy — React frontend. Compiled to public/app.js; no inference API key required. */
const ReactUI = window.React;
const { Component } = ReactUI;
const ICON_PATHS = {
    grid: ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M3 14h7v7H3z', 'M14 14h7v7h-7z'],
    book: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'],
    layers: ['M12 2 2 7l10 5 10-5-10-5z', 'm2 12 10 5 10-5', 'm-20 5 10 5 10-5'],
    list: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'],
    award: ['M12 15l-3.7 2.2.7-4.3-3-3 4.2-.6L12 5l1.8 4.3 4.2.6-3 3 .7 4.3z', 'M12 22l-5-3 1-3', 'M12 22l5-3-1-3'],
    chart: ['M3 3v18h18', 'M7 16l4-5 4 3 5-8'],
    terminal: ['M4 17l6-6-6-6', 'M12 19h8'],
    search: ['m21 21-4.4-4.4', 'M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0z'],
    arrow: ['M5 12h14', 'm12 5 7 7-7 7'],
    left: ['M19 12H5', 'm12 19-7-7 7-7'],
    check: ['M20 6 9 17l-5-5'],
    circle: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z'],
    clock: ['M12 6v6l4 2', 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z'],
    calendar: ['M3 5h18v16H3z', 'M16 3v4', 'M8 3v4', 'M3 10h18'],
    bolt: ['m13 2-9 12h7l-1 8 10-12h-7l0-8z'],
    lock: ['M5 11V7a7 7 0 0 1 14 0v4', 'M4 11h16v11H4z'],
    shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'm9 12 2 2 4-4'],
    spark: ['m12 3 1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9z'],
    chevron: ['m9 18 6-6-6-6'],
    down: ['m6 9 6 6 6-6'],
    link: ['M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7', 'M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7'],
    play: ['M7 4v16l13-8-13-8z'],
    copy: ['M8 4h13v16H8z', 'M4 8H3v13h13v-1'],
    refresh: ['M3 11a9 9 0 1 1 2.6 6.4', 'M3 4v7h7'],
    menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
    x: ['M18 6 6 18', 'M6 6l12 12'],
    info: ['M12 12v5', 'M12 8h.01', 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z'],
    target: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M12 12h.01'],
    flame: ['M12 22a8 8 0 0 0 8-8c0-3-2-5-3-6 0 3-2 4-3 4-1-4 0-7-5-10 0 4-5 7-5 12a8 8 0 0 0 8 8z'],
    sliders: ['M4 7h16', 'M4 17h16', 'M8 4v6', 'M16 14v6'],
    flag: ['M5 21V4', 'M5 5c4-3 9 3 15 0v11c-6 3-11-3-15 0'],
    external: ['M14 3h7v7', 'M21 3l-9 9', 'M18 13v8H3V6h8'],
    download: ['M12 3v12', 'm7 10 5 5 5-5', 'M5 19h14'],
    trophy: ['M8 21h8', 'M12 17v4', 'M6 3h12v8a6 6 0 0 1-12 0z', 'M6 5H3v4a4 4 0 0 0 4 4', 'M18 5h3v4a4 4 0 0 1-4 4']
};
function Icon({ name, size = 18, className = '' }) { return React.createElement("svg", { className: 'ico ' + className, width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, (ICON_PATHS[name] || ICON_PATHS.circle).map((d, i) => React.createElement("path", { d: d, key: i }))); }
function Chip({ children, tone = 'neutral' }) { return React.createElement("span", { className: 'chip chip-' + tone }, children); }
function BoxTitle({ eyebrow, title, subtitle, action }) { return React.createElement("div", { className: "section-heading" },
    React.createElement("div", null,
        React.createElement("div", { className: "eyebrow" }, eyebrow),
        React.createElement("h2", null, title),
        subtitle && React.createElement("p", null, subtitle)),
    action); }
const pad = n => String(n).padStart(2, '0');
function prettyDate(day) { return 'NOV ' + pad(day) + ', 2026'; }
function iconForDomain(name) { return name.includes('Applications') ? 'layers' : name.includes('Model') ? 'sliders' : name.includes('Agents') ? 'bolt' : name.includes('Prompt') ? 'book' : name.includes('Tools') ? 'terminal' : name.includes('Security') ? 'shield' : name.includes('Claude Code') ? 'code' : 'chart'; }
function readLearner() { let id = localStorage.getItem('claude-academy-learner'); if (!id) {
    id = 'learn_' + (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
    localStorage.setItem('claude-academy-learner', id);
} return id; }
function progressKey(learner) { return 'claude-academy-backup-' + learner; }
function readBackup(learner) { try {
    return JSON.parse(localStorage.getItem(progressKey(learner)) || 'null');
}
catch (_a) {
    return null;
} }
function saveBackup(learner, backup) { if (backup) {
    try {
        localStorage.setItem(progressKey(learner), JSON.stringify(backup));
    }
    catch (_a) { }
} }
async function api(url, options = {}) { const response = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } }); const data = await response.json(); if (!response.ok)
    throw new Error(data.error || `HTTP ${response.status}`); return data; }
function Ring({ percent, size = 124, color = '#da815e', label }) { return React.createElement("div", { className: "progress-ring", style: { width: size, height: size, '--ring-color': color, '--ring-progress': `${Math.max(0, Math.min(100, percent))}%` } },
    React.createElement("div", { className: "progress-ring-inner" },
        React.createElement("b", null,
            Math.round(percent),
            "%"),
        React.createElement("small", null, label || 'complete'))); }
function Stat({ icon, value, label, detail, tone }) { return React.createElement("div", { className: "stat-card" },
    React.createElement("div", { className: 'stat-icon tone-' + (tone || 'peach') },
        React.createElement(Icon, { name: icon, size: 19 })),
    React.createElement("div", null,
        React.createElement("div", { className: "stat-value" }, value),
        React.createElement("div", { className: "stat-label" }, label),
        React.createElement("div", { className: "stat-detail" }, detail))); }
const sideLinks = [['dashboard', 'grid', 'Overview'], ['path', 'layers', 'Learning path'], ['notes', 'book', 'Study notes'], ['assessments', 'list', 'Assessments'], ['progress', 'chart', 'My progress'], ['playground', 'terminal', 'API playground']];
class App extends Component {
    constructor(props) {
        super(props);
        this.handleHash = () => { const p = location.hash.replace('#', ''); if (sideLinks.some(x => x[0] === p)) {
            this.setState({ page: p, quiz: null, quizResult: null });
        } };
        this.toast = (value) => { clearTimeout(this.toastTimer); this.setState({ notice: value }); this.toastTimer = setTimeout(() => this.setState({ notice: '' }), 3800); };
        this.refresh = async () => { try {
            const backup = readBackup(this.learner);
            if (backup) {
                try {
                    const restored = await api('/api/restore', { method: 'POST', body: JSON.stringify({ learner: this.learner, backup }) });
                    saveBackup(this.learner, restored.backup);
                }
                catch (err) {
                    console.warn('Local backup could not be restored:', err.message);
                }
            }
            const data = await api('/api/bootstrap?learner=' + encodeURIComponent(this.learner));
            this.setState({ lessons: data.curriculum, summary: data.summary, loading: false });
        }
        catch (e) {
            this.setState({ loading: false });
            this.toast('Unable to load learning data: ' + e.message);
        } };
        this.nav = (page) => { this.setState({ page, quiz: null, quizResult: null, mobileOpen: false, search: '' }); history.replaceState({}, '', page === 'dashboard' ? './' : '#' + page); window.scrollTo({ top: 0, behavior: 'smooth' }); };
        this.goDay = (day) => { this.setState({ page: 'lesson', selectedDay: day, quiz: null, quizResult: null, mobileOpen: false }); history.replaceState({}, '', '#lesson-' + day); window.scrollTo(0, 0); };
        this.mark = async (day, field, value) => { try {
            const res = await api('/api/lesson', { method: 'POST', body: JSON.stringify({ learner: this.learner, day, field, value }) });
            saveBackup(this.learner, res.backup);
            this.setState({ summary: res.summary });
            this.toast(value ? 'Progress saved' : 'Progress updated');
        }
        catch (e) {
            this.toast(e.message);
        } };
        this.startQuiz = async (id) => { try {
            const quiz = await api('/api/quiz/' + id + '?learner=' + encodeURIComponent(this.learner));
            this.setState({ quiz, quizResult: null, answers: {}, remaining: quiz.timeLimitSeconds, currentQ: 0, quizStarted: Date.now(), page: 'quiz', quizSubmitting: false });
            history.replaceState({}, '', '#quiz');
            window.scrollTo(0, 0);
        }
        catch (e) {
            this.toast(e.message);
        } };
        this.answer = (qid, value) => this.setState(s => ({ answers: { ...s.answers, [qid]: value } }));
        this.submitQuiz = async (auto = false) => { if (this.state.quizSubmitting || !this.state.quiz || this.state.quizResult)
            return; const { quiz, answers, quizStarted } = this.state; this.setState({ quizSubmitting: true }); try {
            const res = await api('/api/quiz/' + quiz.id + '/submit', { method: 'POST', body: JSON.stringify({ learner: this.learner, answers, elapsedSeconds: Math.round((Date.now() - quizStarted) / 1000) }) });
            saveBackup(this.learner, res.backup);
            this.setState({ quizResult: res.result, summary: res.summary, quizSubmitting: false });
            this.toast(auto ? 'Time is up. Your attempt was graded.' : 'Your attempt is graded and saved.');
            window.scrollTo(0, 0);
        }
        catch (e) {
            this.setState({ quizSubmitting: false });
            this.toast(e.message);
        } };
        this.runSim = async () => { this.setState({ simLoading: true }); try {
            const result = await api('/api/simulate', { method: 'POST', body: JSON.stringify({ prompt: this.state.simPrompt, system: this.state.simSystem, max_tokens: this.state.simMax }) });
            this.setState({ simOutput: result, simLoading: false });
        }
        catch (e) {
            this.setState({ simLoading: false });
            this.toast(e.message);
        } };
        this.reset = async () => { if (!window.confirm('Clear this local learner profile and all quiz attempts? This cannot be undone.'))
            return; try {
            const r = await api('/api/reset', { method: 'POST', body: JSON.stringify({ learner: this.learner }) });
            saveBackup(this.learner, r.backup);
            this.setState({ summary: r.summary, showReset: false });
            this.toast('Progress reset');
            this.nav('dashboard');
        }
        catch (e) {
            this.toast(e.message);
        } };
        this.learner = readLearner();
        this.state = { page: 'dashboard', selectedDay: 1, weekFilter: 'all', search: '', loading: true, lessons: [], summary: null, quiz: null, quizResult: null, answers: {}, currentQ: 0, remaining: 0, quizSubmitting: false, quizStarted: 0, simPrompt: 'Explain what an API is in one sentence.', simSystem: 'You are a concise and friendly teacher.', simMax: 256, simOutput: null, simLoading: false, mobileOpen: false, notice: '', showReset: false };
        this.ticker = null;
        this.toastTimer = null;
    }
    componentDidMount() { this.refresh(); this.ticker = setInterval(() => { if (this.state.quiz && !this.state.quizResult && !this.state.quizSubmitting) {
        if (this.state.remaining <= 1)
            this.submitQuiz(true);
        else
            this.setState(s => ({ remaining: s.remaining - 1 }));
    } }, 1000); window.addEventListener('hashchange', this.handleHash); this.handleHash(); }
    componentWillUnmount() { clearInterval(this.ticker); clearTimeout(this.toastTimer); window.removeEventListener('hashchange', this.handleHash); }
    renderSidebar() {
        const { page, mobileOpen, summary } = this.state;
        return React.createElement(React.Fragment, null,
            React.createElement("div", { className: 'sidebar-backdrop ' + (mobileOpen ? 'visible' : ''), onClick: () => this.setState({ mobileOpen: false }) }),
            React.createElement("aside", { className: 'sidebar ' + (mobileOpen ? 'mobile-open' : '') },
                React.createElement("div", { className: "brand", onClick: () => this.nav('dashboard') },
                    React.createElement("div", { className: "brand-symbol" },
                        React.createElement("span", { className: "brand-spark" }, "\u2733")),
                    React.createElement("div", null,
                        React.createElement("strong", null,
                            "claude",
                            React.createElement("span", { className: "brand-accent" }, "path")),
                        React.createElement("small", null, "DEVELOPER ACADEMY"))),
                React.createElement("div", { className: "sidebar-block-label" }, "YOUR WORKSPACE"),
                React.createElement("div", { className: "side-nav" }, sideLinks.map(([id, ico, label]) => React.createElement("button", { key: id, className: 'side-link ' + ((page === id || (page === 'lesson' && id === 'path') || (page === 'quiz' && id === 'assessments')) ? 'active' : ''), onClick: () => this.nav(id) },
                    React.createElement(Icon, { name: ico, size: 18 }),
                    React.createElement("span", null, label),
                    (id === 'assessments') && React.createElement("i", { className: "nav-dot" })))),
                React.createElement("div", { className: "sidebar-grow" }),
                React.createElement("div", { className: "sidebar-challenge" },
                    React.createElement("div", { className: "sidebar-challenge-top" },
                        React.createElement(Icon, { name: "spark", size: 16 }),
                        " LEARNING MODE"),
                    React.createElement("strong", null, "One day at a time."),
                    React.createElement("p", null, "Short lessons. Real practice. Confidence that compounds."),
                    React.createElement("div", { className: "mini-bar" },
                        React.createElement("span", { style: { width: `${(summary ? summary.completedDays : 0) / 21 * 100}%` } })),
                    React.createElement("small", null,
                        summary ? summary.completedDays : 0,
                        " / 21 days mastered")),
                React.createElement("div", { className: "side-profile" },
                    React.createElement("div", { className: "avatar" }, "S"),
                    React.createElement("div", null,
                        React.createElement("strong", null, "Study account"),
                        React.createElement("small", null, "Local progress profile")),
                    React.createElement(Icon, { name: "shield", size: 15 }))));
    }
    renderHeader() { const names = { dashboard: ['Your learning dashboard', 'Your journey · Nov 1–21, 2026'], path: ['Your learning path', '21 focused sessions, one clear destination'], lesson: ['Lesson workspace', 'Read, practise, then prove you understand'], notes: ['Knowledge library', 'Every important concept, in one place'], assessments: ['Exam practice centre', 'Daily checks, weekly mocks and final assessment'], progress: ['Your progress report', 'Real evidence, not just a completion badge'], playground: ['No-key API playground', 'Experience request and response shapes without a paid API'], quiz: ['Assessment session', 'Focus. Reason. Review. Improve.'] }; const [name, desc] = names[this.state.page] || names.dashboard; return React.createElement("header", { className: "topbar" },
        React.createElement("div", { className: "topbar-left" },
            React.createElement("button", { className: "mobile-toggle", onClick: () => this.setState(s => ({ mobileOpen: !s.mobileOpen })) },
                React.createElement(Icon, { name: "menu" })),
            React.createElement("div", null,
                React.createElement("div", { className: "topbar-title" }, name),
                React.createElement("div", { className: "topbar-sub" }, desc))),
        React.createElement("div", { className: "topbar-right" },
            React.createElement("div", { className: "topbar-pill" },
                React.createElement("span", { className: "online-dot" }),
                " 100% API-key free"),
            React.createElement("div", { className: "topbar-avatar" }, "S"))); }
    renderDashboard() {
        const { summary, lessons } = this.state;
        const done = summary.completedDays;
        const current = Math.min(21, Math.max(1, done + 1));
        const lesson = lessons[current - 1];
        const week = Math.ceil(current / 7);
        const overall = done / 21 * 100;
        const recommended = lessons.filter(x => x.day >= current).slice(0, 3);
        return React.createElement("div", { className: "page-content" },
            React.createElement("div", { className: "welcome-row" },
                React.createElement("span", null,
                    React.createElement("span", { className: "tiny-sun" }, "\u2739"),
                    " YOUR 21-DAY LEARNING JOURNEY"),
                React.createElement(Chip, { tone: "peach" }, "NOV 01 \u2014 NOV 21, 2026")),
            React.createElement("section", { className: "hero" },
                React.createElement("div", { className: "hero-bloom hero-bloom-one" }),
                React.createElement("div", { className: "hero-bloom hero-bloom-two" }),
                React.createElement("div", { className: "hero-copy" },
                    React.createElement("div", { className: "hero-eyebrow" },
                        React.createElement(Icon, { name: "spark", size: 15 }),
                        " CLAUDE DEVELOPER FOUNDATIONS"),
                    React.createElement("h1", null,
                        "Build skill.",
                        React.createElement("br", null),
                        React.createElement("em", null, "Earn confidence.")),
                    React.createElement("p", null, "A focused 21-day path from API fundamentals to real-world agent architecture. All the learning, none of the expensive API calls."),
                    React.createElement("div", { className: "hero-actions" },
                        React.createElement("button", { className: "btn btn-coral", onClick: () => this.goDay(current) },
                            "Continue Day ",
                            current,
                            " ",
                            React.createElement(Icon, { name: "arrow", size: 17 })),
                        React.createElement("button", { className: "btn btn-glass", onClick: () => this.nav('path') }, "Explore curriculum"))),
                React.createElement("div", { className: "hero-meter" },
                    React.createElement(Ring, { percent: overall, size: 188, color: "#ed9a76", label: "completed" }),
                    React.createElement("div", { className: "hero-meter-bottom" },
                        React.createElement("strong", null,
                            done,
                            React.createElement("span", null, "/21")),
                        React.createElement("small", null, "days mastered")))),
            React.createElement("div", { className: "stats-grid" },
                React.createElement(Stat, { icon: "check", value: `${done}/21`, label: "Days mastered", detail: "Notes + lab + quiz" }),
                React.createElement(Stat, { icon: "target", value: summary.attemptsCount, label: "Tests attempted", detail: "Every attempt is saved", tone: "teal" }),
                React.createElement(Stat, { icon: "chart", value: summary.weekly.filter(w => w.score >= 75).length + '/3', label: "Weekly mocks passed", detail: "Three progress checkpoints", tone: "purple" }),
                React.createElement(Stat, { icon: "award", value: summary.finalScore < 0 ? '—' : summary.finalScore + '%', label: "Final best score", detail: "Target: 85%+", tone: "gold" })),
            React.createElement("div", { className: "content-grid" },
                React.createElement("div", { className: "wide-column" },
                    React.createElement(BoxTitle, { eyebrow: "PICK UP WHERE YOU LEFT OFF", title: "Today's focus", action: React.createElement("button", { className: "text-action", onClick: () => this.nav('path') },
                            "View all lessons ",
                            React.createElement(Icon, { name: "arrow", size: 15 })) }),
                    React.createElement("div", { className: "focus-card" },
                        React.createElement("div", { className: "focus-number" },
                            React.createElement("span", null, "DAY"),
                            React.createElement("strong", null, pad(current))),
                        React.createElement("div", { className: "focus-info" },
                            React.createElement("div", { className: "focus-top" },
                                React.createElement(Chip, { tone: "peach" },
                                    "WEEK ",
                                    week),
                                React.createElement("span", null, "2 hour learning sprint")),
                            React.createElement("h3", null, lesson.title),
                            React.createElement("p", null, lesson.summary),
                            React.createElement("div", { className: "focus-actions" },
                                React.createElement("button", { className: "btn btn-dark", onClick: () => this.goDay(current) },
                                    "Open today's lesson ",
                                    React.createElement(Icon, { name: "arrow", size: 16 })),
                                React.createElement("button", { className: "focus-quiz-link", onClick: () => this.startQuiz('day' + current) }, "Take daily quiz")))),
                    React.createElement(BoxTitle, { eyebrow: "THE ROAD AHEAD", title: "Next on your path", action: React.createElement("button", { className: "text-action", onClick: () => this.nav('path') },
                            "Full roadmap ",
                            React.createElement(Icon, { name: "arrow", size: 15 })) }),
                    React.createElement("div", { className: "upcoming-list" }, recommended.map(l => React.createElement("button", { key: l.day, className: "upcoming-row", onClick: () => this.goDay(l.day) },
                        React.createElement("span", { className: "upcoming-index" }, pad(l.day)),
                        React.createElement("span", { className: "upcoming-info" },
                            React.createElement("strong", null, l.title),
                            React.createElement("small", null, l.domain)),
                        React.createElement("span", { className: "upcoming-time" }, "120 MIN"),
                        React.createElement(Icon, { name: "chevron", size: 16 }))))),
                React.createElement("div", { className: "narrow-column" },
                    React.createElement(BoxTitle, { eyebrow: "MILESTONES", title: "Weekly checkpoints" }),
                    React.createElement("div", { className: "milestone-card" },
                        summary.weekly.map((w, i) => React.createElement("button", { key: w.week, className: "milestone", onClick: () => this.startQuiz('week' + w.week) },
                            React.createElement("div", { className: 'milestone-icon ' + (w.score >= 75 ? 'is-done' : '') },
                                React.createElement(Icon, { name: w.score >= 75 ? 'check' : 'flag', size: 19 })),
                            React.createElement("div", { className: "milestone-copy" },
                                React.createElement("strong", null,
                                    "Week ",
                                    w.week,
                                    " mock"),
                                React.createElement("small", null, w.score < 0 ? 'Scheduled · Nov ' + [7, 14, 21][i] : `Best score · ${w.score}%`)),
                            React.createElement(Icon, { name: "chevron", size: 16 }))),
                        React.createElement("button", { className: "milestone milestone-final", onClick: () => this.startQuiz('final') },
                            React.createElement("div", { className: "milestone-icon gold" },
                                React.createElement(Icon, { name: "trophy", size: 20 })),
                            React.createElement("div", { className: "milestone-copy" },
                                React.createElement("strong", null, "Final assessment"),
                                React.createElement("small", null, summary.finalScore < 0 ? '36 questions · 90 minutes' : `Best score · ${summary.finalScore}%`)),
                            React.createElement(Icon, { name: "chevron", size: 16 }))),
                    React.createElement("div", { className: "tip-card" },
                        React.createElement("div", { className: "tip-icon" },
                            React.createElement(Icon, { name: "bolt", size: 19 })),
                        React.createElement("span", { className: "tip-label" }, "THE LEARNING RULE"),
                        React.createElement("h3", null,
                            "Learn it. Build it.",
                            React.createElement("br", null),
                            "Prove it."),
                        React.createElement("p", null, "A day counts as mastered only after reviewing notes, completing its exercise and earning at least 75% on the daily quiz."),
                        React.createElement("button", { onClick: () => this.nav('progress') },
                            "How mastery works ",
                            React.createElement(Icon, { name: "arrow", size: 15 }))))),
            React.createElement("div", { className: "footer-line" }, "Built for independent learning \u00B7 No Anthropic API key required \u00B7 Not affiliated with Anthropic"));
    }
    renderPath() {
        let { lessons, summary, search, weekFilter } = this.state;
        let items = lessons.filter(x => (weekFilter === 'all' || Math.ceil(x.day / 7) == Number(weekFilter)) && (!search || [x.title, x.domain, x.summary, x.tag].join(' ').toLowerCase().includes(search.toLowerCase())));
        return React.createElement("div", { className: "page-content" },
            React.createElement(BoxTitle, { eyebrow: "YOUR CURRICULUM", title: "Twenty-one days to confident building", subtitle: "Three chapters. Seven days each. Every day includes real notes, an offline lab and graded questions." }),
            React.createElement("div", { className: "path-top" },
                React.createElement("div", { className: "path-progress" },
                    React.createElement(Ring, { percent: summary.completedDays / 21 * 100, size: 86, label: "mastered" }),
                    React.createElement("div", null,
                        React.createElement("strong", null,
                            summary.completedDays,
                            " days complete"),
                        React.createElement("p", null, "Complete the notes, the hands-on lab, and a 75%+ daily quiz."))),
                React.createElement("div", { className: "path-filter" },
                    React.createElement("div", { className: "search-box" },
                        React.createElement(Icon, { name: "search", size: 17 }),
                        React.createElement("input", { value: search, placeholder: "Find a topic...", onChange: e => this.setState({ search: e.target.value }) })),
                    React.createElement("div", { className: "segmented" }, ['all', '1', '2', '3'].map(x => React.createElement("button", { key: x, className: weekFilter === x ? 'selected' : '', onClick: () => this.setState({ weekFilter: x }) }, x === 'all' ? 'All' : `Week ${x}`))))),
            React.createElement("div", { className: "lesson-grid" }, items.map(l => { const day = summary.dayStats[l.day - 1]; const mastered = day.completed; return React.createElement("button", { key: l.day, className: 'lesson-card ' + (mastered ? 'lesson-done' : ''), onClick: () => this.goDay(l.day) },
                React.createElement("div", { className: "lesson-card-top" },
                    React.createElement("div", { className: "lesson-day" },
                        "DAY ",
                        pad(l.day)),
                    mastered ? React.createElement(Chip, { tone: "teal" },
                        React.createElement(Icon, { name: "check", size: 12 }),
                        " Mastered") : React.createElement(Chip, { tone: "neutral" },
                        "W",
                        Math.ceil(l.day / 7),
                        " \u00B7 2H")),
                React.createElement("div", { className: 'lesson-mini-icon ' + (l.day % 3 === 0 ? 'cyan' : l.day % 3 === 1 ? 'coral' : 'violet') },
                    React.createElement(Icon, { name: iconForDomain(l.domain), size: 21 })),
                React.createElement("h3", null, l.title),
                React.createElement("p", null, l.summary),
                React.createElement("div", { className: "lesson-bottom" },
                    React.createElement("span", null, l.tag),
                    React.createElement(Icon, { name: "arrow", size: 18 }))); })),
            items.length === 0 && React.createElement("div", { className: "empty-state" }, "No lessons match your search."));
    }
    renderLesson() {
        const l = this.state.lessons[this.state.selectedDay - 1];
        const day = this.state.summary.dayStats[l.day - 1];
        return React.createElement("div", { className: "page-content lesson-view" },
            React.createElement("button", { className: "back-link", onClick: () => this.nav('path') },
                React.createElement(Icon, { name: "left", size: 16 }),
                " Back to learning path"),
            React.createElement("div", { className: "lesson-hero" },
                React.createElement("div", null,
                    React.createElement("div", { className: "lesson-kicker" },
                        "WEEK ",
                        Math.ceil(l.day / 7),
                        " ",
                        React.createElement("span", null, "\u2022"),
                        " DAY ",
                        pad(l.day),
                        " OF 21 ",
                        React.createElement("span", null, "\u2022"),
                        " ",
                        l.tag),
                    React.createElement("h1", null, l.title),
                    React.createElement("p", null, l.summary),
                    React.createElement("div", { className: "lesson-meta" },
                        React.createElement("span", null,
                            React.createElement(Icon, { name: "clock", size: 15 }),
                            " 120 minute session"),
                        React.createElement("span", null,
                            React.createElement(Icon, { name: "layers", size: 15 }),
                            " ",
                            l.domain))),
                React.createElement("div", { className: "lesson-hero-stamp" },
                    pad(l.day),
                    React.createElement("small", null, "/21"))),
            React.createElement("div", { className: "lesson-layout" },
                React.createElement("div", { className: "lesson-main" },
                    React.createElement("div", { className: "note-panel" },
                        React.createElement("div", { className: "note-panel-label" },
                            React.createElement(Icon, { name: "target", size: 17 }),
                            " LEARNING OBJECTIVES"),
                        React.createElement("div", { className: "objectives" }, l.objectives.map((o, i) => React.createElement("div", { key: i },
                            React.createElement("div", { className: "objective-dot" },
                                React.createElement(Icon, { name: "check", size: 13 })),
                            React.createElement("span", null, o))))),
                    React.createElement("div", { className: "note-panel reading-panel" },
                        React.createElement("div", { className: "note-panel-label" },
                            React.createElement(Icon, { name: "book", size: 17 }),
                            " ESSENTIAL STUDY NOTES"),
                        l.notes.map((n, i) => React.createElement("section", { className: "note-section", key: i },
                            React.createElement("div", { className: "section-marker" },
                                "0",
                                i + 1),
                            React.createElement("div", { className: "note-section-text" },
                                React.createElement("h3", null, n.heading),
                                React.createElement("p", null, n.body),
                                React.createElement("div", { className: "example-line" },
                                    React.createElement("span", null, "EXAMPLE"),
                                    React.createElement("code", null, n.example))))),
                        React.createElement("div", { className: "key-box" },
                            React.createElement("strong", null, "Remember these three ideas"),
                            l.takeaways.map((t, i) => React.createElement("div", { key: i },
                                React.createElement(Icon, { name: "check", size: 14 }),
                                t)))),
                    React.createElement("div", { className: "note-panel" },
                        React.createElement("div", { className: "note-panel-label" },
                            React.createElement(Icon, { name: "terminal", size: 17 }),
                            " HANDS-ON LAB"),
                        React.createElement("h3", { className: "lab-title" }, l.lab.title),
                        React.createElement("p", { className: "lab-intro" }, "Complete this with local code, mock responses or free MCP tools. No paid model is required."),
                        React.createElement("div", { className: "lab-steps" }, l.lab.steps.map((s, i) => React.createElement("div", { key: i },
                            React.createElement("span", null, i + 1),
                            React.createElement("p", null, s)))),
                        React.createElement("div", { className: "lab-expected" },
                            React.createElement(Icon, { name: "target", size: 16 }),
                            React.createElement("div", null,
                                React.createElement("strong", null, "Success criterion"),
                                React.createElement("p", null, l.lab.expected))))),
                React.createElement("aside", { className: "lesson-aside" },
                    React.createElement("div", { className: "task-panel" },
                        React.createElement("div", { className: "eyebrow" },
                            "DAY ",
                            pad(l.day),
                            " CHECKLIST"),
                        React.createElement("h3", null, "Make it count."),
                        React.createElement("p", null, "Finish all three steps to master this lesson."),
                        React.createElement("label", { className: "check-line" },
                            React.createElement("input", { type: "checkbox", checked: day.reviewed, onChange: e => this.mark(l.day, 'reviewed', e.target.checked) }),
                            React.createElement("span", { className: "fake-check" },
                                React.createElement(Icon, { name: "check", size: 13 })),
                            React.createElement("span", null, "Read & understood notes")),
                        React.createElement("label", { className: "check-line" },
                            React.createElement("input", { type: "checkbox", checked: day.lab, onChange: e => this.mark(l.day, 'labs', e.target.checked) }),
                            React.createElement("span", { className: "fake-check" },
                                React.createElement(Icon, { name: "check", size: 13 })),
                            React.createElement("span", null, "Hands-on exercise complete")),
                        React.createElement("div", { className: "check-line no-click" },
                            React.createElement("span", { className: 'fake-check ' + (day.bestScore >= 75 ? 'checked' : '') },
                                React.createElement(Icon, { name: "check", size: 13 })),
                            React.createElement("span", null,
                                "Quiz score \u226575% ",
                                day.bestScore >= 0 && React.createElement("small", null,
                                    "(",
                                    day.bestScore,
                                    "% best)"))),
                        React.createElement("div", { className: "task-completion" },
                            React.createElement("div", { className: "track" },
                                React.createElement("span", { style: { width: `${((day.reviewed ? 1 : 0) + (day.lab ? 1 : 0) + (day.bestScore >= 75 ? 1 : 0)) / 3 * 100}%` } })),
                            React.createElement("small", null, day.completed ? 'Day mastered!' : 'Progress is saved automatically')),
                        React.createElement("button", { className: "btn btn-coral btn-full", onClick: () => this.startQuiz('day' + l.day) },
                            "Take the daily quiz ",
                            React.createElement(Icon, { name: "arrow", size: 16 }))),
                    React.createElement("div", { className: "resource-panel" },
                        React.createElement("div", { className: "eyebrow" }, "OFFICIAL REFERENCE"),
                        React.createElement("h3", null, "Read the source."),
                        React.createElement("p", null, "Only the most useful original documentation for today's topic."),
                        l.resources.map((r, i) => React.createElement("a", { key: i, href: r.url, target: "_blank", rel: "noopener noreferrer" },
                            React.createElement(Icon, { name: "external", size: 15 }),
                            r.name))),
                    React.createElement("div", { className: "lesson-next" },
                        React.createElement("small", null, "UP NEXT"),
                        React.createElement("button", { disabled: l.day === 21, onClick: () => this.goDay(Math.min(21, l.day + 1)) },
                            l.day === 21 ? 'You reached Day 21' : this.state.lessons[Math.min(l.day, 20)].title,
                            " ",
                            React.createElement(Icon, { name: "arrow", size: 16 }))))));
    }
    renderNotes() { const search = this.state.search.toLowerCase(); const matches = this.state.lessons.map(l => ({ ...l, filteredNotes: l.notes.filter(n => [l.title, l.domain, n.heading, n.body].join(' ').toLowerCase().includes(search)) })).filter(l => l.filteredNotes.length); return React.createElement("div", { className: "page-content" },
        React.createElement(BoxTitle, { eyebrow: "THE KNOWLEDGE LIBRARY", title: "Notes worth coming back to", subtitle: "Concise explanations and real developer examples for the entire certification path." }),
        React.createElement("div", { className: "notes-search search-box" },
            React.createElement(Icon, { name: "search", size: 19 }),
            React.createElement("input", { placeholder: "Search tokens, tools, MCP, RAG, caching...", value: this.state.search, onChange: e => this.setState({ search: e.target.value }) })),
        React.createElement("div", { className: "notes-stack" },
            matches.map(l => React.createElement("div", { key: l.day, className: "notes-group" },
                React.createElement("div", { className: "notes-group-heading" },
                    React.createElement("span", null,
                        "DAY ",
                        pad(l.day)),
                    React.createElement("h3", null, l.title),
                    React.createElement("button", { onClick: () => this.goDay(l.day) },
                        "Open lesson ",
                        React.createElement(Icon, { name: "arrow", size: 14 }))),
                React.createElement("div", { className: "notes-items" }, l.filteredNotes.map((n, i) => React.createElement("article", { key: i },
                    React.createElement("h4", null, n.heading),
                    React.createElement("p", null, n.body),
                    React.createElement("div", { className: "example-line" },
                        React.createElement("span", null, "EXAMPLE"),
                        React.createElement("code", null, n.example))))))),
            !matches.length && React.createElement("div", { className: "empty-state" }, "No notes match that search. Try a broader term."))); }
    renderAssessments() {
        const s = this.state.summary;
        const weekly = [1, 2, 3].map(w => ({ id: 'week' + w, title: 'Week ' + w + ' mock exam', sub: ['API foundations, prompting & tools', 'MCP, agents, evaluation & safety', 'Production, Skills & system design'][w - 1], date: [7, 14, 21][w - 1], score: s.weekly[w - 1].score, minutes: 30, questions: 12 }));
        return React.createElement("div", { className: "page-content" },
            React.createElement(BoxTitle, { eyebrow: "PROVE WHAT YOU KNOW", title: "Assessment centre", subtitle: "Daily knowledge checks after each lesson, weekly timed mocks, and one comprehensive final exam." }),
            React.createElement("div", { className: "calendar-row" },
                React.createElement("a", { className: "btn btn-outline", href: "/study-calendar.ics", download: "ClaudePath-21-Day-Schedule.ics" },
                    React.createElement(Icon, { name: "download", size: 15 }),
                    " Download study calendar (.ics)")),
            React.createElement("div", { className: "exam-alert" },
                React.createElement(Icon, { name: "info", size: 19 }),
                React.createElement("div", null,
                    React.createElement("strong", null, "Practice assessments\u2014not official certification tests."),
                    React.createElement("p", null, "Answers are graded on the Node.js server. You can retake tests; scores and explanations are saved. The readiness verdict is a learning estimate only."))),
            React.createElement("div", { className: "assess-hero" },
                React.createElement("div", null,
                    React.createElement("div", { className: "eyebrow" }, "THE FINAL CHALLENGE"),
                    React.createElement("h2", null,
                        "Ready to prove your",
                        React.createElement("br", null),
                        React.createElement("em", null, "developer foundation?")),
                    React.createElement("p", null, "36 scenario questions \u00B7 90 minutes \u00B7 all key certification domains"),
                    React.createElement("button", { className: "btn btn-coral", onClick: () => this.startQuiz('final') },
                        s.finalScore < 0 ? 'Start final assessment' : 'Retake final assessment',
                        " ",
                        React.createElement(Icon, { name: "arrow", size: 16 }))),
                React.createElement("div", { className: "final-hero-ring" },
                    React.createElement(Ring, { size: 148, percent: Math.max(0, s.finalScore), color: "#e9b991", label: s.finalScore < 0 ? 'not taken' : 'best score' }))),
            React.createElement(BoxTitle, { eyebrow: "END-OF-WEEK EXAMS", title: "Weekly mock examinations", subtitle: "Scheduled for November 7, 14, and 21. You may practise early if you want." }),
            React.createElement("div", { className: "weekly-grid" }, weekly.map(w => React.createElement("div", { key: w.id, className: "exam-card" },
                React.createElement("div", { className: "exam-card-top" },
                    React.createElement("div", { className: "exam-icon" },
                        React.createElement(Icon, { name: "flag", size: 21 })),
                    React.createElement(Chip, { tone: w.score >= 75 ? 'teal' : 'neutral' }, w.score >= 75 ? 'PASSED' : w.score < 0 ? 'SCHEDULED' : 'RETRY RECOMMENDED')),
                React.createElement("h3", null, w.title),
                React.createElement("p", null, w.sub),
                React.createElement("div", { className: "exam-facts" },
                    React.createElement("span", null,
                        React.createElement(Icon, { name: "calendar", size: 15 }),
                        " Nov ",
                        w.date),
                    React.createElement("span", null,
                        React.createElement(Icon, { name: "clock", size: 15 }),
                        " ",
                        w.minutes,
                        " min"),
                    React.createElement("span", null,
                        React.createElement(Icon, { name: "list", size: 15 }),
                        " ",
                        w.questions,
                        " Q")),
                React.createElement("div", { className: "exam-bottom" },
                    React.createElement("span", null, w.score < 0 ? 'No attempt yet' : 'Best · ' + w.score + '%'),
                    React.createElement("button", { onClick: () => this.startQuiz(w.id) },
                        "Start ",
                        React.createElement(Icon, { name: "arrow", size: 15 })))))),
            React.createElement(BoxTitle, { eyebrow: "AFTER EVERY DAY", title: "Daily knowledge checks", subtitle: "Four questions per lesson. A score of 75% or above completes the quiz requirement." }),
            React.createElement("div", { className: "daily-quiz-grid" }, this.state.lessons.map(l => { const stat = s.dayStats[l.day - 1]; return React.createElement("button", { key: l.day, className: "daily-quiz", onClick: () => this.startQuiz('day' + l.day) },
                React.createElement("div", { className: "daily-quiz-n" },
                    React.createElement("span", null, "DAY"),
                    pad(l.day)),
                React.createElement("div", { className: "daily-quiz-copy" },
                    React.createElement("strong", null, l.title),
                    React.createElement("small", null, stat.bestScore < 0 ? 'Not taken' : `Best score · ${stat.bestScore}%`)),
                React.createElement("div", { className: 'daily-quiz-status ' + (stat.bestScore >= 75 ? 'passed' : '') },
                    React.createElement(Icon, { name: stat.bestScore >= 75 ? 'check' : 'chevron', size: 17 }))); })));
    }
    renderProgress() {
        const s = this.state.summary;
        const req = s.readiness.requirements;
        const conditions = [['18 of 21 mastered days', req.days, `${s.completedDays} completed`], ['All 3 weekly mocks ≥75%', req.weekly, `${s.weekly.filter(x => x.score >= 75).length} passed`], ['Final assessment ≥85%', req.final, s.finalScore >= 0 ? s.finalScore + '% scored' : 'Not attempted'], ['Every assessed domain ≥60%', req.domains, s.finalScore < 0 ? 'Not assessed' : s.weakDomains.length ? s.weakDomains.length + ' domain(s) below target' : 'All above target']];
        const domains = Object.entries(s.finalBreakdown);
        return React.createElement("div", { className: "page-content" },
            React.createElement(BoxTitle, { eyebrow: "LEARNING ANALYTICS", title: "Progress that means something", subtitle: "Your progress is stored by this Node.js server on this device. The verdict combines lessons, weekly exams and final performance." }),
            React.createElement("div", { className: "progress-top" },
                React.createElement("div", { className: "report-card readiness-card" },
                    React.createElement("div", { className: "eyebrow" }, "PRACTICE READINESS"),
                    React.createElement("div", { className: 'readiness-status ' + (s.readiness.status === 'Practice-ready' ? 'ready' : '') },
                        s.readiness.status === 'Practice-ready' ? React.createElement(Icon, { name: "check", size: 23 }) : React.createElement(Icon, { name: "target", size: 23 }),
                        React.createElement("h2", null, s.readiness.status)),
                    React.createElement("p", null, s.readiness.why),
                    React.createElement("div", { className: "readiness-conditions" }, conditions.map((r, i) => React.createElement("div", { key: i },
                        React.createElement("span", { className: 'requirement-check ' + (r[1] ? 'yes' : '') },
                            React.createElement(Icon, { name: r[1] ? 'check' : 'circle', size: 15 })),
                        React.createElement("span", null, r[0]),
                        React.createElement("small", null, r[2]))))),
                React.createElement("div", { className: "report-card report-ring" },
                    React.createElement("div", { className: "eyebrow" }, "CURRICULUM COMPLETION"),
                    React.createElement(Ring, { percent: s.completedDays / 21 * 100, size: 168, label: "mastered" }),
                    React.createElement("div", { className: "days-count" },
                        s.completedDays,
                        " ",
                        React.createElement("span", null, "of 21 days complete")),
                    React.createElement("p", null, "Check off notes and labs, then score 75%+ on the daily quiz to master each day."))),
            React.createElement("div", { className: "report-card" },
                React.createElement(BoxTitle, { eyebrow: "ASSESSMENT HISTORY", title: "Exam performance" }),
                React.createElement("div", { className: "score-grid" }, [...s.weekly.map(w => ({ label: 'Week ' + w.week + ' mock', score: w.score })), { label: 'Final assessment', score: s.finalScore }].map((v, i) => React.createElement("div", { key: i, className: "score-block" },
                    React.createElement("div", { className: "score-block-top" },
                        React.createElement("strong", null, v.label),
                        React.createElement("span", null, v.score < 0 ? 'Not attempted' : `${v.score}%`)),
                    React.createElement("div", { className: "track" },
                        React.createElement("span", { style: { width: `${Math.max(0, v.score)}%` } })))))),
            React.createElement("div", { className: "report-card" },
                React.createElement(BoxTitle, { eyebrow: "THE FINAL EXAM BREAKDOWN", title: "Domain strengths and gaps", subtitle: "Shown after your first final attempt. Each domain has a different number of questions, so small samples can be noisy." }),
                domains.length ? React.createElement("div", { className: "domain-breakdown" }, domains.map(([name, data]) => React.createElement("div", { key: name },
                    React.createElement("div", { className: "domain-name" },
                        React.createElement("span", null, name),
                        React.createElement("strong", null,
                            data.percent,
                            "% ",
                            React.createElement("small", null,
                                "(",
                                data.correct,
                                "/",
                                data.total,
                                ")"))),
                    React.createElement("div", { className: "track" },
                        React.createElement("span", { className: data.percent < 60 ? 'warn' : '', style: { width: `${data.percent}%` } }))))) : React.createElement("div", { className: "empty-state compact" }, "Your domain breakdown will appear here when you finish the final assessment.")),
            React.createElement("div", { className: "report-card" },
                React.createElement(BoxTitle, { eyebrow: "MASTERY MAP", title: "Your 21-day timeline" }),
                React.createElement("div", { className: "mastery-map" }, s.dayStats.map(d => React.createElement("button", { onClick: () => this.goDay(d.day), className: 'mastery-cell ' + (d.completed ? 'mastered' : d.bestScore >= 0 ? 'attempted' : ''), key: d.day, title: `Day ${d.day}: ${d.completed ? 'Mastered' : d.bestScore >= 0 ? 'Quiz score ' + d.bestScore + '%' : 'Not completed'}` }, pad(d.day)))),
                React.createElement("div", { className: "map-legend" },
                    React.createElement("span", null,
                        React.createElement("i", { className: "legend-done" }),
                        " Mastered"),
                    React.createElement("span", null,
                        React.createElement("i", { className: "legend-attempt" }),
                        " In progress"),
                    React.createElement("span", null,
                        React.createElement("i", { className: "legend-not" }),
                        " Not started"))),
            React.createElement("div", { className: "danger-zone" },
                React.createElement("div", null,
                    React.createElement("strong", null, "Local study profile"),
                    React.createElement("p", null, "A browser-local backup keeps your progress on this device, even if free hosting resets its server. Clearing browser storage or changing devices can lose it. No login or cloud sync.")),
                React.createElement("button", { onClick: this.reset },
                    React.createElement(Icon, { name: "refresh", size: 15 }),
                    " Reset progress")));
    }
    renderPlayground() { const s = this.state; let payload = { model: 'mock-claude-local', max_tokens: Number(s.simMax), system: s.simSystem, messages: [{ role: 'user', content: s.simPrompt }] }; return React.createElement("div", { className: "page-content" },
        React.createElement(BoxTitle, { eyebrow: "LIVE LOCAL SIMULATOR", title: "Explore the Messages API, for free", subtitle: "Change a request, run the deterministic mock, and inspect Claude-shaped JSON. Nothing is sent to Anthropic." }),
        React.createElement("div", { className: "sim-banner" },
            React.createElement(Icon, { name: "shield", size: 21 }),
            React.createElement("div", null,
                React.createElement("strong", null, "Simulation mode is ON"),
                React.createElement("p", null, "This is a local teaching tool, not an actual model response. Token counts are deliberately null rather than invented.")),
            React.createElement(Chip, { tone: "teal" }, "NO API KEY")),
        React.createElement("div", { className: "playground-grid" },
            React.createElement("div", { className: "play-editor" },
                React.createElement("div", { className: "editor-top" },
                    React.createElement("span", { className: "editor-dots" },
                        React.createElement("i", null),
                        React.createElement("i", null),
                        React.createElement("i", null)),
                    React.createElement("strong", null, "Configure request"),
                    React.createElement("small", null, "messages.create()")),
                React.createElement("div", { className: "editor-body" },
                    React.createElement("label", null, "System instruction"),
                    React.createElement("textarea", { rows: "3", value: s.simSystem, onChange: e => this.setState({ simSystem: e.target.value }) }),
                    React.createElement("label", null, "User message"),
                    React.createElement("textarea", { rows: "5", value: s.simPrompt, onChange: e => this.setState({ simPrompt: e.target.value }) }),
                    React.createElement("label", null,
                        "Maximum output tokens ",
                        React.createElement("span", null, s.simMax)),
                    React.createElement("input", { type: "range", min: "32", max: "1024", step: "32", value: s.simMax, onChange: e => this.setState({ simMax: e.target.value }) }),
                    React.createElement("div", { className: "preset-row" },
                        React.createElement("button", { onClick: () => this.setState({ simPrompt: 'Explain what an API is in one sentence.' }) }, "Basic answer"),
                        React.createElement("button", { onClick: () => this.setState({ simPrompt: 'Look up ticket T-42 and show its status.' }) }, "Tool use"),
                        React.createElement("button", { onClick: () => this.setState({ simPrompt: 'What is MCP and why is it useful?' }) }, "MCP example")),
                    React.createElement("button", { className: "btn btn-coral btn-full", onClick: this.runSim, disabled: s.simLoading },
                        s.simLoading ? 'Running...' : 'Run local simulation',
                        " ",
                        React.createElement(Icon, { name: "play", size: 15 })))),
            React.createElement("div", { className: "play-results" },
                React.createElement("div", { className: "results-head" },
                    React.createElement("span", null,
                        React.createElement(Icon, { name: "terminal", size: 17 }),
                        " Result inspector"),
                    React.createElement(Chip, { tone: "neutral" }, "LOCAL ONLY")),
                React.createElement("div", { className: "result-caption" }, "REQUEST JSON"),
                React.createElement("pre", null, JSON.stringify(payload, null, 2)),
                React.createElement("div", { className: "result-caption result-next" }, "SIMULATED RESPONSE"),
                s.simOutput ? React.createElement("pre", { className: "result-output" }, JSON.stringify(s.simOutput, null, 2)) : React.createElement("div", { className: "no-response" },
                    React.createElement(Icon, { name: "terminal", size: 28 }),
                    React.createElement("strong", null, "No response yet"),
                    React.createElement("p", null, "Choose a preset or write a message, then run the simulator to inspect the response.")))),
        React.createElement("div", { className: "play-explain" },
            React.createElement("div", null,
                React.createElement(Icon, { name: "info" }),
                React.createElement("strong", null, "What can this demo prove?")),
            React.createElement("p", null, "You can practise request construction, content parsing, stop reasons, tool-result handling and frontend-state logic. It cannot verify live model quality, real pricing or Anthropic token accounting."))); }
    renderQuiz() {
        const { quiz, quizResult, answers, currentQ, remaining, quizSubmitting } = this.state;
        if (!quiz)
            return React.createElement("div", { className: "page-content" },
                React.createElement("div", { className: "empty-state" },
                    "No assessment selected. ",
                    React.createElement("button", { className: "btn btn-dark", onClick: () => this.nav('assessments') }, "Browse assessments")));
        if (quizResult) {
            const pct = quizResult.score;
            return React.createElement("div", { className: "page-content" },
                React.createElement("button", { className: "back-link", onClick: () => this.nav('assessments') },
                    React.createElement(Icon, { name: "left", size: 16 }),
                    " Back to assessments"),
                React.createElement("div", { className: "result-hero" },
                    React.createElement("div", { className: "result-icon" },
                        React.createElement(Icon, { name: pct >= 85 ? 'trophy' : 'target', size: 31 })),
                    React.createElement("div", null,
                        React.createElement("div", { className: "eyebrow" }, "ASSESSMENT COMPLETE"),
                        React.createElement("h1", null, pct >= 85 ? 'Excellent work.' : 'A useful learning checkpoint.'),
                        React.createElement("p", null, "Your answers have been graded and this attempt is saved. Review the explanations below.")),
                    React.createElement(Ring, { percent: pct, size: 133, label: "score" })),
                React.createElement("div", { className: "result-stats" },
                    React.createElement("div", null,
                        React.createElement("strong", null,
                            quizResult.correct,
                            "/",
                            quizResult.total),
                        React.createElement("small", null, "Correct answers")),
                    React.createElement("div", null,
                        React.createElement("strong", null,
                            Math.floor(quizResult.elapsedSeconds / 60),
                            "m ",
                            quizResult.elapsedSeconds % 60,
                            "s"),
                        React.createElement("small", null, "Time spent")),
                    React.createElement("div", null,
                        React.createElement("strong", null,
                            quizResult.kind === 'daily' ? 75 : quizResult.kind === 'weekly' ? 75 : 85,
                            "%"),
                        React.createElement("small", null, "Practice target"))),
                React.createElement("div", { className: "result-review" },
                    React.createElement(BoxTitle, { eyebrow: "LEARN FROM EVERY ANSWER", title: "Detailed answer review" }),
                    quizResult.details.map((item, i) => React.createElement("div", { key: item.id, className: 'review-item ' + (item.correct ? 'review-right' : 'review-wrong') },
                        React.createElement("div", { className: "review-question" },
                            React.createElement("span", null, pad(i + 1)),
                            React.createElement("div", null,
                                React.createElement("h3", null, item.prompt),
                                React.createElement("small", null, item.domain)),
                            React.createElement(Chip, { tone: item.correct ? 'teal' : 'peach' }, item.correct ? 'Correct' : 'Review')),
                        React.createElement("p", { className: "review-choice" },
                            "Your answer: ",
                            item.selectedIndex == null ? 'Not answered' : item.options[item.selectedIndex]),
                        !item.correct && React.createElement("p", { className: "review-choice correct-choice" },
                            "Correct answer: ",
                            item.options[item.correctIndex]),
                        React.createElement("p", { className: "review-explain" }, item.explanation)))),
                React.createElement("div", { className: "result-buttons" },
                    React.createElement("button", { className: "btn btn-dark", onClick: () => this.startQuiz(quiz.id) },
                        "Retry assessment ",
                        React.createElement(Icon, { name: "refresh", size: 16 })),
                    React.createElement("button", { className: "btn btn-outline", onClick: () => this.nav('progress') },
                        "View readiness ",
                        React.createElement(Icon, { name: "chart", size: 16 }))));
        }
        const question = quiz.questions[currentQ];
        const selected = answers[question.id];
        const answered = Object.keys(answers).length;
        const mins = Math.floor(remaining / 60), secs = remaining % 60;
        return React.createElement("div", { className: "page-content quiz-page" },
            React.createElement("button", { className: "back-link", onClick: () => this.nav('assessments') },
                React.createElement(Icon, { name: "left", size: 16 }),
                " Leave assessment (unsaved answers will be lost)"),
            React.createElement("div", { className: "quiz-head" },
                React.createElement("div", null,
                    React.createElement("div", { className: "eyebrow" }, "TIMED PRACTICE ASSESSMENT"),
                    React.createElement("h1", null, quiz.title),
                    React.createElement("p", null,
                        quiz.questions.length,
                        " questions \u00B7 Answers are locked after submission.")),
                React.createElement("div", { className: 'quiz-timer ' + (remaining < 120 ? 'urgent' : '') },
                    React.createElement(Icon, { name: "clock", size: 19 }),
                    pad(mins),
                    ":",
                    pad(secs))),
            React.createElement("div", { className: "quiz-progress-top" },
                React.createElement("span", null,
                    "Question ",
                    currentQ + 1,
                    " of ",
                    quiz.questions.length),
                React.createElement("span", null,
                    answered,
                    "/",
                    quiz.questions.length,
                    " answered")),
            React.createElement("div", { className: "track quiz-track" },
                React.createElement("span", { style: { width: `${answered / quiz.questions.length * 100}%` } })),
            React.createElement("div", { className: "quiz-layout" },
                React.createElement("div", { className: "question-card" },
                    React.createElement("div", { className: "question-category" },
                        React.createElement(Icon, { name: "layers", size: 15 }),
                        question.domain),
                    React.createElement("h2", null, question.prompt),
                    React.createElement("div", { className: "options-list" }, question.options.map((opt, i) => React.createElement("button", { key: i, className: 'option-row ' + (selected === i ? 'selected' : ''), onClick: () => this.answer(question.id, i) },
                        React.createElement("span", { className: "option-letter" }, 'ABCD'[i]),
                        React.createElement("span", null, opt),
                        React.createElement("span", { className: "option-radio" }, selected === i ? React.createElement(Icon, { name: "check", size: 13 }) : null)))),
                    React.createElement("div", { className: "question-navigation" },
                        React.createElement("button", { className: "btn btn-outline", disabled: currentQ === 0, onClick: () => this.setState({ currentQ: currentQ - 1 }) },
                            React.createElement(Icon, { name: "left", size: 16 }),
                            " Previous"),
                        currentQ < quiz.questions.length - 1 ? React.createElement("button", { className: "btn btn-dark", onClick: () => this.setState({ currentQ: currentQ + 1 }) },
                            "Next question ",
                            React.createElement(Icon, { name: "arrow", size: 16 })) : React.createElement("button", { className: "btn btn-coral", disabled: quizSubmitting, onClick: () => this.submitQuiz(false) },
                            quizSubmitting ? 'Submitting...' : 'Submit exam',
                            " ",
                            React.createElement(Icon, { name: "check", size: 16 })))),
                React.createElement("div", { className: "question-sidebar" },
                    React.createElement("div", { className: "eyebrow" }, "QUESTION NAVIGATOR"),
                    React.createElement("p", null, "Jump to any question. Orange means answered."),
                    React.createElement("div", { className: "question-dots" }, quiz.questions.map((q, i) => React.createElement("button", { key: q.id, className: (currentQ === i ? 'current ' : '') + (answers[q.id] !== undefined ? 'answered' : ''), onClick: () => this.setState({ currentQ: i }) }, i + 1))),
                    React.createElement("div", { className: "question-key" },
                        React.createElement("span", null,
                            React.createElement("i", { className: "current" }),
                            " Current"),
                        React.createElement("span", null,
                            React.createElement("i", { className: "answered" }),
                            " Answered")),
                    React.createElement("button", { className: "btn btn-outline btn-full", disabled: quizSubmitting, onClick: () => this.submitQuiz(false) },
                        "Submit ",
                        answered,
                        "/",
                        quiz.questions.length,
                        " answers"),
                    React.createElement("div", { className: "quiz-caution" },
                        React.createElement(Icon, { name: "info", size: 16 }),
                        " Unanswered questions count as incorrect. This is an open practice test, not proctored."))));
    }
    render() { const { loading, notice, page } = this.state; return React.createElement("div", { className: "app-shell" },
        this.renderSidebar(),
        React.createElement("main", { className: "main-area" },
            this.renderHeader(),
            loading ? React.createElement("div", { className: "loading-page" },
                React.createElement("div", { className: "loader" }),
                "Loading your academy...") : this.state.summary && this.state.lessons.length ? (page === 'dashboard' ? this.renderDashboard() : page === 'path' ? this.renderPath() : page === 'lesson' ? this.renderLesson() : page === 'notes' ? this.renderNotes() : page === 'assessments' ? this.renderAssessments() : page === 'progress' ? this.renderProgress() : page === 'playground' ? this.renderPlayground() : page === 'quiz' ? this.renderQuiz() : this.renderDashboard()) : React.createElement("div", { className: "loading-page" }, "Unable to load the curriculum. Check that the Node.js server is running.")),
        notice && React.createElement("div", { className: "toast" },
            React.createElement(Icon, { name: "info", size: 17 }),
            notice)); }
}
ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
