import { useEffect, useState } from "react";
import { GameProps } from "../MiniGame";

export const GameRecordTemperature = ({ onFinish }: GameProps) => {
  const [currentTemperature, setCurrentTemperature] = useState(0);
  const [desiredTemperature, setDesiredTemperature] = useState<number | null>(
    null
  );

  useEffect(() => {
    setDesiredTemperature(Math.round(Math.random() * 50 - 25));
    return () => {};
  }, []);

  useEffect(() => {
    if (
      desiredTemperature !== null &&
      desiredTemperature !== undefined &&
      currentTemperature === desiredTemperature
    ) {
      onFinish();
    }
    return () => {};
  }, [currentTemperature, desiredTemperature, onFinish]);

  return (
    <>
      <p>Record temperature</p>
      <div style={{ width: "80vw", display: "flex", gap: "1rem" }}>
        <div
          style={{
            width: "50%",
            background: "rgb(64,181,87)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            borderRadius: "0.5rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "rgb(104,117,108)",
              color: "rgb(157,201,177)",
              padding: "0.5rem",
            }}
          >
            Log
          </div>
          <button
            style={{
              background: "rgb(111,211,156)",
              color: "rgb(173,254,204)",
              fontSize: "2rem",
              margin: "0.5rem",
              marginBottom: "0rem",
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
            }}
            onClick={() => setCurrentTemperature(currentTemperature + 1)}
          >
            +
          </button>
          <p style={{ color: "white", margin: "auto" }}>
            {currentTemperature}°
          </p>
          <button
            style={{
              background: "rgb(111,211,156)",
              color: "rgb(173,254,204)",
              fontSize: "2rem",
              margin: "0.5rem",
              marginTop: "0rem",
              borderBottomLeftRadius: "1rem",
              borderBottomRightRadius: "1rem",
            }}
            onClick={() => setCurrentTemperature(currentTemperature - 1)}
          >
            -
          </button>
        </div>
        <div
          style={{
            width: "50%",
            background: "rgb(24,53,96)",
            display: "flex",
            flexDirection: "column",
            borderRadius: "0.5rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "rgb(101,125,134)",
              color: "rgb(175,220,236)",
              padding: "0.5rem",
            }}
          >
            Reading
          </div>
          <p style={{ color: "white", margin: "auto" }}>
            {desiredTemperature}°
          </p>
        </div>
      </div>
    </>
  );
};
