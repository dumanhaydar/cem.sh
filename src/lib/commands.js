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
	{ cmd: 'whoami', desc: 'you, probably' },
	{ cmd: 'echo <text>', desc: 'say it back' },
	{ cmd: 'date', desc: 'the current moment' },
	{ cmd: 'ls', desc: 'list nothing of importance' },
	{ cmd: 'cat <file>', desc: 'read a file that may not exist' },
	{ cmd: 'sudo <cmd>', desc: 'try your luck' },
	{ cmd: 'cowsay <text>', desc: 'a cow says it' },
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
	'whoami',
	'echo',
	'date',
	'ls',
	'cat',
	'sudo',
	'cowsay',
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
