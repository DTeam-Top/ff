<script>
	import 'tailwindcss/tailwind.css';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { signed } from '$lib/services/utils';

	import TopBar from './TopBar.svelte';
	import Overlay from './Overlay.svelte';
	import Sidebar from './sidebar/Sidebar.svelte';
	import { closeSidebar, sidebarOpen } from '$lib/services/store';

	const style = {
		container: `bg-gray-900 h-screen overflow-hidden relative`
	};

	if (browser) {
		page.subscribe(() => {
			// close Sidebar on route changes.
			if ($sidebarOpen) {
				closeSidebar();
			}
		});
	}
</script>

<div class={style.container}>
	<div class="flex items-start">
		{#if $signed}
			<Overlay />
			<Sidebar mobileOrientation="end" />
		{/if}

		<div class={`flex flex-col h-screen pl-0 w-full ${$signed ? 'lg:pl-20' : ''} lg:space-y-4`}>
			<TopBar />
			<main
				class={`h-screen overflow-auto pb-36 pt-4 md:pb-8 md:pt-4 lg:pt-0 ${$signed ? 'lg:px-4 px-2' : ''}`}
			>
				<slot />
			</main>
		</div>
	</div>
</div>
