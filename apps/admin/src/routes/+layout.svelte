<script>
  import { browser } from "$app/environment";
  import { USER_STORE_KEY } from "$lib/services/constants";
  import { getItem } from "$lib/services/utils";
  import Layout from "$lib/components/ui/Layout.svelte";
  $: if (browser) {
    getItem(USER_STORE_KEY, window);
  }
</script>

<Layout>
  <slot />
</Layout>
