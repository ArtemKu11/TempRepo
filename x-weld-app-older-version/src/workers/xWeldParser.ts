export const parseGcode = (gcode: string) => {
    let layerCounter = -1;
    let stringLayerCounter = '?';
    let buildTime = '?h ?m';
    const lines = gcode.split('\n')
    for (const line of lines) {
        if (line.includes('layer')) {
            const layerNumber = getLayerNumber(line);
            const intLayerNumber = parseInt(layerNumber);
            if (!isNaN(intLayerNumber)) {
                layerCounter = intLayerNumber;
            }
        }
        if (line.includes('Build time:')) {
            buildTime = resolveBuildTime(line)
        }
    }

    if (layerCounter !== -1) {
        stringLayerCounter = layerCounter + ""
    }
    return [stringLayerCounter, buildTime];
}

function getLayerNumber(layerString: string): string {
    let layerNumber = ''
    const layerNumberIndex = layerString.indexOf('layer') + 5 + 1;

    if (layerString.length >= layerNumberIndex) {
        let tempString = layerString.slice(layerNumberIndex)
        for (const ch of tempString) {
            const digit = parseInt(ch);
            if (!isNaN(digit)) {
                layerNumber += digit;
            } else {
                break;
            }
        }
    }

    return layerNumber;
}

function resolveBuildTime(line: string) {
    let hours = '';
    let minutes = '';
    const dvoetochieIndex = line.indexOf(":");
    const hoursIndex = dvoetochieIndex + 2;
    if (line.length >= hoursIndex) {
        hours = extractNextDigit(line, hoursIndex);
    }

    const minutesIndex = line.indexOf('hours') + 5 + 1;
    if (line.length >= minutesIndex) {
        minutes = extractNextDigit(line, minutesIndex);
    }
    return `${hours}h ${minutes}m`
}

function extractNextDigit(line: string, digitIndex: number): string {
    let hours = ''
    const tempLine = line.slice(digitIndex)
    for (const ch of tempLine) {
        const digit = parseInt(ch);
        if (!isNaN(digit)) {
            hours += digit;
        } else {
            break;
        }
    }

    const intHours = parseInt(hours);
    if (!isNaN(intHours)) {
        hours = intHours + '';
    } else {
        hours = "?"
    }

    return hours;
}