import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { v4 } from "uuid";
import { PlayerData } from "./data/PlayerData";
import { GameManager } from "./data/GameManager";
import { LoginCodeStatus } from "./protocol";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const gameManager = new GameManager();

app.get("/", (req, res) => {
  res.json({ hello: "world!" });
  res.end();
});

interface LoginMessage {
  name: string;
}

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("login", (loginMessage: LoginMessage, cb: Function) => {
    const player = gameManager.addPlayer(loginMessage.name, socket);
    const currentGame = gameManager.getCurrentGame();

    cb({
      id: player.id,
      status: LoginCodeStatus.Success,
      profile: {
        name: loginMessage.name,
        wins: player.wins,
        loses: player.loses,
        isAdmin: player.isAdmin,
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
