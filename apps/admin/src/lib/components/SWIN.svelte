<script lang="ts">
	import { browser } from '$app/environment';
	import { PUBLIC_CLIENT_ID } from '$env/static/public';
	import { USER_STORE_KEY } from '$lib/services/constants';
	import { getCaster } from '$lib/services/casterService';
	import { setItem } from '$lib/services/utils';
	import { Hono } from 'hono';
	import { onDestroy, onMount } from 'svelte';
	onDestroy(() => {
		if (browser) {
			delete window.onSignInSuccess;
		}
	});

	onMount(() => {
		let script = document.getElementById('siwn-script') as HTMLScriptElement | null;

		if (!script) {
			script = document.createElement('script');
			script.id = 'siwn-script';
			document.body.appendChild(script);
		}

		script.src = 'https://neynarxyz.github.io/siwn/raw/1.2.0/index.js';
		script.async = true;
		script.defer = true;

		document.body.appendChild(script);

		window.onSignInSuccess = async (data) => {
			const callbackData = {
				signerUuid: data.signer_uuid,
				fid: data.fid
			};
			setItem(USER_STORE_KEY, window, JSON.stringify(callbackData));
			await getCaster(callbackData);
		};
		const signDiv = document.getElementById('sign');

		let neynarDiv = document.getElementById('neynar_signin');
		if (neynarDiv !== null) {
			return;
		}

		neynarDiv = document.createElement('div');
		neynarDiv.classList = ['neynar_signin'];
		neynarDiv.setAttribute('data-client_id', PUBLIC_CLIENT_ID);
		neynarDiv.setAttribute('data-success-callback', 'onSignInSuccess');
		//neynarDiv.setAttribute("data-theme", "light");
		neynarDiv.setAttribute('data-variant', 'farcaster');
		neynarDiv.setAttribute('data-background_color', 'transparent');
		neynarDiv.setAttribute('data-styles', `{ "borderColor": "white","borderWidth":"1px" }`);
		neynarDiv.setAttribute('data-color', '#ffffff');
		signDiv?.appendChild(neynarDiv);
	});
</script>

<div id="sign"></div>
