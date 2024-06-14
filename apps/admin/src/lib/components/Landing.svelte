<script lang="ts">
	import { getStaticsCount } from '$lib/client/flowService';

	let statistics: any[] = [];
	let frameList: any[] = [];
	$: {
		getStaticsCount(undefined).then((count) => {
			statistics = [...count.banner, ...count.card];
		});
	}
</script>

<div class="flex flex-wrap h-full">
	<div class="w-full py-6 px-6">
		<div class="my-10">
			<div class="flex flex-col lg:flex-row justify-center items-center gap-10 text-center">
				{#each statistics as { title, count }, i}
					<div class="space-y-1">
						<span class="block font-heading-token text-8xl font-bold w-[150px]">{count}</span>
						<p class="block opacity-50">{title}</p>
					</div>
					{#if i + 1 < statistics.length}
						<div
							class="border-t lg:border-t-0 lg:border-l border-surface-500/50 w-20 lg:w-1 lg:h-20"
						></div>
					{/if}
				{/each}
			</div>
		</div>

		<div class="text-white text-4xl text-center mx-auto my-40">TODO ....</div>
	</div>
</div>
