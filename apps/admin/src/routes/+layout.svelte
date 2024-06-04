<script>
	import { browser } from '$app/environment';
	import { getItem } from '$lib/client/utils';
	import Layout from '$lib/components/ui/Layout.svelte';
	import { getCaster } from '$lib/client/casterService';
	import './style.css';
	import { USER_STORE_KEY } from '$lib/client/clientConsts';
	let loading = true;
	$: if (browser) {
		const item = getItem(USER_STORE_KEY, window);
		if (item) {
			getCaster(item).then((data) => {
				loading = false;
			});
		} else {
			loading = false;
		}
	}
</script>

{#if loading}
	Loading ...
{:else}
	<Layout>
		<slot />
	</Layout>
{/if}
