<script lang="ts">
	import DiscordIcon from './ui/icons/DiscordIcon.svelte';
	import GithubIcon from './ui/icons/GithubIcon.svelte';
	import TwitterIcon from './ui/icons/TwitterIcon.svelte';
</script>

<footer id="page-footer" class="flex-none">
	<div
		class="page-footer bg-surface-50 dark:bg-surface-900 border-t border-surface-500/10 text-xs md:text-base"
	>
		<div class="w-full max-w-7xl mx-auto p-4 py-16 md:py-24 space-y-10">
			<section
				class="flex flex-col md:flex-row justify-between items-center md:items-start space-y-5 md:space-y-0"
			>
				<div
					class="grid grid-cols-1 gap-2 place-content-center place-items-center md:place-items-start"
				>
					<img src="/images/logo.svg" alt="logo" class="h-10 w-10" />
					<p class="!text-sm opacity-80" data-svelte-h="svelte-1vcymyf">
						Farcaster flow for Token + NFT.
					</p>
					<span class="badge variant-soft">0.0.1</span>
				</div>
				<div class="hidden md:grid grid-cols-3 gap-8" data-svelte-h="svelte-euzn36">
					<div class="space-y-6">
						<h6 class="h6">Explore</h6>
						<ul class="space-y-3">
							<li><a class="anchor" href="n">Introduction</a></li>
							<li><a class="anchor" href="">Get Started</a></li>
							<li><a class="anchor" href="">Blog</a></li>
						</ul>
					</div>
					<div class="space-y-6">
						<h6 class="h6">Features</h6>
						<ul class="space-y-3">
							<li><a class="anchor" href="">Farcaster</a></li>
							<li><a class="anchor" href="">Sveltekit</a></li>
							<li><a class="anchor" href="">Smart Wallet</a></li>
						</ul>
					</div>
					<div class="space-y-6">
						<h6 class="h6">Project</h6>
						<ul class="space-y-3">
							<li>
								<a
									class="anchor"
									href="https://github.com/smartTokenLabs"
									target="_blank"
									rel="noreferrer">Github Organization</a
								>
							</li>
						</ul>
					</div>
				</div>
			</section>
			<hr class="opacity-20" />
			<section
				class="flex flex-col md:flex-row justify-between items-center md:items-start space-y-4 md:space-y-0"
			>
				<p data-svelte-h="svelte-eh0jpm">
					<a class="anchor" href="DTeam-Top/ff/blob/main/README.md" target="_blank" rel="noreferrer"
						>MIT License</a
					> <span class="opacity-10 mx-2">|</span>
					<a class="anchor" href="https://smarttokenlabs.com/" target="_blank" rel="noreferrer"
						>SmartToken Labs</a
					>
				</p>
				<div class="flex gap-6">
					<a
						class="opacity-75 hover:opacity-100"
						href="https://github.com/DTeam-Top/ff"
						target="_blank"
						rel="noreferrer"
						title="GitHub"
						><svelte:component this={GithubIcon} />
					</a><a
						class="opacity-75 hover:opacity-100"
						href=""
						target="_blank"
						rel="noreferrer"
						title="Discord"
						><svelte:component this={DiscordIcon} />
					</a><a
						class="opacity-75 hover:opacity-100"
						href="https://x.com/"
						target="_blank"
						rel="noreferrer"
						title="X (Twitter)"
						><svelte:component this={TwitterIcon} />
					</a>
				</div>
			</section>
		</div>
	</div>
</footer>
