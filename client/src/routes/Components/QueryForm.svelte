<script>
	import { SongStore } from '../stores-folder/store.js';

	let songPositivityScore = 50.0;
	let songEnergyScore = 50.0;
	let songRhythmScore = 50.0;
	let songLivelinessScore = 50.0;

	const updateRangeValue = (event) => {
		let elementId = event.target.id;
		let rangeValue = event.target.value;

		switch (elementId) {
			case 'positivityRange':
				songPositivityScore = rangeValue;
				break;
			case 'energyRange':
				songEnergyScore = rangeValue;
				break;
			case 'rhythmRange':
				songRhythmScore = rangeValue;
				break;
			case 'livelinessRange':
				songLivelinessScore = rangeValue;
				break;
		}
	};

	const generatePlaylist = async (e) => {
		e.preventDefault();
		let genre = document.getElementById('genre-select').value;

		let positivityRange = Number(document.getElementById('positivityRange').value);
		let energyRange = Number(document.getElementById('energyRange').value);
		let rhythmRange = Number(document.getElementById('rhythmRange').value);
		let livelinessRange = Number(document.getElementById('livelinessRange').value);

		if (
			genre !== 'Select Genre' &&
			genre !== 'indie' &&
			genre !== 'folk' &&
			genre !== 'country' &&
			genre !== 'classical'
		) {
			console.log('The genre input provided is not one of the supported types');
			return;
		}

		if (
			positivityRange === undefined ||
			energyRange === undefined ||
			rhythmRange === undefined ||
			livelinessRange === undefined
		) {
			console.log('The positivityRange, energyRange, rhythmRange, or livelinessRange is undefined');
			return;
		}

		if (
			typeof positivityRange !== 'number' ||
			typeof energyRange !== 'number' ||
			typeof rhythmRange !== 'number' ||
			typeof livelinessRange !== 'number'
		) {
			console.log(
				'The positivityRange, energyRange, rhythmRange, or livelinessRange is not a number'
			);
			return;
		}

		if (
			positivityRange < 0 ||
			positivityRange > 100 ||
			energyRange < 0 ||
			energyRange > 100 ||
			rhythmRange < 0 ||
			rhythmRange > 100 ||
			livelinessRange < 0 ||
			livelinessRange > 100
		) {
			console.log(
				'The positivityRange, energyRange, rhythmRange, or livelinessRange is not in the range 0-100'
			);
			return;
		}

		let url = `http://localhost:4002/api/songs/generate/${genre}/${positivityRange}/${energyRange}/${rhythmRange}/${livelinessRange}`;

		let res = await fetch(url, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});

		let resJson = await res.json();
		let foundSongs = [];

		if (resJson === undefined || resJson['foundSongs'] === undefined) {
			console.log('The server could not generate a foundSongs playlist right now');
			foundSongs = [];
		} else if (
			resJson.hasOwnProperty('msg') &&
			resJson['msg'] ===
				'The query service could not return the requested foundSongs playlist right now'
		) {
			console.log(
				'500: The query service could not return the requested foundSongs playlist right now'
			);
			foundSongs = [];
		} else if (
			res.json.hasOwnProperty('msg') &&
			resJson['msg'] === 'There are no songs that meet the criteria for the foundSongs playlist'
		) {
			console.log('There are no songs that meet the criteria for the foundSongs playlist');
			foundSongs = [];
		} else {
			console.log('foundSongs...');
			foundSongs = resJson['foundSongs'];
			console.log(foundSongs);
		}

		// error heading
		let div = document.getElementById('default-heading');

		if (div === null) {
			div = document.createElement('div');
			div.setAttribute('id', 'default-heading');
		}

		let heading = document.getElementById('possible-existing-heading');

		if (heading === null) {
			heading = document.createElement('p');
			heading.setAttribute('id', 'possible-existing-heading');
			let content = document.createTextNode('There are no songs that meet the specified criteria!');
			heading.appendChild(content);
			div.appendChild(heading);
		}

		let songListSection = document.getElementsByClassName('song-list-component')[0];
		let unorderedList = document.getElementsByClassName('song-list-component__list')[0];

		songListSection.appendChild(div);

		if (foundSongs.length !== 0) {
			div.style.display = 'none';
			unorderedList.style.display = 'block';
		} else {
			unorderedList.style.display = 'none';
			div.style.display = 'block';
		}

		SongStore.update((_songs) => {
			return foundSongs;
		});

		// Todos:
		// add default text header
		// make second endpoint to handle genre
	};

	// $: songPositivityScore = songPositivityScore;
	// $: songEnergyScore = songEnergyScore;
	// $: songRhythmScore = songRhythmScore;
	// $: songLivelinessScore = songLivelinessScore;

	$: console.log(songPositivityScore);
</script>

<div class="position-fixed">
	<form>
		<fieldset>
			<legend>Generate Playlist</legend>
			<select
				id="genre-select"
				class="form-select form-select-lg mb-3"
				aria-label="Large select example"
			>
				<option selected>Select Genre</option>
				<option value="indie">Indie</option>
				<option value="folk">Folk</option>
				<option value="country">Country</option>
				<option value="classical">Classical</option>
			</select>
			<div class="mb-3">
				<div class="positivity-input-text">
					<label for="positivityRange" class="form-label">Positivity: {songPositivityScore}</label>
				</div>
				<input
					type="range"
					class="form-range positivity-input"
					step="0.25"
					min="0"
					max="100"
					value="50"
					id="positivityRange"
					on:input={updateRangeValue}
					required
				/>
			</div>
			<div class="mb-3">
				<div class="energy-input-text">
					<label for="energyRange energy-input" class="form-label">Energy: {songEnergyScore}</label>
				</div>
				<input
					type="range"
					class="form-range"
					step="0.25"
					min="0"
					max="100"
					value="50"
					id="energyRange"
					on:input={updateRangeValue}
					required
				/>
			</div>
			<div class="mb-3">
				<div class="rhythm-input-text">
					<label for="rhythmRange" class="form-label">Rhythm: {songRhythmScore}</label>
				</div>
				<input
					type="range"
					class="form-range rhythm-input"
					step="0.25"
					min="0"
					max="100"
					id="rhythmRange"
					value="50"
					on:input={updateRangeValue}
					required
				/>
			</div>
			<div class="mb-3">
				<div class="liveliness-input-text">
					<label for="livelinessRange" class="form-label">Liveliness: {songLivelinessScore}</label>
				</div>
				<input
					type="range"
					class="form-range liveliness-input"
					step="0.25"
					min="0"
					max="100"
					id="livelinessRange"
					value="50"
					on:input={updateRangeValue}
					required
				/>
			</div>
			<div class="mb-3">
				<button type="submit" class="btn btn-primary" on:click={generatePlaylist}>Submit</button>
			</div>
		</fieldset>
	</form>
</div>

<style>
	.form-range {
		width: 20rem;
	}
	@media (max-width: 1000px) {
		.form-range {
			width: 15rem;
		}
	}

	@media (max-width: 800px) {
		.form-range {
			width: 10rem;
		}
	}
</style>
