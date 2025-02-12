<script>
	import SongComponent from './SongComponent.svelte';
	import SpinningLoader from './SpinningLoader.svelte';
	import { onMount } from 'svelte';
	import { SongStore } from '../stores-folder/store.js';

	export let songList = [];

	SongStore.subscribe((_songList) => {
		songList = _songList;
	});

	let isFetching = false;

	onMount(async () => {
		// Send a GET request to the query service to
		// get a list of all the songs in the database
		// with their image and mp3 file paths

		// query service endpoint to get all songs
		try {
			isFetching = true;
			const res = await fetch('http://localhost:4002/api/songs', {
				method: 'GET',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			});

			// Get list of all of the songs
			// with their image and mp3 file paths
			// by parsing the JSON response
			const data = await res.json();

			if (data === undefined) {
				SongStore.set([]);
			} else {
				SongStore.update(() => (songList = data));
			}

			isFetching = false;
		} catch (e) {
			isFetching = false;
		}
	});
</script>

<div class="row-cols-1 song-list-component">
	{#if isFetching === true}
		<SpinningLoader />
	{:else}
		<ul class="song-list-component__list">
			{#each songList as song, index (song['id'])}
				<li>
					<SongComponent {song} />
				</li>

				{#if index <= songList.length - 1}
					<hr class="song-list-component-divider" />
				{/if}
			{/each}
		</ul>
	{/if}
</div>

<style>
	.song-list-component__list {
		list-style: none;
	}
</style>
