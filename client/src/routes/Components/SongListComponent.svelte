<script>
	import SongComponent from './SongComponent.svelte';
	import SpinningLoader from './SpinningLoader.svelte';
	import { onMount } from 'svelte';
	import { SongStore } from '../stores-folder/store.js';
	import { FetchingStore } from '../stores-folder/fetchingStore.js';
	import { fetchSongs } from '../hooks/fetchSongs.js';

	export let songList = [];
	$: innerWidth = 0;

	SongStore.subscribe((_songList) => {
		songList = _songList;
	});

	let isFetching = false;

	FetchingStore.subscribe((_isFetching) => {
		isFetching = _isFetching;
	});

	onMount(async () => {
		FetchingStore.set(true);
		innerWidth = window.innerWidth;
		// Send a GET request to the query service to
		// get a list of all the songs in the database
		// with their mp3 audio and cover art presigned
		// URLs from AWS CloudFront
		await fetchSongs();
		FetchingStore.set(false);
	});

	// Add reactive statement to update the
	// UI when the current song list on the
	// screen changes
	$: songList;
	$: isFetching;
	$: innerWidth;
</script>

<svelte:window bind:innerWidth />

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
				{#if innerWidth > 800}
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
				{:else}
					<div class="col-8 d-flex justify-content-between">
						<span class="column-header">
							<p class="song-genre-header">Song / Genre</p>
						</span>
						<span class="column-header">
							<p>Duration</p>
						</span>
					</div>
				{/if}
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
											index={index + 1}
											{song}
											songId={song['song_id']}
											artistId={song['artist_id']}
										/>
									</li>
								</div>
							</div>
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

	@media (max-width: 800px) {
		.song-genre-header {
			position: relative;
			left: 1rem;
		}
	}
</style>
