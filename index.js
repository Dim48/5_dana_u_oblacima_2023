const express = require("express");
const onServerStart = require("./startDatabase");

let statistics = {};
const app = express();

function onStartUP(callback) {
    onServerStart()
        .then(returnObject => {
            statistics = returnObject;
        })
        .catch(error => {
            console.log('Error', error);
        });
    callback();
}

onStartUP(() => app.listen(3000, () => console.log("Server listening at port 3000")));

app.get("/stats/player/:playerFullName", (req, res) => {
    if (!(req.params.playerFullName in statistics)) {
        res.status(404).send();
    }
    else {
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(statistics[req.params.playerFullName]));
    }
});