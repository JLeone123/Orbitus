let onAMissionMode = {
    name: 'On a mission mode',

    positivity: {
        score: 0.00,
        sign: '>='
    },

    energy: {
        score: 30.00,
        sign: '<='
    },

    rhythm: {
        score: 30.00,
        sign: '<='
    },

    liveliness: {
        score: 30.00,
        sign: '<='
    }
};

let joyrideMode = {
    name: 'Joyride mode',
    
    positivity: {
        score: 75.00,
        sign: '>='
    },

    energy: {
        score: 75.00,
        sign: '>='
    },

    rhythm: {
        score: 75.00,
        sign: '>='
    },

    liveliness: {
        score: 75.00,
        sign: '>='
    }
};

let cruisinMode = {
    name: "Cruisin' mode",

    positivity: {
        score: 0.00,
        sign: '>='
    },

    energy: {
        score: 75.00,
        sign: '<='
    },

    rhythm: {
        score: 50.00,
        sign: '<='
    },

    liveliness: {
        score: 75.00,
        sign: '<='
    }
};

export let modeList = [
    onAMissionMode,
    joyrideMode,
    cruisinMode
]