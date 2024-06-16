<script lang="ts">
	import { BASESCAN_URL, ERC20, ERC721 } from '$lib/client/clientConsts';
	import TipIcon from '../ui/icons/TipIcon.svelte';
</script>

<div
	class="w-[300px] mx-auto bg-purple-200 rounded-lg p-4 text-black shadow-xl absolute right-10 top-14"
>
	If you have no test token, please visit<a
		href={`${BASESCAN_URL}/${ERC20}`}
		target="_blank"
		class="underline cursor-pointer mx-2">ERC20</a
	>
	and
	<a href={`${BASESCAN_URL}/${ERC721}`} class="underline cursor-pointer mx-2" target="_blank"
		>ERC721</a
	> to mint.
</div>
