<script lang="ts">
	import { WARP_BASE, getBaseScanURL } from '$lib/services/constants';
	import { user } from '$lib/services/store';
	import dayjs from 'dayjs';
	import CreateButton from '$lib/components/CreateButton.svelte';
	import { onMount } from 'svelte';
	import * as echarts from 'echarts';
	import { getStaticsCount } from '$lib/services/flowService';
	import Commission from './Commission.svelte';

	export let title;

	let statistics: any[] = [];
	let frameList: any[] = [];
	let myChart;
	let options;
	onMount(() => {});

	$: if ($user) {
		getStaticsCount($user.fid).then((count) => {
			statistics = count.banner;
			frameList = count.card;
		});
	}
</script>

<div class="flex flex-wrap">
	<div class="w-full lg:w-8/12 bg-gray-800 py-6 px-6 rounded-3xl">
		<div class="flex justify-between text-white items-center mb-8">
			<p class="text-2xl font-bold">{title}</p>
			<p class="">{dayjs().format('MMMM, DD')}</p>
		</div>
		<div class="flex flex-wrap justify-between items-center pb-8">
			<div class="flex flex-wrap text-white">
				{#each statistics as { title, count }, i}
					<div class="pr-10">
						<div class="text-2xl font-bold">{count}</div>
						<div class="">{title}</div>
					</div>
				{/each}
			</div>
			<div class="flex items-center mt-4 md:mt-0">
				<CreateButton />
			</div>
		</div>
		<!-- <div class="flex flex-wrap">
			{#each frameList as item, i}
				<div class="w-full md:w-6/12">
					<div class="p-2">
						<div class="p-4 rounded-3xl" style={`background-color: ${item.color}`}>
							<div class="text-center">
								<p class="text-4xl font-bold opacity-70">{item.count}</p>
								<p class="text-sm opacity-70 mt-2">{item.title}</p>
							</div>
						</div>
					</div>
				</div>
			{/each}
			<div class="w-full h-[400px] mx-auto mt-4" id="barChart" />
		</div> -->
	</div>
	<div class="w-full mt-8 lg:mt-0 lg:w-4/12 lg:pl-4">
		<div class="bg-gray-800 rounded-3xl px-6 pt-6">
			<div class="flex text-white text-2xl pb-6 font-bold">
				<p>Profile</p>
			</div>
			<div>
				<div
					class="border-t solid border-gray-700 p-4 flex 2xl:items-start w-full hover:bg-gray-700"
				>
					<img src={$user.pft} alt="profile" class="object-cover w-10 h-10 rounded-full" />
					<div class="pl-4 w-full">
						<div class="flex items-center justify-between w-full">
							<div class="text-white font-medium">{$user.displayName}</div>
							<div class="flex justify-center items-center cursor-pointer h-7 w-7">
								<a target="_blank" href={`${WARP_BASE}${$user.username}`}
									><img src="/images/warp.svg" alt="share" /></a
								>
							</div>
						</div>
						<p class="my-2 text-sm text-gray-400">
							{$user.profile.bio.text}
						</p>
						<p class="text-right text-gray-400 text-sm">
							{$user.followingCount}, {$user.followerCount}
						</p>
					</div>
				</div>
			</div>
		</div>
		<Commission />
	</div>
</div>
