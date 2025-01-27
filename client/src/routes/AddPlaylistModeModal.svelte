<script>
	import { ModeStore } from './modeStore.js';

	const addPlaylistMode = async () => {
		let newModeName = document.getElementById('m-new-mode-name').value;

		let positivityScore = Number(document.getElementById('m-positivity-score').value);
		let energyScore = Number(document.getElementById('m-energy-score').value);
		let rhythmScore = Number(document.getElementById('m-rhythm-score').value);
		let livelinessScore = Number(document.getElementById('m-liveliness-score').value);

		let positivitySign = document.getElementById('m-positivity-sign').value;
		let energySign = document.getElementById('m-energy-sign').value;
		let rhythmSign = document.getElementById('m-rhythm-sign').value;
		let livelinessSign = document.getElementById('m-liveliness-sign').value;

		console.log(newModeName);
		console.log(positivityScore, energyScore, rhythmScore, livelinessScore);
		console.log(positivitySign, energySign, rhythmSign, livelinessSign);

		if (
			newModeName === undefined ||
			typeof newModeName !== 'string' ||
			newModeName.trim().length === 0
		) {
			console.log('New mode name is not a valid name');
			return;
		}

		if (
			positivityScore === undefined ||
			typeof positivityScore !== 'number' ||
			positivityScore < 0 ||
			positivityScore > 100
		) {
			console.log('Positivity score is not a valid number');
			return;
		}

		if (
			energyScore === undefined ||
			typeof energyScore !== 'number' ||
			energyScore < 0 ||
			energyScore > 100
		) {
			console.log('Energy score is not a valid number');
			return;
		}

		if (
			rhythmScore === undefined ||
			typeof rhythmScore !== 'number' ||
			rhythmScore < 0 ||
			rhythmScore > 100
		) {
			console.log('Rhythm score is not a valid number');
			return;
		}

		if (
			livelinessScore === undefined ||
			typeof livelinessScore !== 'number' ||
			livelinessScore < 0 ||
			livelinessScore > 100
		) {
			console.log('liveliness score is not a valid number');
			return;
		}

		if (
			positivitySign !== '>' &&
			positivitySign !== '>=' &&
			positivitySign !== '<' &&
			positivitySign !== '<='
		) {
			console.log('The positivity sign is not >, >=, <, or <=');
			return;
		}

		if (energySign !== '>' && energySign !== '>=' && energySign !== '<' && energySign !== '<=') {
			console.log('The energy sign is not >, >=, <, or <=');
			return;
		}

		if (rhythmSign !== '>' && rhythmSign !== '>=' && rhythmSign !== '<' && rhythmSign !== '<=') {
			console.log('The rhythm sign is not >, >=, <, or <=');
			return;
		}

		if (
			livelinessSign !== '>' &&
			livelinessSign !== '>=' &&
			livelinessSign !== '<' &&
			livelinessSign !== '<='
		) {
			console.log('The liveliness sign is not >, >=, <, or <=');
			return;
		}

		let event = {
			event: {
				type: 'ModeCreated',
				data: {
					newModeName,
					positivityScore,
					energyScore,
					rhythmScore,
					livelinessScore,
					positivitySign,
					energySign,
					rhythmSign,
					livelinessSign
				}
			}
		};

		console.log(event);
		let res = await fetch('http://localhost:4005/events', {
			mode: 'cors',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(event)
		});

		let resJson = await res.json();

		if (resJson === undefined) {
			console.log('500: ISE - The modes service or the event-bus could not process the request');
			return;
		}

		console.log('resJson');
		console.log(resJson);

		let newMode = resJson['newMode'][0];
		let newModeObject = {
			id: newMode['id'],
			name: newMode['name'],

			positivity: newMode['positivity'],
			energy: newMode['energy'],
			rhythm: newMode['rhythm'],
			liveliness: newMode['liveliness'],

			positivity_sign: newMode['positivity_sign'],
			energy_sign: newMode['energy_sign'],
			rhythm_sign: newMode['rhythm_sign'],
			liveliness_sign: newMode['liveliness_sign']
		};

		ModeStore.update((_modes) => {
			let modesArray = _modes;
			modesArray.push(newModeObject);
			modesArray = modesArray;
			return modesArray;
		});
	};
</script>

<!-- Delete Song Modal Component -->
<div
	class="modal fade"
	id="addPlaylistModeModal"
	tabindex="-1"
	aria-labelledby="addPlaylistModeModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h1 class="modal-title fs-5" id="addPlaylistModeModalLabel">Add playlist mode</h1>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div class="input-group mb-3">
					<span class="input-group-text" id="m-new-mode-name-icon">
						<i class="bi bi-sun-fill"></i>
					</span>
					<div class="form-floating">
						<input
							type="text"
							class="form-control"
							id="m-new-mode-name"
							placeholder="(e.g Playlist One)"
							aria-label="(e.g. Playlist One)"
							aria-describedby="m-new-mode-name"
							required
						/>
						<label for="m-new-mode-name">New mode name</label>
					</div>
				</div>

				<!-- Positivity stats section -->
				<div class="row g-2">
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="m-positivity-score-icon">
								<i class="bi bi-sun-fill"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="m-positivity-score"
									placeholder="Positivity (e.g. 90.4, 50.3, 30.2)"
									aria-label="Positivity (e.g. 90.4, 50.3, 30.2)"
									aria-describedby="m-positivity-score"
									required
								/>
								<label for="m-positivity-score">Positivity score</label>
							</div>
						</div>
					</div>
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="m-positivity-sign-icon">
								<i class="bi bi-bicycle"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="m-positivity-sign"
									placeholder="e.g. >="
									aria-label="Positivity (e.g. 90.4, 50.3, 30.2)"
									aria-describedby="m-positivity-sign"
									required
								/>
								<label for="m-positivity-sign">Positivity sign</label>
							</div>
						</div>
					</div>
				</div>

				<!-- Energy stats section -->
				<div class="row g-2">
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="m-energy-score-icon">
								<i class="bi bi-lightning-charge-fill"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="m-energy-score"
									placeholder="Energy (e.g. 90.4, 50.3, 30.2)"
									aria-label="Energy (e.g. 90.4, 50.3, 30.2)"
									aria-describedby="m-energy-score"
									required
								/>
								<label for="m-energy-score">Energy score</label>
							</div>
						</div>
					</div>
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="m-energy-sign-icon">
								<i class="bi bi-headphones"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="m-energy-sign"
									placeholder="(e.g. >=)"
									aria-label="(e.g. >=)"
									aria-describedby="m-energy-sign"
									required
								/>
								<label for="m-energy-sign">Energy sign</label>
							</div>
						</div>
					</div>
				</div>

				<!-- Rhythm stats section -->
				<div class="row g-2">
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="m-rhythm-score-icon">
								<i class="bi bi-fire"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="m-rhythm-score"
									placeholder="liveliness (e.g. 90.4, 50.3, 30.2)"
									aria-label="Positivity (e.g. 90.4, 50.3, 30.2)"
									aria-describedby="m-rhythm-score"
									required
								/>
								<label for="m-rhythm-score">Rhythm score</label>
							</div>
						</div>
					</div>
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="m-rhythm-sign-icon">
								<i class="bi bi-sunglasses"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="m-rhythm-sign"
									placeholder="(e.g. >=)"
									aria-label="(e.g. >=)"
									aria-describedby="m-rhythm-sign"
									required
								/>
								<label for="m-rhythm-sign">Rhythm sign</label>
							</div>
						</div>
					</div>
				</div>

				<!-- liveliness stats section -->
				<div class="row g-2">
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="m-liveliness-score-icon">
								<i class="bi bi-speaker"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="m-liveliness-score"
									placeholder="liveliness (e.g. 90.4, 50.3, 30.2)"
									aria-label="liveliness (e.g. 90.4, 50.3, 30.2)"
									aria-describedby="m-liveliness-score"
									required
								/>
								<label for="m-liveliness-score">Liveliness score</label>
							</div>
						</div>
					</div>
					<div class="col-md">
						<div class="input-group mb-3">
							<span class="input-group-text" id="m-liveliness-sign-icon">
								<i class="bi bi-pencil"></i>
							</span>
							<div class="form-floating">
								<input
									type="text"
									class="form-control"
									id="m-liveliness-sign"
									placeholder="(e.g >=)"
									aria-label="(e.g. >=)"
									aria-describedby="m-liveliness-sign"
									required
								/>
								<label for="m-liveliness-sign">Liveliness sign</label>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				<button
					type="button"
					class="btn btn-primary"
					data-bs-dismiss="modal"
					on:click={addPlaylistMode}>Save changes</button
				>
			</div>
		</div>
	</div>
</div>
