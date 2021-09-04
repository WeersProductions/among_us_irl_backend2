import { useEffect, useState } from "react";
import QrReader from "react-qr-reader";

interface TaskScannerProps {
  onScanSuccess: (task: string) => void;
}

const OnScan = (data: string | null) => {
  if (data) {
    console.log(data);
    return true;
  }
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

  return (
    <div>
      {error ? (
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
      )}
      {isWrong && <p>This is not a task for you!</p>}
    </div>
  );
};
