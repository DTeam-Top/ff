<script lang="ts">
	import { GITHUB_URL } from '$lib/client/clientConsts';
	import BrowseIcon from './ui/icons/BrowseIcon.svelte';
	import GithubIcon from './ui/icons/GithubIcon.svelte';
</script>

<div class="flex">
	<a
		class="flex gap-2 mr-4 border border-[#495A8C] rounded items-center h-[48px] px-[15px] hover:variant-soft-primary"
		href="/browse"
	>
		<svelte:component this={BrowseIcon} />
		Browse</a
	>
	<a
		class="flex gap-2 border border-[#495A8C] rounded items-center h-[48px] px-[15px] hover:variant-soft-primary"
		href={GITHUB_URL}
		target="_blank"
		rel="noreferrer"
	>
		<svelte:component this={GithubIcon} /> Github</a
	>
</div>
