import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GameProps } from "../MiniGame";
import Repeatable from "react-repeatable"; //https://github.com/cheton/react-repeatable

interface FuelTankProps {
  progress: number;
}

const FuelTank = ({ progress }: FuelTankProps) => {
  return (
    <>
      <svg
        viewBox="0 0 100 100"
        y="0"
        x="0"
        id="svg_fueltank"
        version="1.1"
        width="242px"
        height="242px"
        style={{
          width: "100%",
          height: "100%",
          backgroundSize: "initial",
          backgroundPositionY: "initial",
          backgroundPositionX: "initial",
          backgroundOrigin: "initial",
          backgroundImage: "initial",
          backgroundClip: "initial",
          backgroundAttachment: "initial",
          animationPlayState: "paused",
        }}
      >
        <g
          className="ldl-scale"
          style={{
            transformOrigin: "50% 50%",
            transform: "rotate(0deg) scale(0.8, 0.8)",
            animationPlayState: "paused",
          }}
        >
          <path
            fill="#d1d1d1"
            d="M22.6 92.5c-4.617 0-8.372-3.756-8.372-8.372V22.402c0-4.617 3.756-8.372 8.372-8.372h22.948c4.295 0 8.209 3.167 9.104 7.366l.876 4.099c.142.666 1.136 1.818 1.774 2.056l.955.356a5.55 5.55 0 0 1 .99-2.274l11.166-15.262C71.672 8.653 73.946 7.5 76.072 7.5h4.259c1.718 0 3.293.759 4.319 2.082 1.025 1.323 1.369 3.036.942 4.7l-5.134 19.976a5.624 5.624 0 0 1-1.779 2.865c1.423 1.799 2.3 4.049 2.301 6.277v40.728c0 4.617-3.756 8.372-8.372 8.372H22.6z"
            style={{ fill: "rgb(209, 209, 209)", animationPlayState: "paused" }}
          ></path>
          <defs>
            <linearGradient
              id="top-to-bottom"
              gradientTransform="rotate(0 .5 .5)"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop
                offset={`${progress * 100}%`}
                stopColor="rgb(70, 70, 70)"
              ></stop>
              <stop offset={`${progress * 100}%`} stopColor="#fff"></stop>
            </linearGradient>
          </defs>

          <path
            fill="url(#top-to-bottom)"
            d="M72.857 38.05l-17.093-6.371c-2.045-.762-4.088-3.13-4.544-5.263l-.877-4.102c-.454-2.133-2.613-3.878-4.794-3.878H22.6a3.978 3.978 0 0 0-3.966 3.966v61.725a3.978 3.978 0 0 0 3.966 3.966h50.007a3.979 3.979 0 0 0 3.966-3.966V43.401c-.001-2.181-1.673-4.589-3.716-5.351zM24.177 27.8a3.966 3.966 0 0 1 3.966-3.966h14.1a3.966 3.966 0 1 1 0 7.932h-14.1a3.965 3.965 0 0 1-3.966-3.966zM56.67 75.825c-6.217 6.584-17.217 4.636-20.663-4.006-1.221-3.061-1.023-6.153-.086-9.244 1.217-4.015 3.136-7.703 5.287-11.282 1.878-3.123 3.97-6.1 6.171-9.002.054-.071.118-.135.254-.289.816 1.107 1.606 2.139 2.355 3.2 3.004 4.258 5.793 8.644 7.876 13.443.995 2.293 1.824 4.642 2.098 7.146.422 3.84-.639 7.225-3.292 10.034zm-12.476-5.592c-1.517-2.304-2.423-4.82-2.392-7.592.018-1.585.251-3.167.38-4.673.03-.039-.016.005-.042.058-1.101 2.237-2.127 4.5-2.719 6.943-.687 2.837-.267 5.464 1.275 7.924.582.927 1.427 1.492 2.496 1.707.887.179 1.72-.145 2.161-.832.483-.75.263-1.449-.189-2.12-.318-.473-.655-.937-.97-1.415zM76.19 33.161a1.17 1.17 0 0 1-1.569.82l-11.36-4.218c-.682-.253-.889-.94-.459-1.527L73.97 12.973c.43-.587 1.375-1.067 2.102-1.067h4.259c.727 0 1.174.576.993 1.28L76.19 33.161z"
          ></path>
        </g>
      </svg>
    </>
  );
};

export const GameFuelTank = ({ onFinish }: GameProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress >= 1) {
      onFinish();
    }
    return () => {};
  }, [progress, onFinish]);

  return (
    <>
      <p>fuel tank</p>
      <FuelTank progress={progress} />
      <Repeatable
        style={{ padding: "1rem", paddingLeft: "2rem", paddingRight: "2rem" }}
        tag="button"
        type="button"
        onHold={() => {
          setProgress(progress + 0.01);
        }}
      >
        Fuel
      </Repeatable>
    </>
  );
};
