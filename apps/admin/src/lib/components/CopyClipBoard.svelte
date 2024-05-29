<script>
	import { onMount } from 'svelte';

	/**
	 * @type {any}
	 */
	export let text;

	/**
	 * @type {HTMLTextAreaElement}
	 */
	let textarea;

	onMount(() => {
		textarea.select();
		document.execCommand('copy');
	});
</script>

<textarea bind:value={text} bind:this={textarea}></textarea>
