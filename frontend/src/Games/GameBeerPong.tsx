import { GameProps } from "../MiniGame";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const GameBeerPong = ({ onFinish }: GameProps) => {
  const [xCoord, setXCoord] = useState(0);
  const [score, setScore] = useState(0);

  const reset = () => {
    setXCoord(Math.random() * 40 - 20);
  };

  useEffect(() => {
    if (score >= 5) {
      onFinish();
    }
    reset();
    return () => {};
  }, [score, onFinish]);

  useEffect(() => {
    reset();
    return () => {};
  }, []);

  return (
    <>
      <p>Beer pong {score}/5</p>
      <motion.div
        initial={{ rotateZ: -15 }}
        animate={{ rotateZ: 15 }}
        transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
        style={{
          width: "70vw",
          position: "relative",
          marginLeft: `${xCoord}vw`,
        }}
      >
        <img
          alt="Elleboog"
          src="Elleboog.png"
          style={{ width: "100%", zIndex: 2 }}
        />
      </motion.div>
      <div
        style={{
          background: "yellow",
          height: "20px",
          width: "50vw",
          position: "absolute",
          right: "0",
        }}
      />
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "3rem",
          justifyContent: "center",
        }}
      >
        <button
          style={{ borderRadius: "1rem", background: "green", padding: "1rem" }}
          onClick={() => {
            if (xCoord <= 1) {
              setScore(score + 1);
            } else {
              setScore(score - 1);
            }
          }}
        >
          stilte
        </button>
        <button
          style={{ borderRadius: "1rem", background: "red", padding: "1rem" }}
          onClick={() => {
            if (xCoord > 1) {
              setScore(score + 1);
            } else {
              setScore(score - 1);
            }
          }}
        >
          ELLEBOOG
        </button>
      </div>
    </>
  );
};
