// A small registry of harmless, faux commands.
// Nothing here touches the network, the disk, or reality. It's all theatre.

const ASCII = String.raw`
   ___  ___  _ __ ___    ___  | |__
  / __|/ _ \| '_ ` + '`' + ` _ \  / __| | '_ \
 | (__|  __/| | | | | |_\__ \_| | | |
  \___|\___||_| |_| |_(_)___(_)_| |_|
`;

const HELP = [
	{ cmd: 'help', desc: 'show this message' },
	{ cmd: 'about', desc: 'what is this thing?' },
	{ cmd: 'cv', desc: 'who built this — Duman Haydar' },
	{ cmd: 'haydar', desc: 'alias for cv' },
	{ cmd: 'whoami', desc: 'you, probably' },
	{ cmd: 'echo <text>', desc: 'say it back' },
	{ cmd: 'date', desc: 'the current moment' },
	{ cmd: 'ls', desc: 'list nothing of importance' },
	{ cmd: 'cat <file>', desc: 'read a file that may not exist' },
	{ cmd: 'sudo <cmd>', desc: 'try your luck' },
	{ cmd: 'cowsay <text>', desc: 'a cow says it' },
	{ cmd: 'history [clear]', desc: 'past commands · clear to wipe' },
	{ cmd: 'matrix', desc: 'toggle the rain' },
	{ cmd: 'theme', desc: 'cycle accent color' },
	{ cmd: 'clear', desc: 'wipe the screen' },
	{ cmd: 'exit', desc: "you can't, but try" }
];

// Bare command names — used by the UI for fish-style syntax highlighting
// and autosuggestions.
export const COMMANDS = [
	'help',
	'about',
	'cv',
	'haydar',
	'whoami',
	'echo',
	'date',
	'ls',
	'cat',
	'sudo',
	'cowsay',
	'history',
	'matrix',
	'theme',
	'clear',
	'exit',
	'rm'
];

const FILES = {
	'readme.txt':
		'This terminal does nothing in particular.\nThat is the entire point. Enjoy the ambience.',
	'.secret': 'There is no secret. You looked anyway. Respect.',
	'todo.md': '- [ ] add a feature\n- [ ] remove the feature\n- [x] vibe'
};

function table(rows) {
	const w = Math.max(...rows.map((r) => r.cmd.length));
	return rows.map((r) => `  ${r.cmd.padEnd(w)}   ${r.desc}`).join('\n');
}

function cowsay(text) {
	const t = text || 'moo';
	const top = ' ' + '_'.repeat(t.length + 2);
	const bot = ' ' + '-'.repeat(t.length + 2);
	return [
		top,
		`< ${t} >`,
		bot,
		'        \\   ^__^',
		'         \\  (oo)\\_______',
		'            (__)\\       )\\/\\',
		'                ||----w |',
		'                ||     ||'
	].join('\n');
}

// Real info about the person who built this — sourced from https://duman.io
function buildCV() {
	return [
		{ text: 'DUMAN HAYDAR', cls: 'text-term-cyan' },
		{ text: 'Développeur dévoué et passionné — backend · frontend · mobile · IoT', cls: 'text-term-dim' },
		{ text: '' },
		{ kv: ['role', 'Developer @ Aroneus (SRL Aroneus)'] },
		{ kv: ['location', 'Liège, Belgium'] },
		{ kv: ['started', 'coding at age 10 · insatiably curious ever since'] },
		{ text: '' },
		{ text: 'languages', cls: 'text-term-yellow' },
		{ text: '  JavaScript/TypeScript · Go · PHP · Python · Dart · Swift · CSS/SCSS' },
		{ text: 'frameworks', cls: 'text-term-yellow' },
		{ text: '  Svelte(Kit) · React / React Native · Express · Fiber · Symfony · Laravel' },
		{ text: '  TailwindCSS · Flutter' },
		{ text: 'data', cls: 'text-term-yellow' },
		{ text: '  PostgreSQL · MySQL/MariaDB · MongoDB · Firestore · ElasticSearch' },
		{ text: 'architecture & cloud', cls: 'text-term-yellow' },
		{ text: '  CQRS · Event Sourcing · Microservices · GCP · LLM' },
		{ text: '' },
		{ text: 'selected clients', cls: 'text-term-yellow' },
		{ text: '  Edenred · Careways · FR-Team International · Brakestore' },
		{ text: '  Charleroi Duty Free · La Cité des Nuages' },
		{ text: '' },
		{ kv: ['email', 'haydar@duman.io'] },
		{ kv: ['web', 'https://duman.io'] },
		{ kv: ['github', 'https://github.com/dumanhaydar'] },
		{ kv: ['company', 'https://aroneus.com'] },
		{ kv: ['phone', '+32 (0) 471 24 88 22'] },
		{ text: '' },
		{ text: "ps — this very terminal is built with his stack: SvelteKit + Tailwind on Cloudflare.", cls: 'text-term-dim' }
	].map((l) => {
		if (l.kv) {
			const [label, value] = l.kv;
			return { text: `  ${label.padEnd(9)} ${value}` };
		}
		return l;
	});
}

// --- hidden easter egg: the Kurdistan flag (Alaya Rengîn) -------------------
const KURD_RED = '#ED2939';
const KURD_GRN = '#239F40';
const KURD_WHT = '#f4f4f5';
const KURD_SUN = '#FEDF00';

function buildKurdistan() {
	const W = 27;
	const block = '█'.repeat(W);
	const side = '█'.repeat(10); // 10 + 7 + 10 = 27
	const bar = (color) => ({ segs: [{ text: block, style: `color:${color}` }] });
	const sunRow = (mid) => ({
		segs: [
			{ text: side, style: `color:${KURD_WHT}` },
			{ text: mid, style: `color:${KURD_SUN}` },
			{ text: side, style: `color:${KURD_WHT}` }
		]
	});
	return [
		bar(KURD_RED),
		bar(KURD_RED),
		bar(KURD_WHT),
		sunRow('  \\|/  '),
		sunRow(' ──☀── '),
		sunRow('  /|\\  '),
		bar(KURD_WHT),
		bar(KURD_GRN),
		bar(KURD_GRN),
		{ text: '' },
		{
			segs: [
				{ text: 'Her bijî Kurdistan! ', style: `color:${KURD_GRN}` },
				{ text: '☀', style: `color:${KURD_SUN}` }
			]
		},
		{ text: 'Roja Kurdistanê — 21 rays: Newroz, light, rebirth.', cls: 'text-term-dim' },
		{ text: '' }
	];
}

// Each handler returns { lines, effect? }.
// `effect` is an optional signal to the UI (clear / matrix / theme / exit).
export function runCommand(raw, ctx) {
	const input = raw.trim();
	if (!input) return { lines: [] };

	const [name, ...rest] = input.split(/\s+/);
	const arg = rest.join(' ');
	const cmd = name.toLowerCase();

	switch (cmd) {
		case 'help':
			return {
				lines: [
					{ text: 'available incantations:', cls: 'text-term-dim' },
					{ text: table(HELP) }
				]
			};

		case 'about':
			return {
				lines: [
					{ text: ASCII, cls: 'text-term-cyan' },
					{ text: 'cem.sh — a terminal in your browser that does nothing in particular.' },
					{ text: 'No backend. No tracking. No purpose. A showcase, a vibe, an experiment.' },
					{
						text: 'Built with SvelteKit (CSR) + TailwindCSS · fish-flavored · Victor Mono.',
						cls: 'text-term-dim'
					}
				]
			};

		case 'cv':
		case 'haydar':
			return { lines: buildCV() };

		case 'whoami':
			return { lines: [{ text: 'guest@cem.sh — an honored visitor of no particular rank.' }] };

		case 'echo':
			return { lines: [{ text: arg || '' }] };

		case 'date':
			return { lines: [{ text: new Date().toString() }] };

		case 'ls':
			return {
				lines: [
					{
						text: Object.keys(FILES).join('   '),
						cls: 'text-term-blue'
					}
				]
			};

		case 'cat': {
			if (!arg) return { lines: [{ text: 'cat: missing operand', cls: 'text-term-red' }] };
			const f = FILES[arg.toLowerCase()];
			if (f === undefined)
				return { lines: [{ text: `cat: ${arg}: No such file or directory`, cls: 'text-term-red' }] };
			return { lines: [{ text: f }] };
		}

		case 'sudo':
			return {
				lines: [
					{ text: `${ctx.user} is not in the sudoers file.`, cls: 'text-term-yellow' },
					{ text: 'This incident will absolutely not be reported.', cls: 'text-term-dim' }
				]
			};

		case 'cowsay':
			return { lines: [{ text: cowsay(arg), cls: 'text-term-green' }] };

		// hidden — not in help, not autosuggested. Bijî Kurdistan. ☀
		case 'kurdistan':
		case 'kurd':
		case 'kurde':
		case 'newroz':
		case 'nawroz':
		case 'rojava':
		case 'herbiji':
		case 'her':
		case 'biji':
		case 'bijî':
			return { lines: buildKurdistan() };

		case 'history': {
			const sub = arg.trim().toLowerCase();
			if (sub === 'clear' || sub === '-c')
				return { lines: [{ text: 'history cleared.', cls: 'text-term-dim' }], effect: 'history-clear' };
			const items = ctx.history ?? [];
			if (!items.length) return { lines: [{ text: 'no history yet.', cls: 'text-term-dim' }] };
			return { lines: items.map((c, i) => ({ text: `  ${String(i + 1).padStart(3)}  ${c}` })) };
		}

		case 'matrix':
			return { lines: [{ text: 'wake up...', cls: 'text-term-green' }], effect: 'matrix' };

		case 'theme':
			return { lines: [{ text: 'cycling accent…', cls: 'text-term-dim' }], effect: 'theme' };

		case 'clear':
			return { lines: [], effect: 'clear' };

		case 'exit':
			return {
				lines: [{ text: "there is no exit. you live here now. (try 'help')", cls: 'text-term-magenta' }],
				effect: 'exit'
			};

		case 'rm':
			if (arg.includes('-rf') || arg.includes('/'))
				return {
					lines: [
						{ text: 'nice try.', cls: 'text-term-red' },
						{ text: 'nothing here is real enough to delete.', cls: 'text-term-dim' }
					]
				};
			return { lines: [{ text: `rm: cannot remove '${arg}': it does not matter`, cls: 'text-term-dim' }] };

		default:
			return {
				lines: [
					{ text: `${cmd}: command not found`, cls: 'text-term-red' },
					{ text: "type 'help' for the list of things that also do nothing.", cls: 'text-term-dim' }
				]
			};
	}
}

export const BOOT_LINES = [
	{ text: 'cem.sh bootloader v0.0.1', cls: 'text-term-dim' },
	{ text: 'initializing nothing in particular ........ ok', cls: 'text-term-green' },
	{ text: 'mounting /dev/void ....................... ok', cls: 'text-term-green' },
	{ text: 'loading vibes ............................ ok', cls: 'text-term-green' },
	{ text: 'starting session for guest@cem.sh ........ ok', cls: 'text-term-green' },
	{ text: '' },
	{ text: "type 'help' to see what you can't accomplish here.", cls: 'text-term-cyan' },
	{ text: '' }
];
