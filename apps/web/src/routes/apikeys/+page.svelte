<script lang="ts">
	import { sign } from 'hono/jwt';
	import { user, signed } from '$lib/client/store';
	import { onMount } from 'svelte';
	import AddKeyIcon from '$lib/components/ui/icons/AddKeyIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import CloseEyeIcon from '$lib/components/ui/icons/CloseEyeIcon.svelte';
	import OpenEyeIcon from '$lib/components/ui/icons/OpenEyeIcon.svelte';
	import DisableKeyIcon from '$lib/components/ui/icons/DisableKeyIcon.svelte';
	import EnableKeyIcon from '$lib/components/ui/icons/EnableKeyIcon.svelte';
	import { getApikeyList, insertApikey, changeApikey } from '$lib/client/secretService';
	import { modal, toast } from '$lib/client/popup';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import CopyClipBoard from '$lib/components/CopyClipBoard.svelte';
	import CopyIcon from '$lib/components/ui/icons/CopyIcon.svelte';
	import { goto } from '$app/navigation';
	const modalStore = getModalStore();
	const toastStore = getToastStore();
	let apiKey = '';
	let apiKeyPlaceholder = '*'.repeat(120);
	let showKey = false;
	let apiKeys = [];
	let disabled = false;
	onMount(() => {
		getList();
	});
	const generateHandler = async () => {
		const result = await insertApikey({ fid: $user.fid });
		getList();
	};

	const getList = async () => {
		apiKeys = await getApikeyList($user.fid);
		if (apiKeys.length > 0) {
			apiKey = apiKeys[0].apiKey;
			disabled = apiKeys[0].disabled;
		} else {
			showKey = true;
		}
	};

	const disableHandler = async () => {
		modal.confirm(
			modalStore,
			'Confirm',
			`Are you sure to ${disabled ? 'enable' : 'disable'}?`,
			'w-[500px]',
			async (r: boolean) => {
				if (r) {
					disabled = !disabled;
					await changeApikey($user.fid, disabled);
				}
			}
		);
	};

	const copyHandler = () => {
		const app = new CopyClipBoard({
			target: document.getElementById('tipsclipboard'),
			props: { text: apiKey }
		});
		app.$destroy();
		toast.success(toastStore, 'Copied!');
	};

	$: if (!$signed) {
		goto('/');
	}
</script>

<svelte:head>
	<title>My Api Key</title>
	<meta name="description" content="My Api Key" />
</svelte:head>

<section class="min-h-full m-4">
	<div class="w-full">
		<div class="flex justify-between">
			<div class="text-2xl font-bold">My Api Key</div>
		</div>

		<div class="mt-4">
			<div>
				<label class="flex items-center mb-6 label">
					<span class="w-[80px]">Api Key</span>
					<div class="flex items-center gap-2 relative">
						<textarea
							class="input rounded w-[400px] ml-2"
							rows="3"
							value={apiKey === '' ? apiKey : showKey ? apiKey : apiKeyPlaceholder}
							disabled
						/>
						<span
							class="cursor-pointer text-primary-500 hover:text-primary-100"
							on:click={() => (showKey = !showKey)}
						>
							{#if showKey}
								<svelte:component this={OpenEyeIcon} />
							{:else}
								<svelte:component this={CloseEyeIcon} />
							{/if}
						</span>
						{#if disabled}
							<span
								class="badge border rounded border-warning-500 absolute -top-0 right-7 z-10 text-warning-500 rotate-12"
								>Disabled</span
							>
						{/if}
					</div>
				</label>
				<div class="flex items-center gap-8">
					<button
						class="text-white bg-secondary-500 p-2 flex items-center gap-2 rounded-lg font-bold"
						on:click={generateHandler}
						disabled={apiKeys.length > 0}
					>
						<svelte:component this={AddKeyIcon} />
						Gernate Key
					</button>

					<button
						class="text-white bg-secondary-500 p-2 flex items-center gap-2 rounded-lg font-bold hover:variant-soft-secondary"
						on:click={disableHandler}
						disabled={apiKeys.length === 0}
					>
						{#if disabled}
							<svelte:component this={EnableKeyIcon} />
							Enable Key
						{:else}
							<svelte:component this={DisableKeyIcon} />
							Disable Key
						{/if}
					</button>
					{#if showKey}
						<button
							class="text-white bg-secondary-500 p-2 flex items-center gap-2 rounded-lg font-bold hover:variant-soft-secondary"
							on:click={copyHandler}
							disabled={!(showKey && apiKey)}
						>
							<svelte:component this={CopyIcon} />
							Copy Key
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>

<div id="tipsclipboard"></div>
