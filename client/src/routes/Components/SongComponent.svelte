<script>
	import { CurrentlyPlayingSongStore } from '../stores-folder/currentlyPlayingSongStore.js';

	export let song = [];
	export let songId = '';
	export let artistId = '';
	export let index = 0;
	let imageUrl = song.imageUrl;
	let audioUrl = song.audioUrl;
	let audio = new Audio(audioUrl);
	let isPlaying = false;
	$: innerWidth = window.innerWidth; // can remove
	audio.setAttribute('id', `${songId}-${artistId}`);

	let duration = 0;
	let time = '';

	audio.addEventListener('loadedmetadata', () => {
		duration = audio.duration;
		let minutes = Math.floor(audio.duration / 60);
		let seconds =
			duration - Math.floor(duration) >= 0.5 ? Math.ceil(duration % 60) : Math.floor(duration % 60);
		time = seconds >= 10 ? `${minutes}:${seconds}` : `${minutes}:0${seconds}`;
	});

	let currentlyPlayingSong = {};

	// Update the currently playing song
	CurrentlyPlayingSongStore.subscribe((_currentlyPlayingSong) => {
		currentlyPlayingSong = _currentlyPlayingSong;
		currentlyPlayingSong = currentlyPlayingSong;
		return currentlyPlayingSong;
	});

	// If the MP3 File is not stored, then
	// the default MP3 file that can be used
	// for now is 'Early Hours' by 'Justin Lee'
	// Can set this at some point.

	// import module to get correct file locations
	// can change this or remove it if migrating
	// binary files to Amazon S3
	// import { getFilePaths } from './updateFilePaths.js';

	const toggleAudio = (e) => {
		e.preventDefault();

		CurrentlyPlayingSongStore.update((_currentlyPlayingSong) => {
			let currentSong = _currentlyPlayingSong;
			// playing first song
			if (typeof currentSong === 'object' && !currentSong['id']) {
				audio.play();
				isPlaying = true;
				// playing a different song while another is playing
			} else if (
				typeof currentSong === 'object' &&
				currentSong['id'] &&
				audio['id'] !== currentSong['id'] &&
				isPlaying
			) {
				currentSong.pause();
				currentSong.currentTime = 0;
				audio.play();
			} else if (
				typeof currentSong === 'object' &&
				currentSong['id'] &&
				audio['id'] !== currentSong['id'] &&
				!isPlaying
			) {
				currentSong.pause();
				currentSong.currentTime = 0;
				audio.play();
				isPlaying = true;
			} else if (
				typeof currentSong === 'object' &&
				currentSong['id'] === audio['id'] &&
				isPlaying
			) {
				currentSong.currentTime = 0;
				audio.pause();
				isPlaying = false;
			} else if (
				typeof currentSong === 'object' &&
				currentSong['id'] === audio['id'] &&
				!isPlaying
			) {
				currentSong.currentTime = 0;
				audio.play();
				isPlaying = true;
			}
			return audio;
		});
	};

	$: time; // can remove
</script>

<svelte:window bind:innerWidth />

<div class="row song-component-row d-flex align-items-center justify-content-start">
	<div class="col-1 gx-0 song-component-col d-flex text-secondary-emphasis number-text-col">
		<p class="number-text">({index})</p>
	</div>
	<div class="col-3 gx-0 song-component-col d-flex">
		<button class="song-component-button border border-0 rounded" on:click={toggleAudio}>
			<img src={imageUrl} alt="Song cover" class="song-component-image rounded" />
		</button>
	</div>
	{#if innerWidth > 800}
		<div class="col-8 song-component-col d-flex flex-row justify-content-between">
			<div class="row song-metadata-row d-flex flex-row w-100">
				<div class="col song-metadata-col d-flex align-items-center">
					<p>
						<span class="song-metadata-col__title">{song['title']}</span>
						<span class="song-metadata-col__genre text-secondary-emphasis">({song['genre']})</span>
					</p>
				</div>
				<div
					class="col song-characteristics-col d-flex flex-column align-items-end
			song-characteristics-group-col"
				>
					<ul
						class="song-characteristics-group list-group text-secondary-emphasis
				d-flex flex-column"
					>
						<li>Positivity: {song['positivity']}</li>
						<li>Energy: {song['energy']}</li>
						<li>Rhythm: {song['rhythm']}</li>
						<li>Liveliness: {song['liveliness']}</li>
					</ul>
				</div>
				<div class="col song-characteristics-col d-flex justify-content-end">
					<p class="duration-text text-secondary-emphasis">{time}</p>
				</div>
			</div>
		</div>
	{:else}
		<div
			class="col-8 song-component-col song-component-col-md d-flex flex-row justify-content-center"
		>
			<div class="row song-metadata-row d-flex flex-row w-100">
				<div class="col song-metadata-col d-flex align-items-center">
					<p>
						<span class="song-metadata-col__title">{song['title']}</span>
						<span class="song-metadata-col__genre text-secondary-emphasis">({song['genre']})</span>
					</p>
				</div>
				<div class="col song-characteristics-col duration-text-col d-flex justify-content-end">
					<p class="duration-text text-secondary-emphasis">{time}</p>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.song-component-row {
		padding-bottom: 1.25rem;
		font-family: 'Inter';
	}

	.song-metadata-col__title {
		color: rgb(222, 226, 230);
	}

	.number-text {
		font-weight: 400;
		letter-spacing: 0.1rem;
		position: relative;
		right: 0.65rem;
	}
	.song-component-button {
		box-sizing: border-box;
		background: #212529;
		padding: 0;
	}
	.song-component-image {
		box-sizing: border-box;
		height: 6rem;
		width: 6rem;
		transition: 0.25s;
		outline: none;
	}

	.song-characteristics-group {
		list-style: none;
		font-size: 1rem;
	}

	/* Can make the responsiveness smoother, this fixes the alignment
	of the song characteristics column for the time being */
	@media (max-width: 1300px) {
		.song-characteristics-group {
			list-style: none;
			font-size: 1rem;
			position: relative;
			left: 0.8rem;
		}
	}

	.song-component-image:hover {
		box-shadow: 0 0 0.75rem rgb(15, 15, 15);
		transform: translateY(-3px);
	}

	.song-metadata-col__title {
		font-size: 1rem;
	}

	.song-metadata-col__genre {
		font-size: 1rem;
	}

	.duration-text {
		position: relative;
		right: 0.4rem;
	}

	@media (max-width: 800px) {
		.duration-text {
			position: relative;
			right: 1rem;
		}
	}
</style>
