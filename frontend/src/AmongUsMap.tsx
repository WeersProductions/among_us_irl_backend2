interface AmongUsMapProps {
  taskLocations?: number[];
}

const PointMap = [
  <circle key={0} className="cls-5" cx="353.6" cy="340.04" r="7.35" />, // traphuis
  <circle key={1} className="cls-5" cx="450" cy="130" r="7.35" />, // kamer 11
  <circle key={2} className="cls-5" cx="109.12" cy="336.71" r="7.35" />, // douwie
  <circle key={3} className="cls-5" cx="520.95" cy="225.06" r="7.35" />, // brandtrap
  <circle key={4} className="cls-5" cx="440.19" cy="251.02" r="7.35" />, // badkamer
  <circle key={5} className="cls-5" cx="187.53" cy="123.79" r="7.35" />, // rudi
  <circle key={6} className="cls-5" cx="429.9" cy="454.57" r="7.35" />, // balkon
  <circle key={7} className="cls-5" cx="379.9" cy="285.57" r="7.35" />, // trapkast
];

export const AmongUsMap = ({ taskLocations }: AmongUsMapProps) => {
  return (
    <svg
      style={{ transform: "scale(0.85)" }}
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 563.6 471.74"
    >
      <defs>
        <style>{`.cls-1{fill:#fff;}.cls-1,.cls-2,.cls-3,.cls-4{stroke:#231f20;stroke-miterlimit:10;}.cls-2{fill:#c49a6c;}.cls-3{fill:#939598;}.cls-4{fill:#414042;}.cls-5{fill:#be1e2d;}.cls-6{fill:#00a651;}`}</style>
      </defs>
      <rect className="cls-1" x="0.5" y="303.92" width="76.69" height="100" />
      <rect
        className="cls-1"
        x="77.19"
        y="336.09"
        width="63.86"
        height="67.83"
      />
      <rect
        className="cls-1"
        x="141.05"
        y="287.58"
        width="67.82"
        height="116.34"
      />
      <rect
        className="cls-1"
        x="208.87"
        y="287.58"
        width="72.98"
        height="116.34"
      />
      <rect
        className="cls-1"
        x="77.19"
        y="197.98"
        width="120.3"
        height="60.39"
      />
      <rect
        className="cls-1"
        x="77.19"
        y="134.84"
        width="120.3"
        height="63.14"
      />
      <rect
        className="cls-1"
        x="77.19"
        y="77.18"
        width="97.77"
        height="57.66"
      />
      <rect className="cls-1" x="77.19" y="0.5" width="137.36" height="76.68" />
      <rect
        className="cls-1"
        x="269.89"
        y="77.18"
        width="76.33"
        height="96.35"
      />
      <rect
        className="cls-1"
        x="346.22"
        y="77.18"
        width="76.33"
        height="96.35"
      />
      <rect
        className="cls-2"
        x="422.55"
        y="77.18"
        width="63.86"
        height="67.83"
      />
      <rect
        className="cls-1"
        x="486.41"
        y="76.33"
        width="76.69"
        height="137.35"
      />
      <rect
        className="cls-3"
        x="427.89"
        y="238.57"
        width="82.16"
        height="63.86"
      />
      <rect
        className="cls-3"
        x="396.5"
        y="238.57"
        width="31.39"
        height="63.86"
      />
      <rect
        className="cls-3"
        x="366.79"
        y="238.57"
        width="29.71"
        height="63.86"
      />
      <path
        className="cls-2"
        d="M438.52,345.87V489.12H581.78V345.87Zm91.34,84.26a25.3,25.3,0,1,1,25.3-25.3A25.3,25.3,0,0,1,529.86,430.13Z"
        transform="translate(-71.73 -43.44)"
      />
      <rect
        className="cls-1"
        x="366.79"
        y="445.68"
        width="143.26"
        height="25.56"
      />
      <polygon
        className="cls-2"
        points="510.05 213.68 510.05 238.57 366.79 238.57 366.79 329.66 281.85 329.66 281.85 287.58 141.05 287.58 141.05 336.09 77.19 336.09 77.19 258.37 197.49 258.37 197.49 134.84 174.96 134.84 174.96 77.18 269.89 77.18 269.89 173.53 422.55 173.53 422.55 145.01 486.41 145.01 486.41 213.68 510.05 213.68"
      />
      <path
        className="cls-4"
        d="M555.16,404.83a25.3,25.3,0,1,1-25.3-25.3A25.3,25.3,0,0,1,555.16,404.83Z"
        transform="translate(-71.73 -43.44)"
      />
      {taskLocations &&
        taskLocations.map((taskLocation) => PointMap[taskLocation])}

      {/* {PointMap} */}
      <circle className="cls-6" cx="458.14" cy="361.39" r="7.35" />
    </svg>
  );
};
