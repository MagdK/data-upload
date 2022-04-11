const express = require('express');
const fs = require ('fs');
const path = require('path');

const port = 9000;
const app = express();

app.use(express.json()); 

// const fFolder = path.resolve(__dirname, '..', 'frontend');
// if the one below does not work, use the one above
const fFolder = `${__dirname}/../frontend`; 

app.get('/', (req, res, next) => { 
    res.sendFile(path.join(fFolder, "index.html"));
});

app.get('/api/v1/users', (req, res, next) => {
    console.log('Request received for users endpoint.');
    res.sendFile(path.join(`${fFolder}/users.json`)); 
});

// active és passive paramsra átalakítva egy get request-be
app.get('/api/v1/users/:key', (req, res, next) => {
    //fs.readFile-nál error és data van mindig
   fs.readFile(userFile, (error, data) => {
       const users = JSON.parse(data) // JSON.parse javascript objektumma konvertalja a json file-t
       if(req.params.key === "active") {
           const activeUsers = users.filter(user => user.status === "active");
           res.send(activeUsers)
       } else if(req.params.key === "passive") {
           const passiveUsers = users.filter(user => user.status === "passive");
           res.send(passiveUsers)
       } else {
           res.send("Something went wrong.")
       }
   })
});


app.post("/users/new", (req, res) => {
    fs.readFile(`${fFolder}/users.json`, (error, data) => {
        if(error) {
            console.log(error);
            res.send("Error reading users file.");
        } else {
            const users = JSON.parse(data);
            console.log(req.body);
            users.push(req.body);

            // wrtieFile metodus - meg kell adni az eleresi utvonalat, plusz string-ge kell alakitani, hogy a fajlba bele tudjuk irni
            fs.writeFile(`${fFolder}/users.json`, JSON.stringify(users), error => {
                if(error) {
                    console.log(error);
                    res.send("Error writing users file.");
                }
            })
            // itt kuldjuk vissza a valaszuzenetet
            res.send(req.body);
        }
    })
});


app.use('/pub', express.static(`${__dirname}/../frontend/pub`));

app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`)
});