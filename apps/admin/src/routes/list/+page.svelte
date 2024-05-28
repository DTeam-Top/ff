<script lang="ts">
	import { goto } from '$app/navigation';
	import { getFlows, deleteFlow } from '$lib/services/flowService';
	import { addressPipe, signed } from '$lib/services/utils';
	import { setFarcaster, user } from '$lib/services/store';
	import { onMount } from 'svelte';
	import CreateButton from '$lib/components/CreateButton.svelte';
	let list: any[] = [];
	onMount(() => {
		setFarcaster({ id: 0 });
	});

	$: if (!$signed) {
		console.log($signed);
		goto('/');
	}

	$: if ($user) {
		getFlowList();
	}
	const getFlowList = async () => {
		const result = await getFlows($user.fid);
		list = result;
	};
	const editHandler = (id: number) => {
		goto(`edit/${id}`);
	};
	const delHandler = async (id: number) => {
		await deleteFlow(id);
		getFlowList();
	};
	const traceHandler = (id: number) => {};
</script>

<svelte:head>
	<title>Create</title>
	<meta name="description" content="Create frame" />
</svelte:head>

<section class="w-full grid grid-cols-2 gap-8">
	<div class="w-full bg-gray-100 py-6 px-6 rounded-3xl">
		<div class="flex flex-row-reverse text-right"><CreateButton /></div>
		{#if list.length > 0}
			<table
				class="border-collapse table-fixed w-full text-sm border border-gray-300 rounded-lg mt-4"
			>
				<thead>
					<tr>
						<th
							class="border-b dark:border-slate-600 font-medium p-4 text-slate-400 dark:text-slate-200 text-left"
							>Name</th
						>
						<th
							class="border-b dark:border-slate-600 font-medium p-4 text-slate-400 dark:text-slate-200 text-left w-[150px]"
							>Price</th
						>
						<th
							class="border-b dark:border-slate-600 font-medium p-4 text-slate-400 dark:text-slate-200 text-left w-[200px]"
							>NFT</th
						>
						<th
							class="border-b dark:border-slate-600 font-medium p-4 text-slate-400 dark:text-slate-200 text-left"
							>Action</th
						>
					</tr>
				</thead>
				<tbody class="bg-white dark:bg-slate-800">
					{#each list as item, i}
						<tr>
							<td
								class="border-b border-slate-300 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 border-r"
								>{item.name}</td
							>
							<td
								class="border-b border-slate-300 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 border-r"
								>{item.input.price} ETH</td
							>
							<td
								class="border-b border-slate-300 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 border-r"
								>{addressPipe(item.input.nft)}</td
							>
							<td
								class="border-b border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400"
								><button
									class="border rounded-lg mx-8 px-4 py-2 bg-gray-100 text-black"
									on:click={() => editHandler(item.id)}>Edit</button
								>
								<button
									class="rounded-lg mx-8 px-4 py-2 bg-blue-400 text-white"
									on:click={() => delHandler(item.id)}>Delete</button
								>
								<button
									class="rounded-lg mx-8 px-4 py-2 bg-violet-400 text-white"
									on:click={() => traceHandler(item.id)}>Trace</button
								></td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<div class="text-center text-2xl my-8">There is no flow, please create it.</div>
		{/if}
	</div>
</section>

<style>
	section {
		display: flex;
		/* flex-direction: column; */
		justify-content: center;
		align-items: center;
		/* flex: 0.6; */
	}
</style>
