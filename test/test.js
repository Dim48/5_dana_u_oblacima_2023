const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

const app = require('../index.js');
const {roundOneDecimal, update, calculateStatistics} = require("../startDatabase");

chai.use(chaiHttp);

//unit testing
describe('Unit testing', () => {
    it('Should round a number to one decimal place', () => {
        expect(roundOneDecimal(5.6789)).to.equal(5.7);
    });

    it('should return 0 if the input is null', () => {
        expect(roundOneDecimal(null)).to.equal(0);
    });

    it('should return 0 if the input is 0', () => {
        expect(roundOneDecimal(0)).to.equal(0);
    });
});

describe('update function', () => {
    it('should add new stats if the player does not exist in the array', () => {
        const array = {};
        const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const playerFullName = 'John Doe';
        const result = update(array, data, playerFullName);
        expect(result).to.deep.equal({'John Doe': data});
    });

    it('should update old stats if the player exists in the array', () => {
        const array = { 'John Doe': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] };
        const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const playerFullName = 'John Doe';
        const result = update(array, data, playerFullName);
        expect(result).to.deep.equal({ 'John Doe': [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24] });
    });
});

describe('calculateStatistics function', () => {
    it('should calculate statistics based on input data', () => {
        const inputData = {
            'Jawara Mekonnen': [3, 3, 7, 8, 3, 3, 0, 1, 5, 2, 1, 2]
        };

        const expectedOutput = {
            "Jawara Mekonnen": {
                "playerName": "Jawara Mekonnen",
                "gamesPlayed": 2,
                "traditional": {
                    "freeThrows": {
                        "attempts": 1.5,
                        "made": 1.5,
                        "shootingPercentage": 100
                    },
                    "twoPoints": {
                        "attempts": 4,
                        "made": 3.5,
                        "shootingPercentage": 87.5
                    },
                    "threePoints": {
                        "attempts": 1.5,
                        "made": 1.5,
                        "shootingPercentage": 100
                    },
                    "points": 13,
                    "rebounds": 0,
                    "blocks": 0.5,
                    "assists": 2.5,
                    "steals": 1,
                    "turnovers": 0.5
                },
                "advanced": {
                    "valorization": 16,
                    "effectiveFieldGoalPercentage": 104.5,
                    "trueShootingPercentage": 104.6,
                    "hollingerAssistRatio": 27.1
                }
            }
        };

        const result = calculateStatistics(inputData);

        expect(result).to.deep.equal(expectedOutput);
    });
});

//integration testing
describe('Integration testing', () => {
    it('Should start the server and respond to /stats/player/:playerFullName', (done) => {
        chai.request(app)
            .get('/stats/player/Jawara Mekonnen')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.deep.equal({
                    "playerName": "Jawara Mekonnen",
                    "gamesPlayed": 2,
                    "traditional": {
                        "freeThrows": {
                            "attempts": 1.5,
                            "made": 1.5,
                            "shootingPercentage": 100
                        },
                        "twoPoints": {
                            "attempts": 4,
                            "made": 3.5,
                            "shootingPercentage": 87.5
                        },
                        "threePoints": {
                            "attempts": 1.5,
                            "made": 1.5,
                            "shootingPercentage": 100
                        },
                        "points": 13,
                        "rebounds": 0,
                        "blocks": 0.5,
                        "assists": 2.5,
                        "steals": 1,
                        "turnovers": 0.5
                    },
                    "advanced": {
                        "valorization": 16,
                        "effectiveFieldGoalPercentage": 104.5,
                        "trueShootingPercentage": 104.6,
                        "hollingerAssistRatio": 27.1
                    }
                });

                done();
            });
    });

    it('Should return 404 when player is not found', (done) => {
        chai.request(app)
            .get('/stats/player/someInvalidName')
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.deep.equal({ Explanation: 'Player not found' });

                done();
            });
    });
});
