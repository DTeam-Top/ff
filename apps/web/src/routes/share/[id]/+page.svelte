<script lang="ts">
	import { getFlow } from '$lib/client/secretService';

	import { page } from '$app/stores';
	import FrameButtons from '$lib/components/FrameButtons.svelte';
	import Tips from '$lib/components/Tips.svelte';
	import { FRAME_BASE_URL, STATUS_DONE, STATUS_UNAVAILABLE } from '$lib/client/clientConsts';
	import { getPreviewUrl } from '$lib/client/commonService';
	import Spin from '$lib/components/Spin.svelte';

	let frameUrl = '';
	let prviewImage: string;
	let message = 'No data, please check the share link.';
	let loading = true;
	$: if ($page.params.id && !frameUrl) {
		getFlow($page.params.id).then(async (flow) => {
			if (flow.status === STATUS_DONE) {
				loading = false;
				message = 'The flow is done.';
				return;
			}

			if (flow.status === STATUS_UNAVAILABLE) {
				message = 'The flow is unavailable.';
				loading = false;
				return;
			}

			frameUrl = `${FRAME_BASE_URL}/api/${flow.id}`;
			prviewImage = await getPreviewUrl(
				FRAME_BASE_URL || 'http://localhost:3000',
				flow.name,
				flow.cover,
				flow.input.price
			);
			loading = false;
		});
	}
</script>

<svelte:head>
	<title>Share Flow</title>
	<meta name="description" content="Share flow" />
</svelte:head>

<div class="py-6 px-6 rounded-3xl h-full mx-8 text-white mt-4">
	{#if loading}
		<Spin />
	{:else if frameUrl && prviewImage}
		<div class="w-[600px] mx-auto">
			<div class="font-bold text-xl mb-4">The frame will be like following:</div>
			<div class="relative rounded-md relative w-full text-black border-white border p-4 bg-white">
				<div class="relative">
					<img
						class="bg-background-200 min-h-img object-cover rounded-t-lg text-background-200 w-full"
						src={prviewImage}
						alt="Preview Frame"
						style="aspect-ratio: 1.91 / 1; max-height: 532.5px;"
					/>
				</div>
				<FrameButtons />
			</div>

			<Tips {frameUrl} text={'share'} width={'w-full'} />
		</div>
	{:else}
		<div class="my-20 text-white text-4xl font-bold mx-auto w-1/2 text-center">
			{message}
		</div>
	{/if}
</div>
