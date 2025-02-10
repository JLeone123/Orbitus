export const generateModeId = (name) => {
    if (name === undefined || typeof name !== "string" || name.trim().length === 0) {
        console.log("The id that was passed in is undefined");
        return 'mode-default';
    }

    let newName = name.split('').map(c => {
        if (c === ' ') {
            return '-';
        } else {
            return c.toLowerCase();
        }
    });

    return newName.join('');
}