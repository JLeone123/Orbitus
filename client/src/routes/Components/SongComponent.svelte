<script>
	export let song = [];
	let imageUrl = song.imageUrl;
	let audioUrl = song.audioUrl;
	let audio = new Audio(audioUrl);

	let isPlaying = false;

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
		if (isPlaying) {
			// pause audio
			audio.pause();
		} else {
			// play audio
			audio.play();
		}

		isPlaying = !isPlaying;
	};
</script>

<div class="row song-component">
	<div class="col-4">
		<button class="song-component-button border border-0 rounded" on:click={toggleAudio}>
			<img src={imageUrl} alt="Song cover" class="song-component-image rounded" />
		</button>
	</div>
	<div class="col-8 song-component-characteristics">
		<div class="row">
			<div class="col">
				<p>"{song['title']}" by {song['artist_name']} ({song['genre']})</p>
				<p class="characteristics-text">Characteristics</p>
			</div>
		</div>
		<ul>
			<li>Positivity: {song['positivity']}</li>
			<li>Energy: {song['energy']}</li>
			<li>Rhythm: {song['rhythm']}</li>
			<li>Liveliness: {song['liveliness']}</li>
		</ul>
	</div>
</div>

<style>
	.song-component {
		display: flex;
		width: 100%;
	}
	.song-component-button {
		box-sizing: border-box;
		/* background: #111827; */
		background: #212529;
		margin-bottom: 1rem;
	}
	.song-component-image {
		box-sizing: border-box;
		height: 10rem;
		width: 10rem;
		transition: 0.25s;
		outline: none;
	}

	.song-component-image:hover {
		box-shadow: 0 0 2rem rgb(15, 15, 15);
		transform: translateY(-3px);
	}
</style>
