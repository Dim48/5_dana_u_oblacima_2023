const express = require("express");
const {onServerStart} = require("./startDatabase");

//cache the data from csv file and calculate the required statistics in this object
//in form of {key, value} pairs, with key being the player fullName and value stats for him
let statistics = {};
const app = express();

//before the server starts, collect the data from csv file and process it
//store stats in the "statistics" object
//if the data is collected correctly, callback function will be called (server will start)
function onStartUP(callback) {
    onServerStart()
        .then(returnObject => {
            statistics = returnObject;
            console.log("In-memory database is UP!");
            callback();
        })
        .catch(error => {
            console.log('Error', error);
        });
}

onStartUP(() => app.listen(3000, () => console.log("Server listening at port 3000")));

//define endpoints
//valid playerName results in JSON response (stats)
app.get("/stats/player/:playerFullName", (req, res) => {
    if (!(req.params.playerFullName in statistics))
        res.status(404).send({
            "Explanation": "Player not found"
        });

    else {
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(statistics[req.params.playerFullName]));
    }
});

module.exports = app;