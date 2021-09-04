import React, { useCallback, useEffect, useRef, useState } from "react";
import { AdminInfo } from "./AdminInfoTypes";
import { AmongUs, GameData } from "./AmongUs";
import { GameSettingButtons } from "./GameSettingButtons";
import { GameSettings } from "./GameSettings";
import { GameStatus } from "./GameStatusEnum";
import { Login } from "./Login";
import { Profile, ProfileData } from "./Profile";
import { useAudio } from "./UseAudio";
import io, { Socket } from "socket.io-client";
import { WebsocketStatusInfo } from "./WebsocketStatusInfo";

import {
  LoginCodeStatus,
  LoginResponse,
  SetGameSettingsMessage,
  SetPlayingMessage,
  SetProgressMessage,
} from "./protocol";

const getServerUrl = () => {
  var serverUrl;
  var scheme = "ws";
  var location = document.location;

  if (location.protocol === "https:") {
    scheme += "s";
  }

  // serverUrl = `${scheme}://a-api.5-2unlimited.com`;
  // serverUrl = `${scheme}://localhost:8080`;
  serverUrl = `${scheme}://localhost:8080`;
  console.log(serverUrl);
  return serverUrl;
};

export const Game = () => {
  const webSocket = useRef<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginCodeStatus, setLoginCodeStatus] = useState(
    LoginCodeStatus.UserEntering
  );
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [gameStatus, setGameStatus] = useState(GameStatus.Unknown);
  const [username, setUserName] = useState<string>(
    localStorage.getItem("name") || ""
  );
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const [progress, setProgress] = useState(0);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const audio = new Audio("alarm.mp3");

  const connectWebsocket = useCallback(() => {
    webSocket.current = io(getServerUrl());
    const socket = webSocket.current;
    socket.connect();
    socket.on("connect", () => {
      setLoading(false);
    });

    socket.on("disconnect", () => {
      setTimeout(() => {
        setLoading(true);
        connectWebsocket();
      }, 2000);
    });

    socket.on("SetGameSettings", (data: SetGameSettingsMessage) => {
      setGameSettings(data.gameSettings);
    });

    socket.on("SetPlaying", (data: SetPlayingMessage) => {
      setGameStatus(data.status);
      setGameData(data.gameData);
    });

    socket.on("Progress", (data: SetProgressMessage) => {
      setProgress(data.progress);
    });

    socket.on("SetTasks", (data) => {
      setGameData((gameData) => {
        if (gameData) {
          gameData.client.tasks = data.tasks;
        }
        return gameData;
      });
    });

    // socket.onmessage = (event) => {
    //   const msg = JSON.parse(event.data);
    //   console.log(msg);
    //   switch (msg.msgType) {
    //     case "SetTasks":
    //       console.log("Arriving!");
    //       setGameData((gameData) => {
    //         console.log("test!");
    //         console.log("received", gameData);
    //         if (gameData) {
    //           console.log("updating");
    //           gameData.client.tasks = msg.tasks;
    //         }
    //         console.log("updated", gameData);
    //         return gameData;
    //       });
    //       break;
    //     case "SetConnections":
    //       const connectionInfo = {
    //         totalConnectionCount: msg.totalConnectionCount,
    //         loggedInConnections: msg.loggedInConnections,
    //       };
    //       setAdminInfo((adminInfo) => ({ ...adminInfo, connectionInfo }));
    //       break;
    //     case "BodyReported":
    //       audio.play().catch(() => console.log("Audio play error!"));
    //       break;
    //     default:
    //       break;
    //   }
    // };
  }, []);

  useEffect(() => {
    if (loading) {
      // We're loading again, clean up any local state.
      setProfile(null);
      setGameStatus(GameStatus.Unknown);
      setUserName(localStorage.getItem("name") || "");
      setGameData(null);
      setGameSettings(null);
      setProgress(0);
      setAdminInfo(null);
      setLoginCodeStatus(LoginCodeStatus.UserEntering);
    }
    return () => {};
  }, [loading]);

  useEffect(() => {
    connectWebsocket();
    return () => {
      // if (webSocket.current && (webSocket.current.readyState === webSocket.current.CONNECTING || webSocket.current.readyState === webSocket.current.OPEN)) {
      webSocket.current?.close();
      // }
    };
  }, [connectWebsocket]);

  return (
    <div>
      {webSocket.current && !loading && (
        <WebsocketStatusInfo websocket={webSocket.current} />
      )}
      {
        /**Connecting with server */ loading ? (
          <p>Connecting...</p>
        ) : /**Logging in */ loginCodeStatus !== LoginCodeStatus.Success ? (
          <Login
            username={username}
            onNameChange={(input: string) => {
              setUserName(input);
            }}
            onNameConfirm={() => {
              localStorage.setItem("name", username!);
              setLoginCodeStatus(LoginCodeStatus.AwaitingResponse);

              webSocket.current?.emit(
                "login",
                { name: username },
                ({ status, game, profile }: LoginResponse) => {
                  setLoginCodeStatus(status);
                  if (status === LoginCodeStatus.Success) {
                    // We also get the profile.
                    setProfile(profile);
                    // And gamestatus.
                    setGameStatus(game.status);
                    // And gamesettings.
                    setGameSettings(game.settings);
                  }
                }
              );
            }}
            awaitingInput={loginCodeStatus !== LoginCodeStatus.UserEntering}
          />
        ) : (
          <>
            {profile?.isAdmin ? (
              <GameSettingButtons
                gameSettings={gameSettings}
                progress={progress}
                adminInfo={adminInfo}
                gameStatus={gameStatus}
                onChangeGameStatus={(newGameStatus) => {
                  webSocket.current?.emit("SetPlaying", {
                    gameStatus: newGameStatus,
                  });
                }}
                onKickPlayer={(playerId) => {
                  webSocket.current?.send(
                    JSON.stringify({
                      msgType: "KickPlayer",
                      playerId,
                      code: username,
                    })
                  );
                }}
                onEditGameSetting={(key, value) => {
                  webSocket.current?.send(
                    JSON.stringify({
                      msgType: "SetGameSettings",
                      code: username,
                      settingName: key,
                      settingValue: value,
                    })
                  );
                }}
              />
            ) : /**Showing profile */ gameStatus === GameStatus.NotStarted ||
              gameStatus === GameStatus.Unknown ? (
              <Profile profileData={profile} />
            ) : (
              /**We're playing a game */ <AmongUs
                progress={progress}
                getBasicMessage={(msgType: string) => {
                  return { code: username!, msgType };
                }}
                socket={webSocket.current!}
                gameStatus={gameStatus}
                gameData={gameData}
              />
            )}
          </>
        )
      }
    </div>
  );
};