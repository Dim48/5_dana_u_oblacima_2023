const fs = require('fs');
const { parse} = require('csv-parse');

function roundOneDecimal(number) {
    return Math.round(number * 10) / 10;
}

//collect the data from all matches
function update(array, data, playerFullName) {
    if (!(playerFullName in array))
        array[playerFullName] = data;
    else
        for (let i= 0; i < data.length; ++i)
            array[playerFullName][i] += data[i];

    return array;
}

//calculate statistics
function calculateStatistics(array) {
    const returnObject = {};

    for (let key in array) {
        const curr = array[key];
        const matchesPlayed = parseFloat(curr[11]);
        returnObject[key] = {
            "playerName": key,
            "gamesPlayed": matchesPlayed,
            "traditional": {
                "freeThrows": {
                    "attempts": roundOneDecimal(curr[1] / matchesPlayed),
                    "made": roundOneDecimal(curr[0] / matchesPlayed),
                    "shootingPercentage": roundOneDecimal(curr[0] / parseFloat(curr[1]) * 100.0),
                },
                "twoPoints": {
                    "attempts": roundOneDecimal(curr[3] / matchesPlayed),
                    "made": roundOneDecimal(curr[2] / matchesPlayed),
                    "shootingPercentage": roundOneDecimal(curr[2] / parseFloat(curr[3]) * 100.0),
                },
                "threePoints": {
                    "attempts": roundOneDecimal(curr[5] / matchesPlayed),
                    "made": roundOneDecimal(curr[4] / matchesPlayed),
                    "shootingPercentage": roundOneDecimal(curr[4] / parseFloat(curr[5]) * 100.0),
                },
                "points": roundOneDecimal((curr[0] + curr[2] * 2 + curr[4] * 3) / matchesPlayed),
                "rebounds": roundOneDecimal(curr[6] / matchesPlayed),
                "blocks": roundOneDecimal(curr[7] / matchesPlayed),
                "assists": roundOneDecimal(curr[8] / matchesPlayed),
                "steals": roundOneDecimal(curr[9] / matchesPlayed),
                "turnovers": roundOneDecimal(curr[10] / matchesPlayed)
            },
            "advanced": {
                "valorization": roundOneDecimal(((curr[0] + curr[2] * 2 + curr[4] * 3 + curr[6] + curr[7] + curr[8] + curr[9])
                    - (curr[1] - curr[0] + curr[3] - curr[2] + curr[5] - curr[4] + curr[10])) / matchesPlayed),
                "effectiveFieldGoalPercentage": roundOneDecimal((curr[2] + 1.5 * curr[4]) / (curr[3] + curr[5]) * 100.0),
                "trueShootingPercentage": roundOneDecimal((curr[0] + curr[2] * 2 + curr[4] * 3) / (2 * (curr[3] + curr[5] + 0.475 * curr[1])) * 100.0),
                "hollingerAssistRatio": roundOneDecimal(curr[8] / (curr[3] + curr[5] + 0.475 * curr[1] + curr[8] + curr[10]) * 100.0)
            }
        };
    }

    return returnObject;
}

//start in-memory database
const onServerStart = () => {
    return new Promise((resolve, reject) => {
        let startData = {};

        fs.createReadStream("../L9HomeworkChallengePlayersInput.csv")
            .pipe(parse({delimiter: ",", from_line: 2}))
            .on("data", function (row) {
                const data = row.slice(2, 13).map(function (val) {
                    return parseInt(val);
                });
                data.push(1);
                startData = update(startData, data, row[0]);
            })
            .on("end", function () {
                const returnObject = calculateStatistics(startData);
                console.log("In-memory database is UP!");
                resolve(returnObject);
            })
            .on("error", function (err) {
                reject(err);
            });
    });
};

module.exports = onServerStart;