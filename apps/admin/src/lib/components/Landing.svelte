<script lang="ts">
	import { getStaticsCount } from '$lib/services/flowService';

	let statistics: any[] = [];
	$: {
		getStaticsCount().then((count) => {
			statistics = count.banner;
		});
	}
</script>

<div class="flex flex-wrap">
	<div class="w-full py-6 px-6 bg-gray-800 h-sceen">
		<div class="flex flex-wrap justify-between items-center pb-8">
			<div class="grid grid-cols-3 w-full text-center text-white mt-10">
				{#each statistics as { title, count }, i}
					<div>
						<div class="text-7xl font-bold">{count}</div>
						<div class="mt-4">{title}</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="text-white text-4xl text-center mx-auto my-40">TODO ....</div>
	</div>
</div>
