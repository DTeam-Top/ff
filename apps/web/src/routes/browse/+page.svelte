<script lang="ts">
	import { getAllTraces } from '$lib/client/commonService';
	import { castAddressPipe } from '$lib/client/utils';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import ShareIcon from '$lib/components/ui/icons/ShareIcon.svelte';
	import dayjs from 'dayjs';
	import WarpIcon from '$lib/components/ui/icons/WarpIcon.svelte';
	import DetailIcon from '$lib/components/ui/icons/DetailIcon.svelte';
	import { BASE_URL } from '$lib/client/clientConsts';
	const query = createInfiniteQuery({
		queryKey: ['traces'],
		queryFn: (pageParam) => getAllTraces({ pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
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
	<title>Browse Running Traces</title>
</svelte:head>

<div class="flex flex-wrap h-full">
	<div class="w-full py-6 px-6">
		{#if $query.isLoading}
			<p>Loading...</p>
		{:else if $query.isError}
			<p>Error: {$query.error.message}</p>
		{:else if $query.isSuccess}
			<div class="max-w-[1200px] mx-auto">
				<div class="text-2xl font-bold mb-4">Running Traces</div>
				<div class="columns-4 gap-8">
					{#each $query.data.pages as { results }}
						{#each results as trace, i}
							<figure class="mb-4">
								<div class="cursor-pointer hover:variant-soft-primary h-fit">
									<img
										src={trace.cover}
										alt="cover"
										class="w-full rounded-t-lg border-primary-100"
									/>
									<div
										class="p-2 border-l border-r border-b border-[#495A8C] rounded-b-lg text-white bg-surface-500"
									>
										<div class="flex justify-between items-end mb-2">
											<div class="text-2xl font-bold">{trace.name}</div>
											<div>{trace.input.price} <span class="opacity-50 text-xs">ETH</span></div>
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
										<div class="flex justify-end">
											<a
												class="text-[#472A91] hover:text-secondary-900"
												href={castAddressPipe(trace.cast, trace.casterProfile?.username)}
												target="_blank"
											>
												<svelte:component this={WarpIcon} />
											</a>
											<a
												class="text-tertiary-500 hover:text-tertiary-900 mx-4"
												href={`${BASE_URL}flows/view/${trace.id}`}
												target="_blank"
											>
												<svelte:component this={DetailIcon} />
											</a>
											<a
												class="text-primary-500 hover:text-primary-900"
												href={`${BASE_URL}share/${trace.id}`}
												target="_blank"
											>
												<svelte:component this={ShareIcon} />
											</a>
										</div>
									</div>
								</div>
							</figure>
						{/each}
					{/each}
				</div>
			</div>
			<div class="mx-auto w-[300px]">
				<button
					class="cursor-pointer mt-4 underline text-2xl"
					on:click={() => $query.fetchNextPage()}
					disabled={!$query.hasNextPage || $query.isFetchingNextPage}
				>
					{#if $query.isFetching}{:else if $query.hasNextPage}
						Load More
					{/if}
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
