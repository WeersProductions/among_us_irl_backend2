import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import {
  GameStatus,
  LoginCodeStatus,
  SetPlayingMessage,
} from "common/messages";
import { GameManager } from "./data/GameManager";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://8c3iw-3000.pitcher-staging.csb.dev",
    ],
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

    if (player.isAdmin) {
      player.socket.on("SetPlaying", (setPlayingMessage) => {
        const currentGame = gameManager.getCurrentGame();
        if (
          setPlayingMessage.gameStatus === GameStatus.Playing &&
          (currentGame.gameStatus === GameStatus.Finished ||
            currentGame.gameStatus === GameStatus.NotStarted)
        ) {
          gameManager.startNewGame();
          gameManager.getCurrentGame().setGameStatus(GameStatus.Playing);
        } else {
          currentGame.setGameStatus(setPlayingMessage.gameStatus);
        }
      });
    }

    cb({
      id: player.id,
      status: LoginCodeStatus.Success,
      profile: {
        name: loginMessage.name,
        wins: player.wins,
        loses: player.loses,
        isAdmin: player.isAdmin,
      },
    });
  });
});

server.listen(8080, () => {
  console.log("listening on *:8080");
});
