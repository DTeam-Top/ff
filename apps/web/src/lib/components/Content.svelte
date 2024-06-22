<script lang="ts">
	import { setStatus, user } from '$lib/client/store';
	import CommissionCard from '$lib/components/dashboard/CommissionCard.svelte';
	import DraftIcon from './ui/icons/DraftIcon.svelte';
	import FinishIcon from './ui/icons/FinishIcon.svelte';
	import UnavalibleIcon from './ui/icons/UnavalibleIcon.svelte';
	import PublishedIcon from './ui/icons/PublishedIcon.svelte';
	import MyProfile from './dashboard/MyProfile.svelte';
	import { getStatisticsCount } from '$lib/client/secretService';
	import { goto } from '$app/navigation';
	import WithdrawChart from './dashboard/WithdrawChart.svelte';
	import CreateButton from './CreateButton.svelte';

	let statistics: any[] = [];
	$: if ($user && $user.fid > 0) {
		getStatisticsCount($user.fid).then((count) => {
			statistics = count.dashboard;
		});
	}
	const getIcon = (status: 0) => {
		let icon;
		switch (status.toString()) {
			case '0':
				icon = DraftIcon;
				break;
			case '1':
				icon = PublishedIcon;
				break;
			case '2':
				icon = UnavalibleIcon;
				break;
			case '3':
				icon = FinishIcon;
				break;
		}
		return icon;
	};
	const clickHandler = (status: number) => {
		setStatus(status);
		goto(`/flows`);
	};
</script>

<div class="flex flex-wrap m-4">
	<div class="w-full">
		<div class="py-4 items-center flex justify-between">
			<span class="text-3xl font-bold">Welcome back, {$user.displayName}! 👏</span>
			<div class=" right-0 top-2"><CreateButton /></div>
		</div>
		<div class="grid lg:grid-cols-4 gap-8 my-4 md:grid-cols-4 sm:grid-cols-2">
			{#each statistics as { title, count, status }, i}
				<div
					class=" bg-[#495A8C] text-white p-5 rounded flex items-center justify-between cursor-pointer hover:bg-primary-hover-token"
					on:click={() => clickHandler(status)}
				>
					<div>
						<div class="text-5xl font-bold">{count}</div>
						<div class="opacity-50">{title}</div>
					</div>
					<div class="text-primary-400 w-10 h-10 items-center justify-between p-2">
						<svelte:component this={getIcon(status)} />
					</div>
				</div>
			{/each}
		</div>
	</div>
	<WithdrawChart />
	<div class="mt-8 lg:mt-0 lg:w-4/12 lg:pl-4 md:w-1/3 sm:w-full">
		<MyProfile />
		<CommissionCard />
	</div>
</div>
