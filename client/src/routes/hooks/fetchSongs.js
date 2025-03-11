import { SongStore } from '../stores-folder/store.js';
import { FetchingStore } from '../stores-folder/fetchingStore.js';

export const fetchSongs = async () => {
	// Query service endpoint to get all songs
	try {
		const res = await fetch('http://localhost:4002/api/songs', {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});

		// Get list of all of the songs
		// from the query service by
		// parsing the JSON response
		const data = await res.json();

		if (data === undefined) {
			SongStore.set([]);
		} else {
			SongStore.set(data);
		}

		// const eventBusResponse = await fetch('http://localhost:4005/api/events', {
		// 	method: 'POST',
		// 	mode: 'cors',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		Accept: 'application/json'
		// 	}
		// });

		// const eventBusReponseJson = await eventBusResponse.json();

		// if (eventBusReponseJson['msg'] === 'OK') {
		// 	console.log('Event bus successfully notified other event subscribers');
		// } else {
		// 	console.log('Event bus did not notify other event subscribers');
		// }
	} catch (e) {
		FetchingStore.set(false);
	}
};
