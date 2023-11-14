const fs = require('fs');
const { parse} = require('csv-parse');

//round a number to one decimal if it has more than one,
//if dividing by 0, return 0 instead of null
function roundOneDecimal(number) {
    return (number) ? Math.round(number * 10) / 10 : 0;
}

//if player hasn't got any stats just store new stats,
//else update old stats (sum up every parameter of both)
function update(array, data, playerFullName) {
    if (!(playerFullName in array))
        array[playerFullName] = data;
    else
        for (let i= 0; i < data.length; ++i)
            array[playerFullName][i] += data[i];

    return array;
}

//calculate statistics based on data from csv file
function calculateStatistics(array) {
    const returnObject = {};

    for (let key in array) {
        const curr = array[key];
        const matchesPlayed = parseFloat(curr[11]);
        const points = curr[0] + curr[2] * 2 + curr[4] * 3;
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
                "points": roundOneDecimal(points / matchesPlayed),
                "rebounds": roundOneDecimal(curr[6] / matchesPlayed),
                "blocks": roundOneDecimal(curr[7] / matchesPlayed),
                "assists": roundOneDecimal(curr[8] / matchesPlayed),
                "steals": roundOneDecimal(curr[9] / matchesPlayed),
                "turnovers": roundOneDecimal(curr[10] / matchesPlayed)
            },
            "advanced": {
                "valorization": roundOneDecimal(((points + curr[6] + curr[7] + curr[8] + curr[9])
                    - (curr[1] - curr[0] + curr[3] - curr[2] + curr[5] - curr[4] + curr[10])) / matchesPlayed),
                "effectiveFieldGoalPercentage": roundOneDecimal((curr[2] + 1.5 * curr[4]) / (curr[3] + curr[5]) * 100.0),
                "trueShootingPercentage": roundOneDecimal(points / (2 * (curr[3] + curr[5] + 0.475 * curr[1])) * 100.0),
                "hollingerAssistRatio": roundOneDecimal(curr[8] / (curr[3] + curr[5] + 0.475 * curr[1] + curr[8] + curr[10]) * 100.0)
            }
        };
    }

    //final object - calculated stats ready for returning as a response
    return returnObject;
}

//start in-memory database
const onServerStart = () => {
    return new Promise((resolve, reject) => {
        //store data from csv file here
        let startData = {};

        //read csv file and store data in an object with {key, value} pairs
        //with key being playerFullName and value sum of every column, while
        //pushing an element at the end for counting total matches played
        fs.createReadStream("./L9HomeworkChallengePlayersInput.csv")
            .pipe(parse({delimiter: ",", from_line: 2}))
            .on("data", function (row) {
                const data = row.slice(2, 13).map(function (val) {
                    return parseInt(val);
                });
                //add match counter
                data.push(1);
                //update current player stats
                startData = update(startData, data, row[0]);
            })
            .on("end", function () {
                //calculate stats before returning object
                const returnObject = calculateStatistics(startData);
                resolve(returnObject);
            })
            .on("error", function (err) {
                reject(err);
            });
    });
};

module.exports = onServerStart;