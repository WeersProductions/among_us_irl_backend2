import { useEffect, useState, useRef } from "react";
// import QrReader from "react-qr-reader";

interface TaskScannerProps {
  onScanSuccess: (task: string) => void;
}

const OnScan = (data: string | null) => {
  if (data) {
    console.log(data);
    return true;
  }
};

const CODE_MAP: Record<string, string> = {
  "376": "clear_asteroids",
  "420": "beer_pong",
  "690": "fuel_tank",
  "120": "space_ship",
  "323": "long_task",
  "099": "easy_task",
  "812": "hard_task",
  "143": "another_task",
};

export const TaskScanner = ({ onScanSuccess }: TaskScannerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null;
    if (isWrong) {
      intervalId = setInterval(() => {
        setIsWrong(false);
      }, 5000);
    } else {
      intervalId = null;
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isWrong]);

  const [num1, setnum1] = useState<null | number>(null);
  const [num2, setnum2] = useState<null | number>(null);
  const [num3, setnum3] = useState<null | number>(null);
  const secondNumRef = useRef<HTMLInputElement | null>(null);
  const thirdNumRef = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      {/* {error ? (
        <p>error: {error}</p>
      ) : (
        <QrReader
          delay={300}
          onScan={(data) => {
            if (OnScan(data)) {
              setIsWrong(false);
              onScanSuccess(data!);
            } else if (data) {
              setIsWrong(true);
            }
          }}
          onError={setError}
          style={{ width: "80vw" }}
        />
      )} */}

      <div>
        <input
          style={{ padding: 16 }}
          onChange={(e) => {
            if (e.target.value.length) {
              secondNumRef.current?.focus();
              secondNumRef.current?.select();
              setnum1(+e.target.value);
            }
          }}
          min="0"
          max="10"
          type="number"
        />
        <input
          style={{ padding: 16 }}
          onChange={(e) => {
            if (e.target.value.length) {
              thirdNumRef.current?.focus();
              thirdNumRef.current?.select();
              setnum2(+e.target.value);
            }
          }}
          ref={secondNumRef}
          min="0"
          max="10"
          type="number"
        />
        <input
          style={{ padding: 16 }}
          onChange={(e) => {
            if (e.target.value.length === 0) {
              return;
            }
            setnum3(+e.target.value);
            const code = `${num1}${num2}${e.target.value}`;

            const data = CODE_MAP[code];
            if (data) {
              console.log(data);
              if (OnScan(data)) {
                console.log(OnScan(data));
                setIsWrong(false);
                onScanSuccess(data!);
              } else if (data) {
                setIsWrong(true);
              }
            }
          }}
          ref={thirdNumRef}
          min="0"
          max="10"
          type="number"
        />
      </div>

      {isWrong && <p>This is not a task for you!</p>}
    </div>
  );
};
