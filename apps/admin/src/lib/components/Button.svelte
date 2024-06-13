<script lang="ts">
	export let title = '';
	export let cssClass = 'border bg-gray-100 text-black  mx-8';
	export let width = 'w-[85px]';
</script>

<button class={`rounded  px-4 py-2 ${width} ${cssClass}`} on:click>{title}</button>
