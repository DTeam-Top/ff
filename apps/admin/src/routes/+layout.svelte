<script>
	import { browser } from '$app/environment';
	import { USER_STORE_KEY } from '$lib/services/constants';
	import { getItem } from '$lib/services/utils';
	import Layout from '$lib/components/ui/Layout.svelte';
	import { getUser } from '$lib/services/userService';
	let loading = true;
	$: if (browser) {
		const item = getItem(USER_STORE_KEY, window);
		if (item) {
			getUser(item).then((data) => {
				loading = false;
			});
		} else {
			loading = false;
		}
	}
</script>

{#if loading}
	Loading
{:else}
	<Layout>
		<slot />
	</Layout>
{/if}
