<script lang="ts">
	import { user } from '$lib/client/store';
	import dayjs from 'dayjs';
	import CreateButton from '$lib/components/CreateButton.svelte';
	import { onMount } from 'svelte';
	import * as echarts from 'echarts';
	import { getFlows, getStaticsCount } from '$lib/client/flowService';
	import Commission from './Commission.svelte';
	import { BG_COLORLIST, WARP_BASE } from '$lib/client/clientConsts';

	export let title;

	let statistics: any[] = [];
	let frameList: any[] = [];
	let flowList: any[] = [];
	let myChart;
	let options;
	onMount(() => {});

	$: if ($user) {
		getStaticsCount($user.fid).then((count) => {
			statistics = count.banner;
			//frameList = count.card;
		});
		getFlows($user.fid, true).then((flows) => {
			console.log(flows);
			flowList = flows;
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
		<div class="grid grid-cols-3 gap-4">
			{#each flowList as item, i}
				<div class="w-full">
					<div class="p-2">
						<div class={`p-4 rounded-3xl ${BG_COLORLIST[Math.floor(i % 6)]}`}>
							<div class="flex items-center justify-b">
								<span class="text-sm">{dayjs(item.createdAt).format('YYYY, MMMM, DD')}</span>
							</div>
							<div class="text-center mb-4 mt-5">
								<p class="text-base font-bold opacity-70">{item.name}</p>
							</div>
							<div>
								<img src={item.cover} alt="cover" class="mx-auto w-20" />
							</div>
							<div class="flex justify-between pt-4 relative">
								<div>Traced: {item.traceCount}</div>
								<div>Paid: {item.paymentCount}</div>
								<!-- <div class="flex items-center">
									<img
										class="w-5 h-5 rounded-full overflow-hidden object-cover"
										src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
										alt="participant"
									/>
									<img
										class="w-5 h-5 rounded-full overflow-hidden object-cover"
										src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbnxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
										alt="participant"
									/>
								</div> -->
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="w-full mt-8 lg:mt-0 lg:w-4/12 lg:pl-4">
		<div class="bg-gray-800 rounded-3xl px-6 pt-6">
			<div class="flex text-white text-2xl pb-4 font-bold">
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
							Following: {$user.followingCount}, Follower: {$user.followerCount}
						</p>
					</div>
				</div>
			</div>
		</div>
		<Commission />
	</div>
</div>
