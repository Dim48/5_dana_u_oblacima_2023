# Tehnologije koriscene:
-`Node.js` kao popularan runtime environment

-`Express.js` kao backend framework jer je lightweight i radi lepo uz Node.js

-`Docker` za kontejnerizaciju aplikacije kako bi bila lako prenosiva i da bi radila na svakoj masini

Kao package manager koriscen NPM

Za resenje je kompletno koriscen opensource software

# Uputstvo za build (2 nacina):

1) Ukoliko imate Docker instaliran:

-preuzmite `docker-compose.yaml` fajl

-preko komandne linije kao `working directory` folder gde se nalazi skinuti fajl preko `cd` komande

-pokrenite `docker compose up` komandu.

2) U suprotnom:

-preduslov je imate instaliran Node.js verzije 16

-`git clone` da klonirate ovaj repozitorijum

-`npm install` unutar foldera repozitorijuma, da resite zavisnosti

-`node index.js` da pokrenete server

# Server ce biti pokrenut na http://localhost:3000/
