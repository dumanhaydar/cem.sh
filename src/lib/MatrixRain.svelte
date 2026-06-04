<script>
	import { onMount } from 'svelte';

	let canvas;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		let raf;
		let cols = [];
		const chars = 'アカサタナハマヤラワabcdef0123456789{}[]<>/$#@%'.split('');
		const fontSize = 16;

		function resize() {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
			const n = Math.ceil(canvas.width / fontSize);
			cols = Array.from({ length: n }, () => Math.floor((Math.random() * canvas.height) / fontSize));
		}
		resize();
		window.addEventListener('resize', resize);

		function draw() {
			ctx.fillStyle = 'rgba(10, 14, 20, 0.08)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = '#7fd962';
			ctx.font = `${fontSize}px monospace`;
			for (let i = 0; i < cols.length; i++) {
				const ch = chars[Math.floor(Math.random() * chars.length)];
				ctx.fillText(ch, i * fontSize, cols[i] * fontSize);
				if (cols[i] * fontSize > canvas.height && Math.random() > 0.975) cols[i] = 0;
				cols[i]++;
			}
			raf = requestAnimationFrame(draw);
		}
		draw();

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', resize);
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="pointer-events-none absolute inset-0 h-full w-full opacity-25"
></canvas>
