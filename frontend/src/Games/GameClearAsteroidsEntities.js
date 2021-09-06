import React, { PureComponent } from "react";
import _ from "lodash";

const all = (entities, ...predicates) => {
  if (!entities) return;
  if (!predicates || predicates.length < 1) return entities;

  if (Array.isArray(entities))
    return entities.filter((e) => _.every(predicates, (p) => p(e)));

  return Object.keys(entities).filter((key) =>
    _.every(predicates, (p) => p(entities[key]))
  );
};

class Box extends PureComponent {
  render() {
    const size = 100;
    const x = this.props.x - size / 2;
    const y = this.props.y - size / 2;
    return (
      <img
        alt="Asteroid"
        src="asteroidSprite.png"
        style={{
          position: "absolute",
          width: size,
          height: size,
          left: x,
          top: y,
          transform: `rotate(${this.props.rotation}deg)`,
        }}
      />
    );
  }
}

export { Box };

const MoveBoxes = (entities, { time }) => {
  const asteroidEntities = all(entities, (e) => e.asteroid);
  if (!asteroidEntities) {
    return entities;
  }
  // Move all boxes to the left.
  asteroidEntities.forEach((e_key) => {
    entities[e_key].x =
      entities[e_key].x - entities[e_key].move_speed * time.delta;
  });
  return entities;
};

const Distance = (x_a, y_a, x_b, y_b) => {
  return Math.sqrt((x_b - x_a) * (x_b - x_a) + (y_a - y_b) * (y_a - y_b));
};

const DestroyBox =
  (onDestroyCall) =>
  (entities, { input }) => {
    //-- I'm choosing to update the game state (entities) directly for the sake of brevity and simplicity.
    //-- There's nothing stopping you from treating the game state as immutable and returning a copy..
    //-- Example: return { ...entities, t.id: { UPDATED COMPONENTS }};
    //-- That said, it's probably worth considering performance implications in either case.

    const { payload } = input.find((x) => x.name === "onMouseDown") || {};

    if (payload) {
      const asteroidEntities = all(entities, (e) => e.asteroid);
      asteroidEntities.forEach((e_key) => {
        const dist = Distance(
          entities[e_key].x,
          entities[e_key].y,
          payload.pageX,
          payload.pageY
        );
        if (dist < 40) {
          //yay
          delete entities[e_key];
          onDestroyCall();
        }
      });
    }

    return entities;
  };

const RotateBox = (entities, { time }) => {
  const asteroidEntities = all(entities, (e) => e.asteroid);
  asteroidEntities.forEach((e_key) => {
    entities[e_key].rotation += time.delta * entities[e_key].rotate_speed;
    entities[e_key].rotation = entities[e_key].rotation % 360;
  });

  return entities;
};

const CreateBox = (entities, { time, window }) => {
  const roundTime = Math.round(time.current / 1000);
  const entityName = `box${roundTime}`;
  if (roundTime % 3 === 0 && !entities[entityName]) {
    const window_height = window.innerHeight;
    entities[entityName] = {
      x: window.innerWidth + 50,
      y: window_height / 3 + Math.random() * (window_height / 3) * 1.2,
      asteroid: true,
      renderer: <Box />,
      rotation: 0,
      move_speed: 0.04 + Math.random() * 0.03,
      rotate_speed:
        (0.02 + Math.random() * 0.02) * (Math.random() > 0.5 ? -1 : 1),
    };
  }
  return entities;
};

const ClearBoxes = (entities, _) => {
  const asteroidEntities = all(entities, (e) => e.asteroid);
  if (!asteroidEntities) {
    return entities;
  }
  asteroidEntities.forEach((e_key) => {
    if (entities[e_key].x <= -50) {
      delete entities[e_key];
    }
  });
  return entities;
};

export { DestroyBox, MoveBoxes, CreateBox, ClearBoxes, RotateBox };
