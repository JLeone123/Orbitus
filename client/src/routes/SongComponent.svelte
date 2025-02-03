<script>
	export let song = [];
	let imageUrl = song.imageUrl;
	let audioUrl = song.audioUrl;
	let audio = new Audio(audioUrl);

	let isPlaying = false;

	// export let songImage = 'cozy-concert-and-microphone-2-pixabey.jpeg';

	// If the MP3 File is not stored locally, then
	// use the default MP3 file that for now is
	// 'Early Hours' by 'Justin Lee'
	// export let songMp3 = 'stored_songs/indie/early-hours-justin-lee-main-version-21967-01-54.mp3';

	// import object stores
	import { imageStore } from './images.js';
	import { mp3Store } from './songs.js';

	// import module to get correct file locations
	// can change this or remove it if migrating
	// binary files to Amazon S3
	import { getFilePaths } from './updateFilePaths.js';

	// let id = `${song['song_name']}-${song['artist_name']}`;
	// id = id.trim().split(' ').join('').toLowerCase();

	// let updatedFilePaths = getFilePaths(song, songImage, songMp3, imageStore, mp3Store);
	// let imageName = updatedFilePaths[0][0];
	// let mp3File = updatedFilePaths[1][1];

	// let updatedFilePaths;
	// let imageName;
	// let mp3File;

	// Need reactive block here to update the image and mp3 file paths for any updated songs
	// to properly re-render the screen.
	// $: {
	// 	song = song;
	// 	updatedFilePaths = getFilePaths(song, songImage, songMp3, imageStore, mp3Store);
	// 	imageName = updatedFilePaths[0][0];
	// 	mp3File = updatedFilePaths[1][1];
	// }

	// let playingSong = new Audio(mp3File);

	// $: {
	// 	mp3File = mp3File;
	// 	playingSong = new Audio(mp3File);
	// }

	// const togglePlay = () => {
	// 	let a = document.getElementById(`${id}-tag`);
	// 	let isPlaying = a.getAttribute('is-playing');
	// 	let isPlayingBoolean = false;

	// 	if (isPlaying === 'false') {
	// 		isPlayingBoolean = false;
	// 	} else {
	// 		isPlayingBoolean = true;
	// 	}

	// 	if (!isPlayingBoolean) {
	// 		playingSong.play();
	// 	} else {
	// 		playingSong.pause();
	// 	}

	// 	a.setAttribute('is-playing', !isPlayingBoolean);
	// 	return;
	// };

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
		<!-- <div class="col mt-5 border-0 song-component"> -->
		<button class="song-component-button border border-0 rounded" on:click={toggleAudio}>
			<img src={imageUrl} alt="Song cover" class="song-component-image rounded" />
		</button>
		<!-- </div> -->
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
		/* background-color: antiquewhite; */
		display: flex;
		width: 100%;
	}
	.song-component-button {
		box-sizing: border-box;
		/* background: #111827; */
		background: #212529;
		margin-bottom: 1rem;
		/* margin-right: 1rem; */
	}
	.song-component-image {
		box-sizing: border-box;
		height: 10rem;
		width: 10rem;
		transition: 0.25s;
		outline: none;
	}

	/* .song-component-characteristics {
		margin-left: 3rem;
	} */

	.song-component-image:hover {
		box-shadow: 0 0 2rem rgb(15, 15, 15);
		transform: translateY(-3px);
	}
</style>
