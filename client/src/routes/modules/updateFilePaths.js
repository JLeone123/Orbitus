export const getFilePaths = (
	songObject,
	relativeImagePath,
	relativeMp3Path,
	imgStore,
	audioStore
) => {
	let updatedFilePath = `/src/lib/assets/${relativeImagePath}`;
	let imageToUse = Object.entries(imgStore).find((i) => {
		if (updatedFilePath === i[1]) {
			return i;
		}
	});

	let updatedFilePathTwo = `/src/lib/assets/${relativeMp3Path}`;

	let mp3FileToUse = Object.entries(audioStore).find((i) => {
		if (updatedFilePathTwo === i[1]) {
			return i;
		}
	});

	if (mp3FileToUse === undefined) {
		mp3FileToUse = [
			'songDefault',
			'/src/lib/assets/stored_songs/indie/early-hours-justin-lee-main-version-21967-01-54.mp3'
		];
	}

	// If the image is not stored locally, then use the default image in 'images.js'
	if (imageToUse === undefined) {
		imageToUse = ['imageOne', '/src/lib/assets/cozy-concert-and-microphone-2-pixabey.jpeg'];
	}

	return [imageToUse, mp3FileToUse];
};
