<script>
	import SongComponent from './SongComponent.svelte';
	import SpinningLoader from './SpinningLoader.svelte';
	import { onMount } from 'svelte';
	import { SongStore } from '../stores-folder/store.js';

	export let songList = [];

	let counter = 0;

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

<div class="song-list-component row">
	{#if isFetching === true}
		<SpinningLoader />
	{:else}
		<div class="col-12">
			<div class="row">
				<div class="col-4 d-flex justify-content-between">
					<span class="column-header">
						<p>#</p>
					</span>
				</div>
				<div class="col-8 d-flex justify-content-between">
					<span class="column-header">
						<p>Song / Genre</p>
					</span>
					<span class="column-header">
						<p>Characteristics</p>
					</span>
					<span class="column-header">
						<p>Duration</p>
					</span>
				</div>
			</div>
			<div class="row">
				<div class="col-12">
					<hr class="main-header-divider" />
				</div>
			</div>
			<div class="row">
				<div class="col-12">
					<ul class="song-list-component__list col-12">
						{#each songList as song, index (song['id'])}
							<div class="row">
								<div class="col-12">
									<li>
										<SongComponent
											{index}
											{song}
											songId={song['song_id']}
											artistId={song['artist_id']}
										/>
									</li>
								</div>
							</div>
							<!-- <div class="row">
								<div class="col-12">
									{#if index < songList.length}
										<hr class="song-list-component-divider" />
									{/if}
								</div>
							</div> -->
						{/each}
					</ul>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.song-list-component__list {
		list-style: none;
	}

	.main-header-divider {
		margin: 0 auto 1rem 0;
	}

	.column-header {
		margin: 0;
		padding: 0 1rem;
		color: rgba(255, 255, 255, 0.65);
	}
</style>
