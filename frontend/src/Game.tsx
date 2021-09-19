import { useCallback, useEffect, useRef, useState } from "react";
import { AmongUs } from "./AmongUs";
import { GameSettingButtons } from "./GameSettingButtonsOLD";
import { GameSettings } from "./GameSettings";
import { GameStatus } from "./GameStatusEnum";
import { Login } from "./Login";
import { Profile, ProfileData } from "./Profile";
import io, { Socket } from "socket.io-client";
import {
  SetPlayingMessage,
  GameData,
  AdminInfo,
  LoginCodeStatus,
  LoginResponse,
  SetConnectionsMessage,
  SetGameSettingsMessage,
  SetProgressMessage,
  SetTasksMessage,
} from "common/messages";
import { WebsocketStatusInfo } from "./WebsocketStatusInfo";
import { AdminDashboard } from "./Admin/AdminDashboard";

const getServerUrl = () => {
  var serverUrl;
  var scheme = "ws";
  var location = document.location;

  if (location.protocol === "https:") {
    scheme += "s";
  }

  // serverUrl = `${scheme}://a-api.5-2unlimited.com`;
  // serverUrl = `${scheme}://localhost:8080`;
  serverUrl = `${scheme}://8c3iw-8080.pitcher-staging.csb.dev`;
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
  const [bodyReporter, setBodyReporter] = useState<string | null>(null);
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
      setGameStatus(data.gameStatus);
      setGameData(data.gameData);
    });

    socket.on("Progress", (data: SetProgressMessage) => {
      setProgress(data.progress);
    });

    socket.on("SetTasks", (data: SetTasksMessage) => {
      setGameData((gameData) => {
        if (gameData) {
          gameData.client.tasks = data.tasks;
        }
        return gameData;
      });
    });

    socket.on("SetConnections", (data: SetConnectionsMessage) => {
      const connectionInfo = {
        totalConnectionCount: data.totalConnectionCount,
        loggedInConnections: data.loggedInConnections,
      };
      setAdminInfo((adminInfo) => ({ ...adminInfo, connectionInfo }));
    });

    socket.on("BodyReported", (data: { reporter: string }) => {
      audio.play().catch(() => console.log("Audio play error!"));

      setBodyReporter(data.reporter);

      setTimeout(() => {
        setBodyReporter(null);
      }, 10000);
    });
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
                ({ status, profile }: LoginResponse) => {
                  setLoginCodeStatus(status);
                  if (status === LoginCodeStatus.Success) {
                    // We also get the profile.
                    setProfile(profile);
                    // // And gamestatus.
                    // setGameStatus(game.status);
                    // // And gamesettings.
                    // setGameSettings(game.settings);
                  }
                }
              );
            }}
            awaitingInput={loginCodeStatus !== LoginCodeStatus.UserEntering}
          />
        ) : (
          <>
            {profile?.isAdmin ? (
              <AdminDashboard
                gameSettings={gameSettings ? gameSettings : undefined}
                progress={progress}
                adminInfo={adminInfo ? adminInfo : undefined}
                gameStatus={gameStatus}
                onChangeGameStatus={(newGameStatus) => {
                  webSocket.current?.emit("SetPlaying", {
                    gameStatus: newGameStatus,
                  });
                }}
                onKickPlayer={(playerId) => {
                  webSocket.current?.emit("KickPlayer", {
                    playerId,
                  });
                }}
                onEditGameSetting={(key, value) => {
                  webSocket.current?.emit("ChangeGameSettings", {
                    settingName: key,
                    settingValue: value,
                  });
                }}
              />
            ) : /**Showing profile */ gameStatus === GameStatus.NotStarted ||
              gameStatus === GameStatus.Unknown ? (
              <Profile profileData={profile} />
            ) : (
              /**We're playing a game */ <AmongUs
                progress={progress}
                socket={webSocket.current!}
                gameStatus={gameStatus}
                gameData={gameData}
                bodyReporter={bodyReporter}
              />
            )}
          </>
        )
      }
    </div>
  );
};
