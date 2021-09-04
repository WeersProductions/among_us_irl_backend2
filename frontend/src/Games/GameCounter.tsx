import { GameProps } from "../MiniGame";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const GameCounter = ({ onFinish }: GameProps) => {
    const [order, setOrder] = useState(null);
  
  const reset = () => {
    
  };

  useEffect(() => {
    reset();
    return () => {};
  }, []);

  return (
    <>
      <p>Count!</p>
      <div style={{display: 'flex'}}>

      </div>
    </>
  );
};
