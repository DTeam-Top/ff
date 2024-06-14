<script lang="ts">
	import DiscordIcon from './ui/icons/DiscordIcon.svelte';
	import GithubIcon from './ui/icons/GithubIcon.svelte';
</script>

<div>
	<a
		class="btn-icon hover:variant-soft-primary mr-4"
		href="https://github.com/DTeam-Top/ff/"
		target="_blank"
		rel="noreferrer"
	>
		<svelte:component this={GithubIcon} /></a
	>
</div>
