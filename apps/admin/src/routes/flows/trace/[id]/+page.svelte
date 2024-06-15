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
	import UserAvatar from '$lib/components/UserAvatar.svelte';
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
					{#each list as trace}
						<tr>
							<td
								><a
									href={castAddressPipe(trace.cast, trace.casterProfile?.username)}
									class="underline cursor-pointer text-primary-500 hover:text-primary-300"
									target="_blank">{castAddressPipe(trace.cast, trace.casterProfile.username)}</a
								></td
							>
							<td class="hover:text-primary-300">
								<a
									href={`${WARPCAST_URL}${trace.casterProfile.username}`}
									target="_blank"
									class="flex gap-2 rounded traces-center cursor-pointer underline"
								>
									<UserAvatar url={trace.casterProfile.avatar} />
									<span class="ml-4">{trace.casterProfile.displayName}</span>
								</a>
							</td>
							<td>{dayjs(trace.createdAt).format('YYYY, MMMM, DD')}</td>
							<td class="text-primary-500">
								{#if trace.paymentTx && trace.paymentTs}
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
