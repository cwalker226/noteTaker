const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const app = express();
const PORT = process.env.PORT || 3000;

// let notes = [];

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.delete('/api/notes/:id', (req, res) => {
    console.log("api notes delete");
    let noteID = req.params.id;

    fs.readFile(path.join(__dirname, "./db/db.json"), function(err, data) {
        if (err) throw err;
        let notes = JSON.parse(data);

        const newNoteObj = notes.filter(function(val, ind, array) {
            console.log(val);
            return noteID != val.id;
        });
        console.log(newNoteObj);
        fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(newNoteObj), function(err) {
            if (err) throw err;
            console.log("file wrote!");
            res.json(newNoteObj);
        });
    });
});

app.post("/api/notes", function(req, res) {
    console.log(req.body);
    const newNote = [{id: uuid.v4(), title: req.body.title, text: req.body.text}];

    let notes;

    fs.readFile(path.join(__dirname, "./db/db.json"), function(err, data) {
        if (err) throw err;
        console.log(data);
        notes = JSON.parse(data);
        console.log(notes);

        const newNotesObj = notes.concat(newNote);
   
        console.log("notes api post");
        console.log(JSON.stringify(newNotesObj));
        fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(newNotesObj), function(err) {
            if (err) throw err;
            console.log("file wrote!");
            res.json(newNotesObj);
        });
    });

    
});

app.get("/api/notes", function(req, res) {
    console.log("notes api get");
    fs.readFile(path.join(__dirname, "./db/db.json"), function(err, data) {
        if (err) throw err;
        let notes = JSON.parse(data);
        res.json(notes);
    });
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});