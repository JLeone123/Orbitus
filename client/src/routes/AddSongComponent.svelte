<script>
	import axios from 'axios';
	import { SongStore } from './store.js';
	import { Mp3Store } from './mp3Store.js';
	import { SongCoverStore } from './songCoverStore.js';

	let mp3Audio = new File([], '');
	let songCover = new File([], '');

	Mp3Store.subscribe((_mp3) => {
		mp3Audio = _mp3;
	});

	SongCoverStore.subscribe((_songCover) => {
		songCover = _songCover;
	});

	const selectMp3Audio = (e) => {
		let mp3 = e.target.files[0];
		console.log(mp3);
		Mp3Store.set(mp3);
	};

	const selectSongCover = (e) => {
		let selectedSongCoverArt = e.target.files[0];
		SongCoverStore.set(selectedSongCoverArt);
	};

	const handleAddForm = async () => {
		let genre = document.getElementById('a-genre-input').value;

		// For the genre input, trim the first two characters off of the input
		// I named the genre inputs in the form of a-"genre" to avoid matching
		// values and types of other input tags - just a precaution but probably
		// one that I do not need to take.

		// If the genre is not a supported type, then do not submit
		// the form and just return.
		if (genre !== 'Choose genre...') {
			genre = genre.slice(2);
		} else {
			console.log('The genre provided is not a supported type');
			return;
		}

		const formData = new FormData();
		formData.append('genre', genre);
		formData.append('songName', document.getElementById('a-song-name-input').value);
		formData.append('artistName', document.getElementById('a-artist-name-input').value);
		formData.append('positivity', document.getElementById('a-song-positivity-score').value);
		formData.append('energy', document.getElementById('a-song-energy-score').value);
		formData.append('rhythm', document.getElementById('a-song-rhythm-score').value);
		formData.append('liveliness', document.getElementById('a-song-liveliness-score').value);
		formData.append('mp3Audio', mp3Audio);
		formData.append('songCover', songCover);
		formData.append('eventType', 'SongCreated');

		let songName = document.getElementById('a-song-name-input').value;
		let artistName = document.getElementById('a-artist-name-input').value;
		let positivity = Number(document.getElementById('a-song-positivity-score').value);
		let energy = Number(document.getElementById('a-song-energy-score').value);
		let rhythm = Number(document.getElementById('a-song-rhythm-score').value);
		let liveliness = Number(document.getElementById('a-song-liveliness-score').value);

		let res = await fetch('http://localhost:4002/api/song', {
			method: 'POST',
			mode: 'cors',
			body: formData
		});

		// let res = await fetch('http://localhost:4005/events', {
		// 	method: 'POST',
		// 	mode: 'cors',
		// 	body: formData
		// });

		let data = res.json();
		// console.log(data);

		document.getElementById('a-genre-input').value = '';
		document.getElementById('a-song-name-input').value = '';
		document.getElementById('a-artist-name-input').value = '';
		document.getElementById('a-mp3-audio-input').value = '';
		document.getElementById('a-song-cover-input').value = '';
		document.getElementById('a-song-positivity-score').value = '';
		document.getElementById('a-song-energy-score').value = '';
		document.getElementById('a-song-rhythm-score').value = '';
		document.getElementById('a-song-liveliness-score').value = '';
		return;

		// sanitizing genre
		// if (
		// 	genre !== 'indie' &&
		// 	genre !== 'folk' &&
		// 	genre !== 'country' &&
		// 	genre !== 'classical' &&
		// 	genre !== 'rock' &&
		// 	genre !== 'chillhop / lofi' &&
		// 	genre !== 'punk'
		// ) {
		// 	console.log('The genre provided is not a supported type');
		// 	return;
		// }

		// sanitizing songName, artistName, mp3File, and imageArt
		// if (
		// 	songName === undefined ||
		// 	artistName === undefined ||
		// 	mp3File === undefined ||
		// 	imageArt === undefined
		// ) {
		// 	console.log('The songName, artistName, mp3File, or imageArt is undefined');
		// 	return;
		// }

		// if (
		// 	typeof songName !== 'string' ||
		// 	typeof artistName !== 'string' ||
		// 	typeof mp3File !== 'string' ||
		// 	typeof imageArt !== 'string'
		// ) {
		// 	console.log('The songName, artistName, mp3File, or imageArt is not a string');
		// }

		// if (
		// 	songName.trim().length === 0 ||
		// 	artistName.trim().length === 0 ||
		// 	mp3File.trim().length === 0 ||
		// 	imageArt.trim().length === 0
		// ) {
		// 	console.log('The songName, artistName, mp3File, or imageArt is an empty string');
		// 	return;
		// }

		// sanitizing positivity, energy, rhythm, and liveliness scores
		if (
			positivity === undefined ||
			energy === undefined ||
			rhythm === undefined ||
			liveliness === undefined
		) {
			console.log(
				'The positivity score, energy score, rhythm score, or liveliness score is undefined'
			);
			return;
		}

		if (
			typeof positivity !== 'number' ||
			typeof energy !== 'number' ||
			typeof rhythm !== 'number' ||
			typeof liveliness !== 'number'
		) {
			console.log(
				'The positivity score, energy score, rhythm score, or liveliness score is not a number'
			);
			return;
		}

		if (positivity % 1 !== 0 || energy % 1 !== 0 || rhythm % 1 !== 0 || liveliness % 1 !== 0) {
			console.log(
				'The positivity score, energy score, rhythm score, or liveliness score is not a number'
			);
			return;
		}

		if (
			positivity < 0 ||
			positivity > 100 ||
			energy < 0 ||
			energy > 100 ||
			rhythm < 0 ||
			rhythm > 100 ||
			liveliness < 0 ||
			liveliness > 100
		) {
			let msg =
				'The positivity score, energy score, rhythm score, or liveliness score ' +
				'is either below zero or is greater than 100';
			console.log(msg);
			return;
		}

		// Define SongCreated event object to send to the event-bus
		// let event = {
		// 	event: {
		// 		type: 'SongCreated',
		// 		data: {
		// 			genre,
		// 			songName,
		// 			artistName,
		// 			mp3File,
		// 			imageArt,
		// 			positivity,
		// 			energy,
		// 			rhythm,
		// 			liveliness
		// 		}
		// 	}
		// };

		// // Send SongCreated event to the event-bus
		// let sentEventClient = await fetch('http://localhost:4005/events', {
		// 	method: 'POST',
		// 	mode: 'cors',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		Accept: 'application/json'
		// 	},
		// 	body: JSON.stringify(event)
		// });

		// Can do client-side error handling here
		let sentEventClientJson = await sentEventClient.json();

		if (sentEventClientJson === undefined) {
			console.log('ISE: The song could not be deleted in the database');
			return;
		}

		if (
			sentEventClientJson.hasOwnProperty('msg') &&
			sentEventClientJson['msg'] ===
				'A record with the same songName and artistName is already in the database'
		) {
			console.log('400: A record with the same songName and artistName is already in the database');
			return;
		}

		if (
			sentEventClientJson.hasOwnProperty('msg') &&
			sentEventClientJson['msg'] === 'ISE: the new song could not be added to the database'
		) {
			console.log('500: ISE - The song could not be deleted due to an internal service error');
			return;
		}

		if (
			sentEventClientJson.hasOwnProperty('msg') &&
			sentEventClientJson['msg'] === 'The Event Bus did not receive a response from port 4002'
		) {
			console.log('500: ISE - The song could not be deleted due to an internal service error');
			return;
		}

		document.getElementById('a-genre-input').value = '';
		document.getElementById('a-song-name-input').value = '';
		document.getElementById('a-artist-name-input').value = '';
		document.getElementById('a-mp3-file-input').value = '';
		document.getElementById('a-image-artwork-input').value = '';
		document.getElementById('a-song-positivity-score').value = '';
		document.getElementById('a-song-energy-score').value = '';
		document.getElementById('a-song-rhythm-score').value = '';
		document.getElementById('a-song-liveliness-score').value = '';

		// if adding the song is successful,
		// then update the SongStore to re-render client

		// query service endpoint to get all songs
		// let allSongs = await fetch('http://query:4002/allSongs', {
		// 	method: 'GET',
		// 	mode: 'cors',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		Accept: 'application/json'
		// 	}
		// });

		// Get list of all of the songs
		// with their image and mp3 file paths
		// by parsing the JSON response
		// const allSongsData = await allSongs.json();

		// If allSongsData is undefined, then
		// do not update the store to maintain data
		// integrity

		// If allSongsData is defined, then update
		// the SongStore to maintain data integrity
		// if (allSongsData !== undefined) {
		// 	SongStore.update((_songs) => {
		// 		let songStore = _songs;
		// 		let end = allSongsData['songs'].length - 1;
		// 		let newSong = allSongsData['songs'][end];

		// 		// Add the newly added song to the SongStore
		// 		// to rerender the client
		// 		songStore.push(newSong);

		// 		songStore = songStore;
		// 		return songStore;
		// 	});
		// }
	};
</script>

<!-- Add Song Modal Component -->

<div
	class="modal fade"
	id="addSongModal"
	tabindex="-1"
	aria-labelledby="addSongModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h1 class="modal-title fs-5" id="addSongModalLabel">Add a song</h1>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div class="input-group mb-3">
					<label class="input-group-text" for="a-genre-input">
						<i class="bi bi-disc-fill"></i>
					</label>
					<select class="form-select" id="a-genre-input">
						<option selected>Choose genre...</option>
						<option value="a-indie">Indie</option>
						<option value="a-folk">Folk</option>
						<option value="a-country">Country</option>
						<option value="a-classical">Classical</option>
						<option value="a-rock">Rock</option>
						<option value="a-chillhop / lofi">Chillhop / Lofi</option>
						<option value="a-punk">Punk</option>
					</select>
				</div>
				<!-- Song Metadata -->
				<div class="row g-2">
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="a-song-name-icon">
								<i class="bi bi-music-player-fill"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="a-song-name-input"
									placeholder="Song name"
									aria-label="Song name"
									aria-describedby="a-song-name-icon"
									required
								/>
								<label for="a-song-name-input">Song name</label>
							</div>
						</div>
					</div>
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="a-artist-name-icon">
								<i class="bi bi-rocket-takeoff-fill"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="a-artist-name-input"
									placeholder="Artist name"
									aria-label="Artist name"
									aria-describedby="a-artist-name-icon"
									required
								/>
								<label for="a-artist-name-input">Artist name</label>
							</div>
						</div>
					</div>
				</div>

				<!-- <div class="row g-2">
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="a-mp3-file-icon">
								<i class="bi bi-file-bar-graph"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="a-mp3-file-input"
									placeholder="MP3 File"
									aria-label="MP3 file"
									aria-describedby="a-mp3-file-input"
									required
								/>
								<label for="a-mp3-file-input">MP3 File</label>
							</div>
						</div>
					</div>
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="a-image-artwork-icon">
								<i class="bi bi-display"></i>
							</span>
							<div class="form-floating lol">
								<button
									class="lol-button"
									type="file"
									onclick="document.getElementById('a-image-artwork-input').click()"
								>
									<input
										type="file"
										class="form-control"
										id="a-image-artwork-input"
										placeholder="Image artwork"
										aria-label="Image artwork"
										aria-describedby="a-image-artwork-input"
										required
									/> <span class="image-input-text"> Choose image artwork... </span>
								</button>
								<label for="a-image-artwork-input" class="d-none">Image artwork</label>
							</div>
						</div>
					</div>
				</div> -->

				<hr />

				<!-- Song characteristics -->
				<div class="row g-2">
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="a-song-positivity-score-icon">
								<i class="bi bi-sun-fill"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="a-song-positivity-score"
									placeholder="Positivity"
									aria-label="Positivity"
									aria-describedby="a-song-positivity-score"
									required
								/>
								<label for="a-song-positivity-score">Positivity</label>
							</div>
						</div>
					</div>
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="a-song-energy-score-icon">
								<i class="bi bi-lightning-charge-fill"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="a-song-energy-score"
									placeholder="Energy"
									aria-label="Energy"
									aria-describedby="a-song-energy-score"
									required
								/>
								<label for="a-song-energy-score">Energy</label>
							</div>
						</div>
					</div>
				</div>

				<div class="row g-2">
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="a-song-rhythm-score-icon">
								<i class="bi bi-fire"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="a-song-rhythm-score"
									placeholder="Rhythm"
									aria-label="Rhythm"
									aria-describedby="a-song-rhythm-score"
									required
								/>
								<label for="a-song-rhythm-score">Rhythm</label>
							</div>
						</div>
					</div>
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="a-song-liveliness-score-icon">
								<i class="bi bi-speaker"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="a-song-liveliness-score"
									placeholder="liveliness"
									aria-label="liveliness"
									aria-describedby="a-song-liveliness-score"
									required
								/>
								<label for="a-song-liveliness-score">Liveliness</label>
							</div>
						</div>
					</div>
				</div>

				<hr />

				<div class="row g-2">
					<div class="col-md">
						<div class="mb-3">
							<label for="formFile" class="form-label">Upload MP3 audio</label>
							<input
								on:change={selectMp3Audio}
								class="form-control"
								type="file"
								accept="audio/*"
								id="a-mp3-audio-input"
							/>
						</div>
					</div>
					<div class="col-md">
						<div class="mb-3">
							<label for="formFile" class="form-label">Upload Song Cover</label>
							<input
								on:change={selectSongCover}
								class="form-control"
								type="file"
								accept="image/*"
								id="a-song-cover-input"
							/>
						</div>
					</div>
				</div>

				<!-- Modal footer and submit button -->
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				<button
					type="button"
					class="btn btn-primary"
					data-bs-dismiss="modal"
					on:click={handleAddForm}>Save changes</button
				>
			</div>
		</div>
	</div>
</div>

<style>
	/* .lol {
		height: 3.6rem; */
	/* background: #ef562f; */
	/* } */

	/* input[type='file'] {
		display: none;
		position: relative;
	} */

	/* .image-input-text {
		position: absolute;
		left: 0.8rem;
		top: 1.1rem;
		color: rgb(222, 226, 230);
	} */

	/* .lol-button { */
	/* box-sizing: border-box;
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		background: lightgreen; */
	/* box-sizing: border-box; */
	/* height: 100%;
		width: 100%;
		background: transparent;
		cursor: pointer; */
	/* border: none; */
	/* border-top: 1px solid #495057;
		border-right: 1px solid #495057;
		border-bottom: 1px solid #495057;
		border-left: none;
		border-radius: 0 0.3125rem 0.3125rem 0; */
	/* outline-top: 1px solid; */
	/* } */
</style>
