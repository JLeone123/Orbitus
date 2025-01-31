<script>
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

	const handleUpdateForm = async () => {
		let genre = document.getElementById('u-genre-input').value;
		if (genre !== 'Choose genre...') {
			genre = genre.slice(2);
		} else {
			console.log('The genre provided is not a supported type');
			return;
		}

		const formData = new FormData();
		formData.append('genre', genre);
		formData.append('songName', document.getElementById('u-song-name-input').value);
		formData.append('artistName', document.getElementById('u-artist-name-input').value);
		formData.append('positivity', document.getElementById('u-song-positivity-score').value);
		formData.append('energy', document.getElementById('u-song-energy-score').value);
		formData.append('rhythm', document.getElementById('u-song-rhythm-score').value);
		formData.append('liveliness', document.getElementById('u-song-liveliness-score').value);
		formData.append('mp3Audio', mp3Audio);
		formData.append('songCover', songCover);
		formData.append('eventType', 'SongCreated');

		let res = await fetch('http://localhost:4002/api/song', {
			method: 'PUT',
			mode: 'cors',
			body: formData
		});

		let resJson = await res.json();

		document.getElementById('u-genre-input').value = '';
		document.getElementById('u-song-name-input').value = '';
		document.getElementById('u-artist-name-input').value = '';
		document.getElementById('u-mp3-audio-input').value = '';
		document.getElementById('u-song-cover-input').value = '';
		document.getElementById('u-song-positivity-score').value = '';
		document.getElementById('u-song-energy-score').value = '';
		document.getElementById('u-song-rhythm-score').value = '';
		document.getElementById('u-song-liveliness-score').value = '';
		return;

		// Get genre, song name, artist name, MP3 File, image artwork file,
		// and the song's positivity, energy, rhythm, and liveliness scores

		// For the genre input, trim the first two characters off of the input
		// I named the genre inputs in the form of u-"genre" to avoid matching
		// values and types of other input tags - just a precaution but probably
		// one that I do not need to take.
		// let genre = document.getElementById('u-genre-input').value.slice(2);
		let songName = document.getElementById('u-song-name-input').value;
		let artistName = document.getElementById('u-artist-name-input').value;
		let mp3File = document.getElementById('u-mp3-file-input').value;
		let imageArt = document.getElementById('u-image-artwork-input').value;
		let positivity = Number(document.getElementById('u-song-positivity-score').value);
		let energy = Number(document.getElementById('u-song-energy-score').value);
		let rhythm = Number(document.getElementById('u-song-rhythm-score').value);
		let liveliness = Number(document.getElementById('u-song-liveliness-score').value);

		// sanitizing inputs

		// sanitizing genre
		if (
			genre !== 'indie' &&
			genre !== 'folk' &&
			genre !== 'country' &&
			genre !== 'classical' &&
			genre !== 'rock' &&
			genre !== 'chillhop / lofi' &&
			genre !== 'punk'
		) {
			console.log('The genre provided is not a supported type');
			return;
		}

		// // sanitizing songName, artistName, mp3File, and imageArt
		if (
			songName === undefined ||
			artistName === undefined ||
			mp3File === undefined ||
			imageArt === undefined
		) {
			console.log('The songName, artistName, mp3File, or imageArt is undefined');
			return;
		}

		if (
			typeof songName !== 'string' ||
			typeof artistName !== 'string' ||
			typeof mp3File !== 'string' ||
			typeof imageArt !== 'string'
		) {
			console.log('The songName, artistName, mp3File, or imageArt is not a string');
		}

		if (
			songName.trim().length === 0 ||
			artistName.trim().length === 0 ||
			mp3File.trim().length === 0 ||
			imageArt.trim().length === 0
		) {
			console.log('The songName, artistName, mp3File, or imageArt is an empty string');
			return;
		}

		// // sanitizing positivity, energy, rhythm, and liveliness scores
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

		// // Define SongUpdated event object to send to the event-bus
		let event = {
			event: {
				type: 'SongUpdated',
				data: {
					genre,
					songName,
					artistName,
					mp3File,
					imageArt,
					positivity,
					energy,
					rhythm,
					liveliness
				}
			}
		};

		// // Send SongCreated event to the event-bus
		let sentEventClient = await fetch('http://localhost:4005/events', {
			method: 'PUT',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(event)
		});

		// // Can do client-side error handling here
		let sentEventClientJson = await sentEventClient.json();

		if (sentEventClientJson === undefined) {
			console.log('ISE: The song could not be deleted in the database');
			return;
		}

		if (
			sentEventClientJson.hasOwnProperty('msg') &&
			sentEventClientJson['msg'] === 'The song was not found in the database'
		) {
			console.log('404: The song was not found in the database');
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

		// The default error was returned to the client service from the event-bus
		if (sentEventClientJson.hasOwnProperty('msg')) {
			console.log(sentEventClient['msg']);
			return;
		}

		// if updating the song is successful,
		// then update the SongStore to re-render client

		// query service endpoint to get all songs
		let allSongs = await fetch('http://localhost:4002/allSongs', {
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
		const allSongsData = await allSongs.json();

		// If allSongsData is undefined, then
		// do not update the store to maintain data
		// integrity

		// If allSongsData is defined, then update
		// the SongStore to maintain data integrity
		if (allSongsData !== undefined) {
			let index = -1;

			SongStore.update((_songs) => {
				let SongStore = _songs;
				let sn = document.getElementById('u-song-name-input').value;
				let an = document.getElementById('u-artist-name-input').value;

				SongStore.forEach((s, i) => {
					if (s['song_name'] === sn && s['artist_name'] === an) {
						index = i;
					}
				});

				SongStore[index]['genre'] = sentEventClientJson['updatedSong']['genre'];
				SongStore[index]['song_name'] = sentEventClientJson['updatedSong']['songName'];
				SongStore[index]['artist_name'] = sentEventClientJson['updatedSong']['artistName'];
				SongStore[index]['mp3_file'] = sentEventClientJson['updatedSong']['mp3File'];
				SongStore[index]['image_art'] = sentEventClientJson['updatedSong']['imageArt'];
				SongStore[index]['positivity'] = sentEventClientJson['updatedSong']['positivity'];
				SongStore[index]['energy'] = sentEventClientJson['updatedSong']['energy'];
				SongStore[index]['rhythm'] = sentEventClientJson['updatedSong']['rhythm'];
				SongStore[index]['liveliness'] = sentEventClientJson['updatedSong']['liveliness'];

				SongStore = SongStore;

				return SongStore;
			});

			document.getElementById('u-genre-input').value = '';
			document.getElementById('u-song-name-input').value = '';
			document.getElementById('u-artist-name-input').value = '';
			document.getElementById('u-mp3-file-input').value = '';
			document.getElementById('u-image-artwork-input').value = '';
			document.getElementById('u-song-positivity-score').value = '';
			document.getElementById('u-song-energy-score').value = '';
			document.getElementById('u-song-rhythm-score').value = '';
			document.getElementById('u-song-liveliness-score').value = '';
		}
	};
</script>

<!-- Update Song Modal Component -->

<div
	class="modal fade"
	id="updateSongModal"
	tabindex="-1"
	aria-labelledby="updateSongModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h1 class="modal-title fs-5" id="updateSongModalLabel">Update a song</h1>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div class="input-group mb-3">
					<label class="input-group-text" for="u-genre-input">
						<i class="bi bi-disc-fill"></i>
					</label>
					<select class="form-select" id="u-genre-input">
						<option selected>Choose genre...</option>
						<option value="u-indie">Indie</option>
						<option value="u-folk">Folk</option>
						<option value="u-country">Country</option>
						<option value="u-classical">Classical</option>
						<option value="u-rock">Rock</option>
						<option value="u-chillhop / lofi">Chillhop / Lofi</option>
						<option value="u-punk">Punk</option>
					</select>
				</div>
				<!-- Song Metadata -->
				<div class="row g-2">
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="u-song-name-icon">
								<i class="bi bi-music-player-fill"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="u-song-name-input"
									placeholder="Song name"
									aria-label="Song name"
									aria-describedby="u-song-name-icon"
									required
								/>
								<label for="u-song-name-input">Song name</label>
							</div>
						</div>
					</div>
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="u-artist-name-icon">
								<i class="bi bi-rocket-takeoff-fill"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="u-artist-name-input"
									placeholder="Artist name"
									aria-label="Artist name"
									aria-describedby="u-artist-name-icon"
									required
								/>
								<label for="u-artist-name-input">Artist name</label>
							</div>
						</div>
					</div>
				</div>

				<!-- <div class="row g-2">
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="u-mp3-file-icon">
								<i class="bi bi-file-bar-graph"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="u-mp3-file-input"
									placeholder="MP3 File"
									aria-label="MP3 file"
									aria-describedby="u-mp3-file-input"
									required
								/>
								<label for="u-mp3-file-input">MP3 File</label>
							</div>
						</div>
					</div>
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="u-image-artwork-icon">
								<i class="bi bi-display"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="u-image-artwork-input"
									placeholder="Image artwork"
									aria-label="Image artwork"
									aria-describedby="u-image-artwork-input"
									required
								/>
								<label for="u-image-artwork-input">Image artwork</label>
							</div>
						</div>
					</div>
				</div> -->

				<hr />

				<!-- Song characteristics -->
				<div class="row g-2">
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="u-song-positivity-score-icon">
								<i class="bi bi-sun-fill"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="u-song-positivity-score"
									placeholder="Positivity"
									aria-label="Positivity"
									aria-describedby="u-song-positivity-score"
									required
								/>
								<label for="u-song-positivity-score">Positivity</label>
							</div>
						</div>
					</div>
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="u-song-energy-score-icon">
								<i class="bi bi-lightning-charge-fill"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="u-song-energy-score"
									placeholder="Energy"
									aria-label="Energy"
									aria-describedby="u-song-energy-score"
									required
								/>
								<label for="u-song-energy-score">Energy</label>
							</div>
						</div>
					</div>
				</div>

				<div class="row g-2">
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="u-song-rhythm-score-icon">
								<i class="bi bi-fire"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="u-song-rhythm-score"
									placeholder="Rhythm"
									aria-label="Rhythm"
									aria-describedby="u-song-rhythm-score"
									required
								/>
								<label for="u-song-rhythm-score">Rhythm</label>
							</div>
						</div>
					</div>
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="u-song-liveliness-score-icon">
								<i class="bi bi-speaker"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="u-song-liveliness-score"
									placeholder="liveliness"
									aria-label="liveliness"
									aria-describedby="u-song-liveliness-score"
									required
								/>
								<label for="u-song-liveliness-score">Liveliness</label>
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
								id="u-mp3-audio-input"
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
								id="u-song-cover-input"
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
					on:click={handleUpdateForm}>Save changes</button
				>
			</div>
		</div>
	</div>
</div>
