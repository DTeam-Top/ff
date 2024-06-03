<script lang="ts">
	import { goto } from '$app/navigation';
	import { getTracesByFlowId } from '$lib/services/flowService';
	import { addressPipe, signed } from '$lib/services/utils';
	import { setFarcaster, user } from '$lib/services/store';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import dayjs from 'dayjs';
	let list: any[] = [];
	onMount(() => {
		setFarcaster({ id: 0 });
	});

	$: if (!$signed) {
		goto('/');
	}

	$: if ($user && $page) {
		getTraceList();
	}
	const getTraceList = async () => {
		console.log(Number($page.params.id), $user.fid);
		const result = await getTracesByFlowId(Number($page.params.id), $user.fid);
		console.log(result);
		list = result;
	};
	const goBack = () => {
		goto('/flows');
	};
</script>

<svelte:head>
	<title>My Traces</title>
	<meta name="description" content="Create frame" />
</svelte:head>

<section class="w-full bg-gray-800 h-full py-6 px-6 rounded-3xl">
	<div class="w-full">
		<div class="flex justify-between text-white">
			<div class="text-2xl font-bold">My Traces</div>
			<div class="flex flex-row-reverse text-right">
				<button
					class="text-white bg-gray-700 p-2 ml-2 flex items-center gap-2 rounded-lg"
					on:click={goBack}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect x="3" y="3" width="7" height="7" />
						<rect x="14" y="3" width="7" height="7" />
						<rect x="14" y="14" width="7" height="7" />
						<rect x="3" y="14" width="7" height="7" />
					</svg>
					Return
				</button>
			</div>
		</div>
		{#if list.length > 0}
			<table class="table-fixed w-full text-sm bg-blue-200 rounded-lg mt-4">
				<thead>
					<tr>
						<th class="border-b dark:border-slate-600 font-bold p-4 dark:text-slate-200 text-center"
							>Cast</th
						>
						<th
							class="border-b dark:border-slate-600 font-bold p-4 dark:text-slate-200 text-center w-[150px]"
							>Trace Time</th
						>
					</tr>
				</thead>
				<tbody class="bg-white dark:bg-slate-800">
					{#each list as item, i}
						<tr>
							<td class="border-b border-slate-300 dark:border-slate-700 p-4 pl-8 dark: border-r"
								><a>{item.cast}</a></td
							>
							<td class="border-b border-slate-300 dark:border-slate-700 p-4 pl-8 dark: border-r"
								>{dayjs(item.createdAt).format('YYYY, MMMM, DD')}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<div class="w-full text-center text-2xl my-8 text-white">
				There is no trace, please publish on in farcaster.
			</div>
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
