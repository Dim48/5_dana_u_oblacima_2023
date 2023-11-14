const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

const app = require('../index.js');

chai.use(chaiHttp);

describe('Express API Unit tests', () => {
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

    it('Same as first', (done) => {
        chai.request(app)
            .get('/stats/player/Jawara ')
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.deep.equal({ Explanation: 'Player not found' });

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
