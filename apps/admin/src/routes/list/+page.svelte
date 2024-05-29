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

<section class="w-full bg-gray-800 h-full py-6 px-6 rounded-3xl">
	<div class="">
		<div class="flex flex-row-reverse text-right"><CreateButton /></div>
		{#if list.length > 0}
			<table class="table-fixed w-full text-sm bg-blue-200 rounded-lg mt-4">
				<thead>
					<tr>
						<th class="border-b dark:border-slate-600 font-bold p-4 dark:text-slate-200 text-center"
							>Name</th
						>
						<th
							class="border-b dark:border-slate-600 font-bold p-4 dark:text-slate-200 text-center w-[150px]"
							>Price</th
						>
						<th
							class="border-b dark:border-slate-600 font-bold p-4 dark:text-slate-200 text-center w-[200px]"
							>Contract</th
						>
						<th class="border-b dark:border-slate-600 font-bold p-4 dark:text-slate-200 text-center"
							>Action</th
						>
					</tr>
				</thead>
				<tbody class="bg-white dark:bg-slate-800">
					{#each list as item, i}
						<tr>
							<td class="border-b border-slate-300 dark:border-slate-700 p-4 pl-8 dark: border-r"
								>{item.name}</td
							>
							<td class="border-b border-slate-300 dark:border-slate-700 p-4 pl-8 dark: border-r"
								>{item.input.price} ETH</td
							>
							<td class="border-b border-slate-300 dark:border-slate-700 p-4 pl-8 dark: border-r"
								>{addressPipe(item.input.nft)}</td
							>
							<td class="border-b border-slate-300 dark:border-slate-700 p-4 dark:"
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
			<!-- <div class="hidden md:grid sm:grid grid-cols-3 gap-8">
				{#each list as item, i}
					<div class="w-full">
						<div class="p-2">
							<div class="rounded-3xl bg-green-200 p-4">
								<div class="mb-4 text-center">
									<p class="text-base font-bold opacity-70">{item.name}</p>
								</div>
								<div>
									<p class="m-0 text-sm font-bold">{item.input.price} ETH</p>
									<p class="m-0 text-sm font-bold">{addressPipe(item.input.nft)}</p>
								</div>
								<div>
									<img class="h-48 w-48 overflow-hidden object-cover mx-auto" src={item.cover} />
								</div>
								<div class="relative flex justify-between pt-4">
									<div class="flex items-center">
										<button
											class="ml-3 flex h-5 w-5 items-center justify-center rounded-full border-none bg-white p-0"
											><svg
												xmlns="http://www.w3.org/2000/svg"
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="3"
												stroke-linecap="round"
												stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg
											></button
										>
										<button
											class="ml-3 flex h-5 w-5 items-center justify-center rounded-full border-none bg-white p-0"
											><svg
												xmlns="http://www.w3.org/2000/svg"
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="3"
												stroke-linecap="round"
												stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg
											></button
										>
										<button
											class="ml-3 flex h-5 w-5 items-center justify-center rounded-full border-none bg-white p-0"
											><svg
												xmlns="http://www.w3.org/2000/svg"
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="3"
												stroke-linecap="round"
												stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg
											></button
										>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div> -->
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
		align-items: start;
		/* flex: 0.6; */
	}
</style>
