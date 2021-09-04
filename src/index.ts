import express from "express";
import { Server } from "socket.io";
import http from "http";
import { v4 } from "uuid";
import { PlayerData } from "./data/PlayerData";
import { GameManager } from "./data/GameManager";
import { LoginCodeStatus } from "./protocol";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const gameManager = new GameManager();

app.get("/", (req, res) => {
  res.json({ hello: "world!" });
  res.end();
});

interface LoginMessage {
  name: string;
}

interface KickPlayerMessage {
  player_id: string;
}

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("login", (loginMessage: LoginMessage, cb: Function) => {
    const id = v4();
    const newPlayer = new PlayerData(loginMessage.name, id, socket);
    if (loginMessage.name === "FloJo" || loginMessage.name === "Flippo") {
      newPlayer.set_admin();
    }

    const currentGame = gameManager.getCurrentGame();
    currentGame.addPlayer(newPlayer);

    cb({
      id,
      status: LoginCodeStatus.Success,
      profile: {
        name: loginMessage.name,
        wins: newPlayer.wins,
        loses: newPlayer.loses,
        isAdmin: newPlayer.isAdmin,
      },
      game: {
        status: currentGame.gameStatus,
        settings: currentGame.gameSettings,
      },
    });
  });
});

server.listen(8080, () => {
  console.log("listening on *:8080");
});
