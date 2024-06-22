<script lang="ts">
	import { BASESCAN_URL, ERC1155, ERC20, ERC721 } from '$lib/client/clientConsts';
	export let cssClass: string = '';
</script>

<div class={`w-[300px] mx-auto bg-purple-200 rounded-lg p-4 text-black shadow-xl  ${cssClass}`}>
	<span class="font-bold mr-2">Tips:</span> If you haven't test tokens, please visit<a
		href={`${BASESCAN_URL}/${ERC20}`}
		target="_blank"
		class="underline cursor-pointer mx-2">ERC20</a
	>
	,
	<a href={`${BASESCAN_URL}/${ERC721}`} class="underline cursor-pointer mx-2" target="_blank"
		>ERC721</a
	>
	and
	<a href={`${BASESCAN_URL}/${ERC1155}`} class="underline cursor-pointer mx-2" target="_blank"
		>ERC1155</a
	> to mint.
</div>
