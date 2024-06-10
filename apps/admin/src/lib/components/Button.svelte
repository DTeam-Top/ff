<script lang="ts">
	export let title = '';
	export let cssClass = 'border bg-gray-100 text-black  mx-8';
</script>

<button class={`rounded  px-4 py-2 w-[85px] ${cssClass}`} on:click>{title}</button>
