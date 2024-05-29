<script>
	import { WARP_BASE, commissionList, frameList, statistics } from '$lib/services/constants';
	import { user } from '$lib/services/store';
	import dayjs from 'dayjs';
	import CreateButton from '$lib/components/CreateButton.svelte';
	import { onMount } from 'svelte';
	import * as echarts from 'echarts';
	export let title;

	let myChart;
	let options;
	onMount(() => {
		var dom = document.getElementById('barChart');
		myChart = echarts.init(dom, null, {
			renderer: 'canvas',
			useDirtyRect: false
		});
		var dataAxis = ['hwh', 'li', 'Xa', 'liu', 'Ge', 'Ni'];
		var data = [220, 182, 191, 234, 290, 330, 310, 234];
		var yMax = 500;
		var dataShadow = [];

		for (var i = 0; i < data.length; i++) {
			dataShadow.push(yMax);
		}

		options = {
			xAxis: {
				data: dataAxis,
				axisLabel: {
					inside: true,
					textStyle: {
						color: '#fff'
					}
				},
				axisTick: {
					show: false
				},
				axisLine: {
					show: false
				},
				z: 10
			},
			yAxis: {
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLabel: {
					textStyle: {
						color: '#999'
					}
				}
			},
			dataZoom: [
				{
					type: 'inside'
				}
			],
			series: [
				{
					// For shadow
					type: 'bar',
					itemStyle: {
						color: 'rgba(0,0,0,0.05)'
					},
					barGap: '-100%',
					barCategoryGap: '40%',
					data: dataShadow,
					animation: false
				},
				{
					type: 'bar',
					itemStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: '#83bff6' },
							{ offset: 0.5, color: '#188df0' },
							{ offset: 1, color: '#188df0' }
						])
					},
					emphasis: {
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#2378f7' },
								{ offset: 0.7, color: '#2378f7' },
								{ offset: 1, color: '#83bff6' }
							])
						}
					},
					data: data
				}
			]
		};

		myChart.setOption(options, true);
	});
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
				<!-- <button class="text-white bg-transparent" title="List View">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="8" y1="6" x2="21" y2="6" />
						<line x1="8" y1="12" x2="21" y2="12" />
						<line x1="8" y1="18" x2="21" y2="18" />
						<line x1="3" y1="6" x2="3.01" y2="6" />
						<line x1="3" y1="12" x2="3.01" y2="12" />
						<line x1="3" y1="18" x2="3.01" y2="18" />
					</svg>
				</button> -->
				<CreateButton />
			</div>
		</div>
		<div class="flex flex-wrap">
			{#each frameList as item, i}
				<div class="w-full md:w-6/12">
					<div class="p-2">
						<div class="p-4 rounded-3xl" style={`background-color: ${item.color}`}>
							<div class="text-center">
								<p class="text-4xl font-bold opacity-70">{item.count}</p>
								<p class="text-sm opacity-70 mt-2">{item.name}</p>
							</div>
						</div>
					</div>
				</div>
			{/each}
			<div class="w-full h-[400px] mx-auto mt-4" id="barChart" />
		</div>
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
		<div class="bg-gray-800 rounded-3xl px-6 pt-6 mt-4">
			<div class="flex text-white text-2xl pb-6 font-bold">
				<p>Comission List</p>
			</div>
			<div>
				{#each commissionList as item, i}
					<div
						class="border-t solid border-gray-700 p-4 flex 2xl:items-start w-full hover:bg-gray-700"
					>
						<img src={item.cover} alt="profile" class="object-cover w-10 h-10 rounded-full" />
						<div class="pl-4 w-full">
							<div class="flex items-center justify-between w-full">
								<div class="text-white font-medium">{item.name}</div>
								<div class="flex justify-center items-center cursor-pointer h-7 w-7">
									<a
										target="_blank"
										href="https://basescan.org/tx/0x1bde2bc276c9c748e75d62fba3b034607c41f8a3eb335d4d8c774ad038ecd791"
										><img src="/images/etherscan.png" alt="etherscan" /></a
									>
								</div>
							</div>
							<p class="my-2 text-sm text-gray-400">
								{item.commission}
							</p>
							<p class="text-right text-gray-400 text-sm">
								{dayjs(item.ts * 1000).format('YYYY, MMMM, DD')}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
