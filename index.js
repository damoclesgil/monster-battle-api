const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const apiData = require("./db.json");
app.use(bodyParser.json());
const fs = require("fs");
const cors = require('cors');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(cors({
  origin: '*'
}));


app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.get("/api/monsters", (req, res) => {
  res.json(apiData.monsters);
});

app.get("/api/battles", (req, res) => {
  res.json(apiData.battles);
});

app.post("/api/battle", (req, res) => {
  const body = req.body;
  const playerMonster = apiData.monsters.find(
    (monster) => monster.id === body.monsterIdPlayer
  );
  const computerMonster = apiData.monsters.find(
    (monster) => monster.id === body.monsterIdComputer
  );

  // Determine the winner based on attack strength
  const monsterPlayerIsMostStrong =
    playerMonster.attack > computerMonster.attack;
  const winner = monsterPlayerIsMostStrong ? playerMonster : computerMonster;

  // Update the battles data in your database
  // let dbFile = fs.readFileSync("./db.json", "utf-8");
  // let myObject = JSON.parse(dbFile);
  // myObject.battles.push({ winner });
  // let newBattle = JSON.stringify(myObject);
  // fs.writeFileSync("./db.json", newBattle, "utf-8", (err) => {
  //   if (err) throw err;
  //   console.log("New battle data added");
  // });

  // Send the winner as the API response
  res.status(201).json({ winner });
});
