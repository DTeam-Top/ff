<script lang="ts">
	import { getFlow } from '$lib/services/flowService';

	import { page } from '$app/stores';
	import { getPreviewUrl } from '$lib/services/utils';
	import { PUBLIC_FRAME_BASE_URL } from '$env/static/public';
	import FrameButtons from '$lib/components/FrameButtons.svelte';
	import Tips from '$lib/components/Tips.svelte';
	let frameUrl = '';
	let prviewImage: string;
	$: if ($page.params.id && !frameUrl) {
		getFlow(Number($page.params.id)).then(async (flow) => {
			console.log(flow);
			frameUrl = `${PUBLIC_FRAME_BASE_URL}/api/${flow.id}`;
			prviewImage = await getPreviewUrl(
				PUBLIC_FRAME_BASE_URL,
				flow.name,
				flow.cover,
				flow.input.price,
				flow.input.nft
			);
			console.log(prviewImage);
		});
	}
</script>

<div class="bg-gray-800 py-6 px-6 rounded-3xl h-full mx-8 text-white mt-4">
	{#if frameUrl && prviewImage}
		<div class="w-[600px] mx-auto">
			<div class="font-bold text-xl mb-4">The frame will be like following:</div>
			<div class="relative rounded-md relative w-full border-0 text-black">
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
			No data, please check the share link.
		</div>
	{/if}
</div>
