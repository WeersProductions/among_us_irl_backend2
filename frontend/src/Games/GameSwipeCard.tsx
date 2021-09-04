import { useEffect, useState } from "react";
import { GameProps } from "../MiniGame";
import { motion } from "framer-motion";

export const GameSwipeCard = ({ onFinish }: GameProps) => {
  const [receivedCard, setReceivedCard] = useState(false);
  const [dragStartTime, setDragStartTime] = useState<Date | null>(null);
  const [reachedTarget, setReachedTarget] = useState(false);
  const [dragging, setDragging] = useState(false);

  // 0
  useEffect(() => {
    let wrapper = document.getElementById("wrapper");

    let target = document.getElementsByClassName("moving_card")[0];
    let source = document
      .getElementById("card_target")!
      .getBoundingClientRect();

    let callback = (
      entries: IntersectionObserverEntry[],
      _: IntersectionObserver
    ) => {
      entries.forEach((entry) => {
        const xInRange =
          entry.boundingClientRect.x > source.x - 2 * source.width &&
          entry.boundingClientRect.x < source.x + 0.5 * source.width;
        const yInRange =
          entry.boundingClientRect.y > source.y - 0.5 * source.height &&
          entry.boundingClientRect.y < source.y + 0.5 * source.height;
        let doesOverlap = xInRange && yInRange;
        console.log("overlap", doesOverlap);
        setReachedTarget(doesOverlap);
      });
    };

    let io = new IntersectionObserver(callback, {
      root: wrapper,
      threshold: [0, 0.1, 0.95, 1],
    });
    io.observe(target);

    return () => {
      io.unobserve(target);
    };
  }, []);

  useEffect(() => {
    if (!dragging) {
      return;
    }
    if (!reachedTarget) {
      return;
    }
    if (!dragStartTime) {
      return;
    }

    const now = new Date();
    const timeDiff = now.getTime() - dragStartTime?.getTime();
    // console.log(timeDiff);
    // if (timeDiff > 1000 && timeDiff < 5000) {
    //     // Yay. done.
    //     onFinish();
    // } else {
    //     setReachedTarget(false);
    // }
    onFinish();
    return () => {};
  }, [onFinish, reachedTarget, dragStartTime, dragging]);

  console.log(reachedTarget);

  return (
    <>
      <p>Swipe card</p>
      <div id="wrapper" style={{ width: "100%" }}>
        <div
          id="card_target"
          style={{ position: "absolute", right: "2rem", background: "green" }}
        >
          Drag here!
        </div>
        <motion.div
          className="moving_card"
          onTap={() => {
            if (!receivedCard) {
              setReceivedCard(true);
            }
          }}
          drag={receivedCard ? "x" : undefined}
          onDragStart={() => {
            if (receivedCard) {
              setDragging(true);
              setDragStartTime(new Date());
            }
          }}
          onDragEnd={() => {
            if (receivedCard) {
              setDragging(false);
            }
          }}
          dragConstraints={{ left: 0, right: 0 }}
          style={{
            borderRadius: "1rem",
            background: "blue",
            position: "relative",
            bottom: receivedCard ? undefined : "2rem",
            left: receivedCard ? "-3rem" : undefined,
          }}
        >
          This is a card!
        </motion.div>
      </div>
    </>
  );
};
