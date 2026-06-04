<script>
	import { tick, onMount } from 'svelte';
	import { runCommand, BOOT_LINES, COMMANDS } from '$lib/commands.js';
	import MatrixRain from '$lib/MatrixRain.svelte';

	const user = 'guest';
	const host = 'cem.sh';

	// history is a list of blocks: either an echoed prompt+command, or output lines
	let history = $state([]);
	let input = $state('');
	let cmdHistory = $state([]);
	let histIndex = $state(-1);
	let matrixOn = $state(false);
	let booting = $state(true);

	const accents = ['#5ccfe6', '#7fd962', '#ffd173', '#d4bfff', '#ff6666', '#73d0ff'];
	let accentIdx = $state(0);

	let viewport;
	let inputEl;

	async function scrollToBottom() {
		await tick();
		if (viewport) viewport.scrollTop = viewport.scrollHeight;
	}

	// Boot sequence — type out the banner line by line.
	async function boot() {
		for (const line of BOOT_LINES) {
			history.push({ type: 'out', lines: [line] });
			await scrollToBottom();
			await sleep(180);
		}
		booting = false;
		await tick();
		inputEl?.focus();
	}

	function sleep(ms) {
		return new Promise((r) => setTimeout(r, ms));
	}

	function prompt() {
		return `${user}@${host}`;
	}

	// --- fish-style syntax highlighting -------------------------------------
	// Split the line into tokens (keeping whitespace) and tag each with a color.
	function highlight(value) {
		const parts = value.split(/(\s+)/);
		let firstWordSeen = false;
		return parts.map((p) => {
			if (p === '' || /^\s+$/.test(p)) return { t: p, cls: '' };
			if (!firstWordSeen) {
				firstWordSeen = true;
				const low = p.toLowerCase();
				if (COMMANDS.includes(low)) return { t: p, cls: 'text-term-green' };
				// still a valid prefix while typing → leave neutral; otherwise red
				if (COMMANDS.some((c) => c.startsWith(low))) return { t: p, cls: 'text-term-fg' };
				return { t: p, cls: 'text-term-red' };
			}
			if (p.startsWith('-')) return { t: p, cls: 'text-term-cyan' };
			if (/^(["']).*\1$/.test(p)) return { t: p, cls: 'text-term-yellow' };
			return { t: p, cls: 'text-term-fg' };
		});
	}

	// --- fish-style autosuggestion ------------------------------------------
	// Suggest the most recent matching history entry, else a command completion.
	function suggest(value) {
		if (!value) return '';
		const pool = [...[...cmdHistory].reverse(), ...COMMANDS];
		for (const c of pool) {
			if (c.startsWith(value) && c.length > value.length) return c.slice(value.length);
		}
		return '';
	}

	let highlighted = $derived(highlight(input));
	let suggestion = $derived(suggest(input));

	function acceptSuggestion() {
		if (suggestion) {
			input = input + suggestion;
			return true;
		}
		return false;
	}

	function submit() {
		const value = input;
		input = '';
		const trimmed = value.trim();

		// Echo the command itself into the scrollback.
		history.push({ type: 'cmd', prompt: prompt(), text: value });

		if (trimmed) {
			cmdHistory.push(trimmed);
			histIndex = cmdHistory.length;
		}

		const { lines, effect } = runCommand(value, { user, host });

		if (effect === 'clear') {
			history = [];
		} else if (effect === 'matrix') {
			matrixOn = !matrixOn;
			history.push({ type: 'out', lines });
		} else if (effect === 'theme') {
			accentIdx = (accentIdx + 1) % accents.length;
			history.push({ type: 'out', lines });
		} else {
			history.push({ type: 'out', lines });
		}

		scrollToBottom();
	}

	function onKeydown(e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			submit();
		} else if (e.key === 'Tab') {
			// fish: Tab accepts the autosuggestion
			e.preventDefault();
			acceptSuggestion();
		} else if (e.key === 'ArrowRight' || e.key === 'End') {
			// fish: → / End at end of line accepts the suggestion
			if (suggestion) {
				e.preventDefault();
				acceptSuggestion();
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (cmdHistory.length === 0) return;
			histIndex = Math.max(0, histIndex - 1);
			input = cmdHistory[histIndex] ?? '';
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (cmdHistory.length === 0) return;
			histIndex = Math.min(cmdHistory.length, histIndex + 1);
			input = cmdHistory[histIndex] ?? '';
		} else if (e.key === 'l' && e.ctrlKey) {
			e.preventDefault();
			history = [];
		}
	}

	onMount(() => {
		boot();
	});

	$effect(() => {
		document.documentElement.style.setProperty('--accent', accents[accentIdx]);
	});

	function focusInput() {
		inputEl?.focus();
	}
</script>

<svelte:head>
	<title>cem.sh — a terminal that does nothing</title>
</svelte:head>

<main
	class="crt flicker flex h-screen w-screen items-center justify-center bg-term-bg p-0 sm:p-6"
>
	<!-- terminal window -->
	<div
		class="relative flex h-full w-full max-w-4xl flex-col overflow-hidden border border-white/5 bg-term-bg-soft shadow-2xl shadow-black/60 sm:h-[80vh] sm:rounded-xl"
	>
		<!-- title bar -->
		<div
			class="flex shrink-0 items-center gap-2 border-b border-white/5 bg-black/30 px-4 py-2.5"
		>
			<span class="h-3 w-3 rounded-full bg-[#ff5f57]"></span>
			<span class="h-3 w-3 rounded-full bg-[#febc2e]"></span>
			<span class="h-3 w-3 rounded-full bg-[#28c840]"></span>
			<span class="ml-3 flex items-center gap-2 select-none font-mono text-xs text-term-dim">
				<span class="font-semibold tracking-tight text-term-green">&gt;_</span>
				{user}@{host}: ~ — fish — 80×24
			</span>
		</div>

		<!-- screen -->
		<button
			type="button"
			onclick={focusInput}
			class="relative flex-1 cursor-text overflow-hidden text-left"
			aria-label="focus terminal"
		>
			{#if matrixOn}
				<MatrixRain />
			{/if}

			<div
				bind:this={viewport}
				class="term-scroll absolute inset-0 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed text-term-fg sm:text-sm"
			>
				{#snippet fishPrompt()}
					<span style="color: var(--accent)">{user}@{host}</span><span class="ml-2 text-term-blue"
						>~</span
					><span class="font-semibold" style="color: var(--accent)">&gt;</span>
				{/snippet}

				{#each history as block}
					{#if block.type === 'cmd'}
						<div class="whitespace-pre-wrap break-words">
							{@render fishPrompt()}
							<span class="ml-1">{block.text}</span>
						</div>
					{:else}
						{#each block.lines as line}
							<div class="whitespace-pre-wrap break-words {line.cls ?? ''}">{line.text}</div>
						{/each}
					{/if}
				{/each}

				<!-- live input line: fish-style highlighting + ghost autosuggestion -->
				{#if !booting}
					<div class="flex flex-wrap whitespace-pre-wrap break-words">
						{@render fishPrompt()}
						<span class="relative ml-1 flex-1">
							{#each highlighted as seg}<span class={seg.cls}>{seg.t}</span>{/each}<span
								class="cursor-blink mx-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.18em] bg-term-fg align-middle"
							></span><span class="text-term-dim">{suggestion}</span>
						</span>
					</div>
				{/if}
			</div>

			<!-- the real, invisible input that captures keystrokes -->
			<input
				bind:this={inputEl}
				bind:value={input}
				onkeydown={onKeydown}
				class="absolute opacity-0"
				style="left:-9999px"
				autocomplete="off"
				autocapitalize="off"
				autocorrect="off"
				spellcheck="false"
				aria-label="terminal input"
			/>
		</button>

		<!-- status bar -->
		<div
			class="flex shrink-0 items-center justify-between border-t border-white/5 bg-black/30 px-4 py-1.5 font-mono text-[11px] text-term-dim"
		>
			<span class="flex items-center gap-1.5">
				<span class="font-semibold text-term-green">&gt;_</span> cem.sh
			</span>
			<span class="hidden sm:inline">⇥ accept · ↑/↓ history · ⌃L clear · type 'help'</span>
			<span style="color: var(--accent)">●</span>
		</div>
	</div>
</main>

<style>
	:global(:root) {
		--accent: #5ccfe6;
	}
</style>
