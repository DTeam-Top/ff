<script lang="ts">
	import 'tailwindcss/tailwind.css';
	import { browser } from '$app/environment';
	import '../style.css';
	import { includeHostname, USER_STORE_KEY } from '$lib/client/clientConsts';
	import SiteName from '$lib/components/ui/SiteName.svelte';
	import {
		AppShell,
		Drawer,
		initializeStores,
		AppBar,
		getDrawerStore,
		type DrawerSettings,
		Modal,
		Toast,
		storePopup
	} from '@skeletonlabs/skeleton';
	import SidebarItems from '$lib/components/ui/sidebar/SidebarItems.svelte';
	import Spin from '$lib/components/Spin.svelte';
	import TopBar from '$lib/components/ui/TopBar.svelte';
	import { getItem, signed } from '$lib/client/store';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { getCaster } from '$lib/client/commonService';
	import { setHeaders } from '$lib/client/secretService';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	import LogRocket from 'logrocket';
	LogRocket.init('yanavk/ff-7nxhj');
	$: if (browser && window !== undefined && includeHostname.includes(window.location.hostname)) {
		console.log(window.location.hostname);
		LogRocket.identify('ff', {
			name: 'Farcaster',
			email: 'ff@ff.com',

			// Add your own custom user variables here, ie:
			subscriptionType: 'pro'
		});
	}

	let loading = true;

	initializeStores();
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
	const drawerStore = getDrawerStore();

	$: if (browser) {
		const item = getItem(USER_STORE_KEY, window);
		if (item) {
			setHeaders(item);
			getCaster(item)
				.then((data) => {
					loading = false;
				})
				.catch((e: any) => {
					console.log(e);
					loading = false;
				});
		} else {
			loading = false;
		}
	}

	const drawerSettings: DrawerSettings = {
		width: 'w-[180px]'
	};
	function drawerOpen(): void {
		drawerStore.open(drawerSettings);
	}
	$: classesSidebarLeft = $signed ? 'w-0 lg:w-[130px]' : 'w-0';

	$: allyPageSmoothScroll = 'scroll-smooth';
</script>

{#if loading}
	<Spin />
{:else}
	<Drawer>
		<div class="container flex left-0 relative items-center p-4">
			<img src="/images/logo.png" width="40" height="40" alt="FF" class="mx-auto" />
		</div>

		<hr />
		<SidebarItems />
	</Drawer>
	<Modal />
	<Toast />
	<AppShell
		slotSidebarLeft="bg-surface-500/5 {classesSidebarLeft}"
		scrollbarGutter="auto"
		{allyPageSmoothScroll}
	>
		<svelte:fragment slot="header">
			<AppBar shadow="shadow-2xl" background="">
				<svelte:fragment slot="lead">
					<div class="flex items-center">
						<button class="lg:hidden btn btn-sm mr-4" on:click={drawerOpen}>
							<span>
								<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
									<rect width="100" height="20" />
									<rect y="30" width="100" height="20" />
									<rect y="60" width="100" height="20" />
								</svg>
							</span>
						</button>
						<SiteName />
					</div>
				</svelte:fragment>
				<svelte:fragment slot="trail">
					<TopBar />
				</svelte:fragment>
			</AppBar>
		</svelte:fragment>
		<svelte:fragment slot="sidebarLeft">
			<SidebarItems />
		</svelte:fragment>

		<QueryClientProvider client={queryClient}>
			<slot />
		</QueryClientProvider>
	</AppShell>
{/if}
