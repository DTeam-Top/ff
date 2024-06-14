<script lang="ts">
	import { goto } from '$app/navigation';
	import { getTracesByFlowId } from '$lib/client/flowService';
	import { setFarcaster, user, signed } from '$lib/client/store';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import dayjs from 'dayjs';
	import CheckIcon from '$lib/components/ui/icons/CheckIcon.svelte';
	import { castAddressPipe } from '$lib/client/utils';
	import { WARPCAST_URL } from '$lib/client/clientConsts';
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
		list = await getTracesByFlowId($page.params.id, $user.fid);
		console.log(list);
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
						<th>Cast Url</th>
						<th>Caster</th>
						<th>Trace Time</th>

						<th>Paid</th>
					</tr>
				</thead>
				<tbody>
					{#each list as item, i}
						<tr>
							<td
								><a
									href={castAddressPipe(item.cast, item.casterProfile?.username)}
									class="underline cursor-pointer text-primary-500 hover:text-primary-300"
									target="_blank">{castAddressPipe(item.cast, item.casterProfile.username)}</a
								></td
							>
							<td class="hover:text-primary-300">
								<a
									href={`${WARPCAST_URL}${item.casterProfile.username}`}
									target="_blank"
									class="flex gap-2 rounded items-center cursor-pointer underline"
								>
									<img
										src={item.casterProfile.avatar}
										alt="caster"
										class="h-8 object-cover rounded-full w-8 bg-white mr-4"
									/>
									{item.casterProfile.displayName}
								</a>
							</td>
							<td>{dayjs(item.createdAt).format('YYYY, MMMM, DD')}</td>
							<td class="text-primary-500">
								{#if item.paymentTx && item.paymentTs}
									<svelte:component this={CheckIcon} />
								{/if}
							</td>
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
