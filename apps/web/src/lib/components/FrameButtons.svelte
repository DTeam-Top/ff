<script lang="ts">
	import LinkIcon from './ui/icons/LinkIcon.svelte';
	import TransactionIcon from './ui/icons/TransactionIcon.svelte';
</script>

<div class="grid gap-2.5 grid-cols-3 mt-4 px-4 text-black">
	<div>
		<button
			class="bg-gray-300 border-gray-200 flex items-center justify-center flex-row text-sm rounded-lg border cursor-pointer gap-1.5 h-10 py-2 px-4 w-full"
			type="button"
			><span class="whitespace-nowrap overflow-hidden text-ellipsis text-gray-1000 font-medium"
				>Pay</span
			>
			<svelte:component this={TransactionIcon} />
		</button>
	</div>
	<div>
		<button
			class="bg-gray-300 border-gray-200 flex items-center justify-center flex-row text-sm rounded-lg border cursor-pointer gap-1.5 h-10 py-2 px-4 w-full"
			type="button"
			><span class="whitespace-nowrap overflow-hidden text-ellipsis text-gray-1000 font-medium"
				>View Details</span
			>
			<svelte:component this={LinkIcon} />
		</button>
	</div>
	<div>
		<button
			class="bg-gray-300 border-gray-200 flex items-center justify-center flex-row text-sm rounded-lg border cursor-pointer gap-1.5 h-10 py-2 px-4 w-full"
			type="button"
			><span class="whitespace-nowrap overflow-hidden text-ellipsis text-gray-1000 font-medium"
				>Share To Earn</span
			>
			<svelte:component this={LinkIcon} />
		</button>
	</div>
</div>
