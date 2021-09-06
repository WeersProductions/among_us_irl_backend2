import { GameProps } from "./MiniGame";
import { motion } from "framer-motion";
import LineTo from "react-lineto";
import { useEffect, useState } from "react";

const ColorTypes = [
  {
    color: "red",
    id: 0,
  },
  {
    color: "blue",
    id: 1,
  },
  {
    color: "green",
    id: 2,
  },
  {
    color: "yellow",
    id: 3,
  },
];

const useForceUpdate = () => {
  const [value, setValue] = useState(0);
  return () => setValue((value) => ++value);
};

export const GameElectricWires = ({ onFinish }: GameProps) => {
  const [randomOrder, setRandomOrder] = useState([0, 1, 2, 3]);
  const [ACorrect, setACorrect] = useState(false);
  const [BCorrect, setBCorrect] = useState(false);
  const [CCorrect, setCCorrect] = useState(false);
  const [DCorrect, setDCorrect] = useState(false);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    // Randomize
    let newOrder: number[] = [];
    for (var i = randomOrder.length - 1; i >= 0; i--) {
      newOrder.push(
        randomOrder.splice(Math.floor(Math.random() * randomOrder.length), 1)[0]
      );
    }
    setRandomOrder(newOrder);
    return () => {};
  }, []);

  // 0
  useEffect(() => {
    let wrapper = document.getElementById("wrapper");

    let target = document.getElementsByClassName("B-0")[0];
    let source = document.getElementById("target0")!.getBoundingClientRect();

    let callback = (entries: { boundingClientRect: DOMRect }[]) => {
      console.log(entries);
      entries.forEach((entry) => {
        const xInRange =
          entry.boundingClientRect.x > source.x - 0.5 * source.width - 200 &&
          entry.boundingClientRect.x < source.x + 0.5 * source.width + 200;
        const yInRange =
          entry.boundingClientRect.y > source.y - 0.5 * source.height - 200 &&
          entry.boundingClientRect.y < source.y + 0.5 * source.height + 200;
        let doesOverlap = xInRange && yInRange;
        setACorrect(doesOverlap);
      });
    };

    let io = new IntersectionObserver(callback, {
      root: wrapper,
      threshold: [0, 0.1, 0.95, 1],
    });
    io.observe(target);

    wrapper?.addEventListener("touchend", () => {
      callback([{ boundingClientRect: target.getBoundingClientRect() }]);
    });

    return () => {
      io.unobserve(target);
    };
  }, [randomOrder]);

  // 1
  useEffect(() => {
    let wrapper = document.getElementById("wrapper");

    let target = document.getElementsByClassName("B-1")[0];
    let source = document.getElementById("target1")!.getBoundingClientRect();

    let callback = (entries: { boundingClientRect: DOMRect }[]) => {
      entries.forEach((entry) => {
        const xInRange =
          entry.boundingClientRect.x > source.x - 0.5 * source.width - 200 &&
          entry.boundingClientRect.x < source.x + 0.5 * source.width + 200;
        const yInRange =
          entry.boundingClientRect.y > source.y - 0.5 * source.height - 200 &&
          entry.boundingClientRect.y < source.y + 0.5 * source.height + 200;
        let doesOverlap = xInRange && yInRange;
        setBCorrect(doesOverlap);
      });
    };

    let io = new IntersectionObserver(callback, {
      root: wrapper,
      threshold: [0, 0.1, 0.95, 1],
    });
    io.observe(target);

    wrapper?.addEventListener("touchend", () => {
      callback([{ boundingClientRect: target.getBoundingClientRect() }]);
    });

    return () => {
      io.unobserve(target);
    };
  }, [randomOrder]);

  // 2
  useEffect(() => {
    let wrapper = document.getElementById("wrapper");

    let target = document.getElementsByClassName("B-2")[0];
    let source = document.getElementById("target2")!.getBoundingClientRect();

    let callback = (entries: { boundingClientRect: DOMRect }[]) => {
      entries.forEach((entry) => {
        const xInRange =
          entry.boundingClientRect.x > source.x - 0.5 * source.width - 200 &&
          entry.boundingClientRect.x < source.x + 0.5 * source.width + 200;
        const yInRange =
          entry.boundingClientRect.y > source.y - 0.5 * source.height - 200 &&
          entry.boundingClientRect.y < source.y + 0.5 * source.height + 200;
        let doesOverlap = xInRange && yInRange;
        setCCorrect(doesOverlap);
      });
    };

    let io = new IntersectionObserver(callback, {
      root: wrapper,
      threshold: [0, 0.1, 0.95, 1],
    });
    io.observe(target);

    wrapper?.addEventListener("touchend", () => {
      callback([{ boundingClientRect: target.getBoundingClientRect() }]);
    });

    return () => {
      io.unobserve(target);
    };
  }, [randomOrder]);

  // 3
  useEffect(() => {
    let wrapper = document.getElementById("wrapper");

    let target = document.getElementsByClassName("B-3")[0];
    let source = document.getElementById("target3")!.getBoundingClientRect();

    let callback = (entries: { boundingClientRect: DOMRect }[]) => {
      entries.forEach((entry) => {
        const xInRange =
          entry.boundingClientRect.x > source.x - 0.5 * source.width - 200 &&
          entry.boundingClientRect.x < source.x + 0.5 * source.width + 200;
        const yInRange =
          entry.boundingClientRect.y > source.y - 0.5 * source.height - 200 &&
          entry.boundingClientRect.y < source.y + 0.5 * source.height + 200;
        let doesOverlap = xInRange && yInRange;
        setDCorrect(doesOverlap);
      });
    };

    let io = new IntersectionObserver(callback, {
      root: wrapper,
      threshold: [0, 0.1, 0.95, 1],
    });
    io.observe(target);

    wrapper?.addEventListener("touchend", () => {
      callback([{ boundingClientRect: target.getBoundingClientRect() }]);
    });

    return () => {
      io.unobserve(target);
    };
  }, [randomOrder]);

  useEffect(() => {
    if (ACorrect && BCorrect && CCorrect && DCorrect) {
      onFinish();
    }
    return () => {};
  }, [ACorrect, BCorrect, CCorrect, DCorrect, onFinish]);

  useEffect(() => {
    let timeout = setTimeout(() => {
      onFinish();
    }, 8000);

    return () => {
      clearTimeout(timeout);
    };
  }, [onFinish]);

  const leftSide = randomOrder.map((colorIndex) => {
    const colorType = ColorTypes[colorIndex];
    return (
      <div key={`${colorType.id}-Container`}>
        <div
          className={`A-${colorType.id}`}
          key={`${colorType.id} - 0`}
          style={{
            zIndex: 1,
            position: "absolute",
            background: colorType.color,
            padding: "1.5rem",
            borderRadius: "0.5rem",
          }}
        />
        <motion.div
          className={`B-${colorType.id}`}
          key={`${colorType.id} - 1`}
          style={{
            zIndex: 2,
            position: "relative",
            background: colorType.color,
            padding: "1.5rem",
            borderRadius: "0.5rem",
          }}
          onDrag={() => forceUpdate()}
          drag
          dragMomentum={false}
        />
        <LineTo
          key={`${colorType.id} - 2`}
          from={`A-${colorType.id}`}
          to={`B-${colorType.id}`}
          fromAnchor="middle right"
          toAnchor="middle left"
          borderWidth={3}
          borderColor={colorType.color}
        />
      </div>
    );
  });

  const rightSide = ColorTypes.map((colorType) => {
    return (
      <div
        id={`target${colorType.id}`}
        key={`${colorType.id}-target`}
        style={{
          background: colorType.color,
          padding: "1.5rem",
          borderRadius: "0.5rem",
        }}
      />
    );
  });

  return (
    <>
      <p>Electric wires (if it doesn't work it will finish after 8s)</p>
      {/* <button onClick={onFinish}>Finish!</button> */}
      <div id={"wrapper"} style={{ display: "flex", gap: "1rem" }}>
        <div style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
          {leftSide}
        </div>
        <div style={{ width: "50vw" }} />
        <motion.div
          style={{ gap: "1rem", display: "flex", flexDirection: "column" }}
        >
          {rightSide}
        </motion.div>
      </div>
    </>
  );
};
