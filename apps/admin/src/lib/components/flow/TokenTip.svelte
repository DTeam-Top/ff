<script lang="ts">
	import { BASESCAN_URL, ERC20, ERC721 } from '$lib/client/clientConsts';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import TipIcon from '../ui/icons/TipIcon.svelte';
	const popupFeatured: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'popupFeatured',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom'
	};
</script>

<button class="text-warning-500 hover:text-warning-300" use:popup={popupFeatured}
	><svelte:component this={TipIcon} /></button
>

<div
	class="w-[300px] mx-auto bg-purple-200 rounded-lg p-4 text-black shadow-xl"
	data-popup="popupFeatured"
>
	<span class="text-warning-500"><svelte:component this={TipIcon} /></span>

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
