import fs from 'fs'

fs.readFile('festivals.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }
    const holidays = JSON.parse(data);
    console.log(holidays);
});
