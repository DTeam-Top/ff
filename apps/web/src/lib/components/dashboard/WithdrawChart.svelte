<script lang="ts">
	import * as echarts from 'echarts';
	import { user } from '$lib/client/store';
	import { formatEther } from 'ethers';
	import { onMount } from 'svelte';
	import { getStatistics } from '$lib/client/secretService';

	let xAxisData: string[] = [];
	let seriesData: number[] = [];
	const getOption = (xAxisData: string[], seriesData: number[]) => {
		return {
			title: {
				text: 'Daily Commissions',
				color: '#fff',
				top: 20,
				left: 20,
				textStyle: {
					color: '#fff',
					fontSize: '1.5rem'
				}
			},
			graphic: {
				invisible: xAxisData.length,
				type: 'text',
				left: 'center',
				top: 'middle',
				style: { text: 'No data available', fontSize: '1.5rem', fill: '#fff' }
			},
			grid: {
				left: 40,
				containLabel: true,
				bottom: 50,
				top: 70,
				right: 0
			},
			tooltip: { show: true },
			xAxis: {
				data: xAxisData,
				axisLabel: {
					textStyle: {
						color: '#fff'
					}
				}
			},
			yAxis: {
				axisLabel: {
					textStyle: {
						color: '#fff'
					}
				}
			},
			series: [
				{
					name: 'Amount',
					type: 'line',
					data: seriesData
				}
			]
		};
	};

	onMount(async () => {
		var myChart = echarts.init(document.getElementById('chartsDiv'));
		const result = await getStatistics($user.fid);
		result.forEach((el: { sum: string; withdrawdate: string }) => {
			xAxisData.push(el.withdrawdate);
			seriesData.push(Number(formatEther(el.sum)));
		});

		myChart.setOption(getOption(xAxisData, seriesData));
	});
</script>

<div class="lg:w-8/12 md:w-2/3 sm:w-full">
	<div id="chartsDiv" class="w-full h-[500px] text-white"></div>
</div>
