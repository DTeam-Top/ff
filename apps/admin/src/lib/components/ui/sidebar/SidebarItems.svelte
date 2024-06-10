<script lang="ts">
	import { data } from './data';
	import { page } from '$app/stores';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { activePipe } from '$lib/client/utils';

	const drawerStore = getDrawerStore();

	function drawerClose(): void {
		drawerStore.close();
	}

	const style = {
		title: `text-sm whitespace-pre font-bold`,
		active: `bg-primary-active-token`
	};
</script>

<nav class="bg-transparent border border-surface-500/30 h-full text-center">
	<ul class="">
		{#each data as item}
			<li
				class={`text-center py-4 border-b border-gray-700 hover:bg-primary-hover-token ${activePipe($page.url.pathname, item.link) ? style.active : ''}`}
			>
				<a class={`items-center`} href={item.link} on:click={drawerClose}>
					<div class={`mx-auto`}>
						<svelte:component this={item.icon} />
					</div>
					<span class={`${style.title}`}>
						{item.title}
					</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
