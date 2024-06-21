<script lang="ts">
	import { BG_COLORLIST, LIMIT_MAX_HOME } from '$lib/client/clientConsts';
	import dayjs from 'dayjs';
	import CreateButton from '../CreateButton.svelte';
	import { goto } from '$app/navigation';
	import { user } from '$lib/client/store';
	import { getFlows, getStaticsCount } from '$lib/client/secretService';
	export let title: string = '';

	let statistics: any[] = [];
	let flowList: any[] = [];
	let currentPage = 1;
	let page = 0;
	let offset = 0;

	$: if ($user && $user.fid > 0) {
		flowList = [];
		getStaticsCount($user.fid).then((count) => {
			statistics = count.landing;
		});
		getFlowList().then(() => {});
	}
	const getFlowList = async () => {
		const flows = await getFlows($user.fid, 'published', offset, LIMIT_MAX_HOME, false);
		page = Math.ceil(flows.total / LIMIT_MAX_HOME);
		flowList = [...flows.list];
	};
	const moreHandler = async () => {
		if (currentPage < page) {
			currentPage += 1;
			offset = (currentPage - 1) * LIMIT_MAX_HOME;
			await getFlowList();
		}
	};
</script>

<div class="lg:w-8/12 py-6 px-6 hover:bg-primary-hover-token">
	<header class="flex justify-between items-center pb-4 border-b solid border-gray-700">
		<h3>{title}</h3>
		<p class="">{dayjs().format('MMMM, DD')}</p>
	</header>
	<div class="flex flex-wrap justify-between items-center py-4">
		<div class="flex flex-wrap">
			<!-- {#each statistics as { title, count }, i}
				<div class="pr-10">
					<div class="text-2xl font-bold">{count}</div>
					<div class="opacity-50">{title}</div>
				</div>
			{/each} -->
		</div>
		<div class="flex items-center mt-4 md:mt-0">
			<CreateButton />
		</div>
	</div>
	<div class="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-4 text-black">
		{#each flowList as item, i}
			<div class="w-full">
				<div class="p-2">
					<button
						class={`w-full p-4 rounded-xl ${BG_COLORLIST[Math.floor(i % 6)]} hover:bg-primary-100 cursor-pointer`}
						on:click={() => goto(`/flows/view/${item.id}`)}
					>
						<div class="flex items-center justify-b">
							<span class="text-sm">{dayjs(item.createdAt).format('YYYY, MMMM, DD')}</span>
						</div>
						<div class="text-center mb-4 mt-5">
							<p class="text-base font-bold opacity-70">{item.name}</p>
						</div>
						<div>
							<img src={item.cover} alt="cover" class="mx-auto h-24" />
						</div>
						<div class="flex justify-between pt-4 relative">
							<div>Traced: {item.traceCount}</div>
							<div>Paid: {item.paymentCount}</div>
						</div>
					</button>
				</div>
			</div>
		{/each}
	</div>
	{#if page > 0 && currentPage < page}
		<div class="py-4 text-white mx-auto w-[100px] text-center text-lg">
			<button on:click={moreHandler} class="underline cursor-pointer text-lg"> More </button>
		</div>
	{/if}
</div>
