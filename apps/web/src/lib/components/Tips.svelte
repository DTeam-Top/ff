<script lang="ts">
	import { toast } from '$lib/client/popup';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import CopyClipBoard from '$lib/components/CopyClipBoard.svelte';
	export let frameUrl: string = '';
	export let text: string = 'publish';
	export let width: string = 'w-1/2';
	const toastStore = getToastStore();
	const copyHandler = () => {
		const app = new CopyClipBoard({
			target: document.getElementById('tipsclipboard'),
			props: { text: frameUrl }
		});
		app.$destroy();
		toast.success(toastStore, 'Copied!');
	};
</script>

<div
	class={`my-4 justify-center ${width} mx-auto bg-purple-200 rounded-lg p-6 items-center cursor-pointer text-black`}
	on:click={copyHandler}
>
	<span class="font-bold mr-2">Tips:</span>
	Click to copy this url
	<span class="font-bold mx-2">{frameUrl}</span>
	, and {text} it into your farcaster.
</div>

<div id="tipsclipboard"></div>
