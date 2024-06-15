<script lang="ts">
	import { getAllTraces } from '$lib/client/flowService';
	import { castAddressPipe } from '$lib/client/utils';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import dayjs from 'dayjs';
	let intervalMs = 5000;
	const query = createInfiniteQuery({
		queryKey: ['traces'],
		refetchInterval: intervalMs,
		queryFn: (pageParam) => getAllTraces({ pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			console.log(lastPage.next);
			if (lastPage.next) {
				const nextUrl = new URLSearchParams(new URL(lastPage.next).search);
				const nextCursor = nextUrl.get('page');
				if (nextCursor) {
					return +nextCursor;
				}
			}
			return undefined;
		}
	});
</script>

<svelte:head>
	<title>Browse</title>
</svelte:head>

<div class="flex flex-wrap h-full">
	<div class="w-full py-6 px-6 my-10">
		{#if $query.isLoading}
			<p>Loading...</p>
		{:else if $query.isError}
			<p>Error: {$query.error.message}</p>
		{:else if $query.isSuccess}
			<div class="max-w-[1200px] mx-auto gap-8 columns-4">
				{#each $query.data.pages as { results }}
					{#each results as trace, i}
						<figure class="mb-4">
							<a
								class="cursor-pointer hover:variant-soft-primary h-fit"
								href={castAddressPipe(trace.cast, trace.casterProfile?.username)}
								target="_blank"
							>
								<img src={trace.cover} alt="cover" class="w-full rounded-t-lg border-primary-100" />
								<div
									class="p-2 border-l border-r border-b border-[#495A8C] rounded-b-lg text-white bg-surface-500"
								>
									<div class="flex justify-between items-end mb-2">
										<div class="text-2xl font-bold">{trace.name}</div>
										<div>{trace.input.price} <span class="opacity-50">ETH</span></div>
									</div>

									<div class="text-sm flex items-center justify-between my-3">
										<div class="flex items-center">
											<UserAvatar url={trace.casterProfile.avatar} />
											<span class="ml-2">{trace.casterProfile.displayName}</span>
										</div>
										<div>
											{dayjs(trace.traceTime).format('MMMM, DD')}
										</div>
									</div>
								</div>
							</a>
						</figure>
					{/each}
				{/each}
			</div>
			<div class="mx-auto w-[300px]">
				<button
					class="cursor-pointer mt-4 underline text-2xl"
					on:click={() => $query.fetchNextPage()}
					disabled={!$query.hasNextPage || $query.isFetchingNextPage}
				>
					{#if $query.isFetching}
						Loading more...
					{:else if $query.hasNextPage}
						Load More
					{:else}Nothing more to load{/if}
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	figure {
		margin: 0;
		display: grid;
		grid-template-rows: 1fr auto;
		margin-bottom: 24px;
		break-inside: avoid;
		-webkit-column-break-inside: avoid;
	}
</style>
