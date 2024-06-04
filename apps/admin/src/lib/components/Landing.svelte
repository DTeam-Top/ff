<script lang="ts">
	import { getStaticsCount } from '$lib/client/flowService';

	let statistics: any[] = [];
	let frameList: any[] = [];
	$: {
		getStaticsCount(undefined).then((count) => {
			statistics = count.banner;
			frameList = count.card;
		});
	}
</script>

<div class="flex flex-wrap h-full">
	<div class="w-full py-6 px-6 bg-gray-800">
		<div class="flex flex-wrap justify-between items-center pb-8 w-1/2 mx-auto">
			<div class="grid grid-cols-3 w-full text-center text-white mt-10">
				{#each statistics as { title, count }, i}
					<div>
						<div class="text-7xl font-bold">{count}</div>
						<div class="mt-4">{title}</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="flex flex-wrap w-1/2 mx-auto">
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
		</div>
		<div class="text-white text-4xl text-center mx-auto my-40">TODO ....</div>
	</div>
</div>
