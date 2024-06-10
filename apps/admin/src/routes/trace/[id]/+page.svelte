<script lang="ts">
	import { goto } from '$app/navigation';
	import { getTracesByFlowId } from '$lib/client/flowService';
	import { signed } from '$lib/client/utils';
	import { setFarcaster, user } from '$lib/client/store';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import dayjs from 'dayjs';
	let list: any[] = [];
	onMount(() => {
		setFarcaster({ id: '0' });
	});

	$: if (!$signed) {
		goto('/');
	}

	$: if ($user && $page) {
		getTraceList();
	}
	const getTraceList = async () => {
		console.log($page, $user.fid, 222);
		const result = await getTracesByFlowId($page.params.id, $user.fid);
		console.log(result);
		list = result;
	};
	const goBack = () => {
		goto('/flows');
	};
</script>

<svelte:head>
	<title>My Traces</title>
	<meta name="description" content="My traces of a flow" />
</svelte:head>

<section class="w-full min-h-full py-6 px-6 rounded-3xl">
	<div class="w-full">
		<ol class="breadcrumb mb-8">
			<li class="crumb"><a class="anchor" href="/flows">Flow list</a></li>
			<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
			<li class="crumb">
				<a class="anchor" href="/flows">{list.length > 0 ? list[0].name : ''}</a>
			</li>
			<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
			<li class="text-white">Traces List</li>
		</ol>
		<!-- <div class="flex justify-between text-white">
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
		</div> -->
		{#if list.length > 0}
			<table class="table table-hover">
				<thead>
					<tr>
						<th>Cast</th>
						<th>Trace Time</th>
					</tr>
				</thead>
				<tbody>
					{#each list as item, i}
						<tr>
							<td><a href="">{item.cast}</a></td>
							<td>{dayjs(item.createdAt).format('YYYY, MMMM, DD')}</td>
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
