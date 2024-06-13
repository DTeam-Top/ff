<script lang="ts">
	import { goto } from '$app/navigation';
	import { getTracesByFlowId } from '$lib/client/flowService';
	import { setFarcaster, user, signed } from '$lib/client/store';
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
		const result = await getTracesByFlowId($page.params.id, $user.fid);
		list = result;
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
				<a class="anchor" href={`/flows/view/${$page.params.id}`}
					>{list.length > 0 ? list[0].name : ''}</a
				>
			</li>
			<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
			<li class="text-white">Traces List</li>
		</ol>

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
