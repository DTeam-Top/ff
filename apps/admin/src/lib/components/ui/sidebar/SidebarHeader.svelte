<script>
	import { sidebarOpen } from '$lib/services/store';
</script>

<div class="bg-gray-900 flex items-center justify-center mb-6 mt-2 sticky top-0 z-10">
	<img src="/images/logo.svg" width="60" height="60" alt="SLN" />
	{#if $sidebarOpen}
		<div class="text-2xl ml-2">Farcaster Flow</div>
	{/if}
</div>
