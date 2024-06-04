<script>
	import { sidebarOpen } from '$lib/client/store';
	import SiteName from '$lib/components/ui/SiteName.svelte';
</script>

<div class="bg-gray-900 flex items-center justify-center mb-6 mt-2 sticky top-0 z-10">
	<img src="/images/logo.svg" width="60" height="60" alt="SLN" />
	{#if $sidebarOpen}
		<SiteName cssClass={' ml-2'} />
	{/if}
</div>
