<script lang="ts">
	import { getStaticsCount } from '$lib/client/flowService';
	import Button from './Button.svelte';
	import Footer from './Footer.svelte';

	let statistics: any[] = [];
	$: {
		getStaticsCount(undefined).then((count) => {
			statistics = [...count.banner, ...count.card];
		});
	}
</script>

<div class="flex flex-wrap">
	<div
		class="grid grid-cols-2 gap-12 items-start w-full mx-auto max-w-[1200px] mx-auto items-center mt-20"
	>
		<div class="space-y-4">
			<h2 class="h2">
				Distributing Tokens <br />Like A <span class="text-primary-500">Flow</span>.
			</h2>
			<p class="py-4">
				This is the decription of facaster flow is the decription of facaster flow...<br />This is
				the decription of facaster flow.....
			</p>
			<Button title="Browse" cssClass="bg-primary-500 text-black mr-4 " width="w-[150px]" />
		</div>
		<div class="">
			<div
				class="shadow-2xl shadow-surface-500/10 dark:shadow-black/10 rounded-container-token overflow-hidden"
			>
				<div class="p-4 bg-gradient-to-br variant-gradient-primary-secondary">
					<img
						src="/images/placeholder.png"
						class="bg-gray-300 rounded w-full h-[300px]"
						alt="image"
					/>
				</div>
			</div>
		</div>
	</div>
	<div class="w-full py-40">
		<div class="max-w-[1024px] mx-auto">
			<div class="flex flex-col lg:flex-row justify-center items-center gap-10 text-center">
				{#each statistics as { title, count }, i}
					<div class="space-y-1">
						<span class="block font-heading-token text-8xl font-bold w-[150px]">{count}</span>
						<p class="block opacity-50 text-primary-300">{title}</p>
					</div>
					{#if i + 1 < statistics.length}
						<div
							class="border-t lg:border-t-0 lg:border-l border-surface-500/50 w-20 lg:w-1 lg:h-20"
						></div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</div>
<Footer />
