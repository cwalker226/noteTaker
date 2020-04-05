const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const app = express();
const PORT = process.env.PORT || 3000;

let notes = [];

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("/api/notes", function(req, res) {
    console.log("notes api get");
    return fs.readFile(path.join(__dirname, "./db/db.json"), function(err, data) {
        if (err) throw err;
        notes = JSON.parse(data);
        console.log(notes);
        // returnArray.concat(notes);
        // console.log(notes);
        return res.json(notes);
    });
});

app.post("/api/notes", function(req, res) {
    console.log(req.body);

    notes.push({id: uuid.v4(), title: req.body.title, text: req.body.text});
   
    console.log("notes api post");
    console.log(JSON.stringify(notes));
    return fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notes), function(err) {
        if (err) throw err;
        console.log("file wrote!");
    });
});

app.delete('api/notes/:id', (req, res) => {
    console.log("api notes delete");
    let noteID = req.params.id;
    
    console.log(noteID);
    for(var i = 0; i < notes.length; i++){
        console.log(notes[i].id);
        if(noteID === notes[i].id){
            delete notes[i];
        }
    }
    return fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notes), function(err) {
        if (err) throw err;
        console.log("file wrote!");
        
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});