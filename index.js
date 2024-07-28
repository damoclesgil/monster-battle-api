const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const apiData = require("./db.json");
app.use(bodyParser.json());
const fs = require("fs");

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

let todos = [];

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.get("/api/monsters", (req, res) => {
  res.json(apiData.monsters);
});

app.post("/api/battle", (req, res) => {
  const body = req.body;
  const playerMonster = apiData.monsters.filter(
    (monster) => monster.id === body.monsterIdPlayer
  );
  const computerMonster = apiData.monsters.filter(
    (monster) => monster.id === body.monsterIdComputer
  );
  let monsterPlayerIsMostStrong = playerMonster.every(
    (monster) => monster.attack > computerMonster[0].attack
  );
  let responseApi = { winner: "" };
  if (monsterPlayerIsMostStrong) {
    responseApi = {
      winner: playerMonster[0],
    };
  } else {
    responseApi = {
      winner: computerMonster[0],
    };
  }

  let dbFile = fs.readFileSync("./db.json");
  let myObject = JSON.parse(dbFile);
  myObject.battles.push(responseApi);
  let newBatte = JSON.stringify(myObject);
  fs.writeFile("./db.json", newBatte, (err) => {
    // Error checking
    if (err) throw err;
    console.log("New data added");
  });
  res.status(201).json(responseApi);
});
