<script lang="ts">
	export let title = '';
	export let cssClass = 'border bg-gray-100 text-black  mx-8';
	export let width = 'w-[85px]';
	export let icon: any = null;
</script>

<button class={`rounded  px-4 py-2 ${width} ${cssClass}`} on:click>
	{#if icon}
		<svelte:component this={icon} />
	{/if}
	{title}</button
>
