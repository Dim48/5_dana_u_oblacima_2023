## Tehnologije koriscene:

- `Node.js` kao popularan runtime environment

- `Express.js` kao backend framework jer je lightweight

- `Docker` za kontejnerizaciju aplikacije kako bi bila lako prenosiva i da bi radila na svakoj masini

- `Mocha` framework za Unit testove uz `Chai` biblioteku

- Kao package manager koriscen [npm](https://www.npmjs.com/)

Za resenje je kompletno koriscen opensource software

## Uputstvo za build (2 nacina):

    1) Ukoliko imate Docker instaliran:

- preuzmite `docker-compose.yaml` fajl

- preko komandne linije kao `working directory` folder gde se nalazi skinuti fajl preko `cd` komande

- pokrenite `docker compose up` komandu.

    2) U suprotnom:

- preduslov je imate instaliran Node.js verzije 16

- `git clone` da klonirate ovaj repozitorijum

- `npm install` unutar foldera repozitorijuma, da resite zavisnosti

- `node index.js` da pokrenete server

### Api ce biti pokrenut na http://localhost:3000/

## Uputstvo za test:

- Komanda `npm test` unutar foldera repozitorijuma
