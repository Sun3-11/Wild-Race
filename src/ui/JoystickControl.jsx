import React, { useEffect, useRef } from "react";
import { useGameStore } from "../stores/gameStore";
import nipplejs from "nipplejs";

export default function JoystickControl() {
  const setMobileInput = useGameStore((s) => s.setMobileInput);
  const joystickRef = useRef(null);

  useEffect(() => {
    const manager = nipplejs.create({
      zone: joystickRef.current,
      mode: "static",
      position: { left: "100px", bottom: "100px" },
      color: "white",
      size: 100,
      restJoystick: true,
    });

    manager.on("move", (_, data) => {
      if (!data.vector) return;

      const side = Math.max(-1, Math.min(1, data.vector.x));
      const forward = Math.max(-1, Math.min(1, data.vector.y));

      setMobileInput({ forward, side });
    });

    manager.on("end", () => {
      setMobileInput({ forward: 0, side: 0 });
    });

    return () => manager.destroy();
  }, [setMobileInput]);

  return (
    <div
      ref={joystickRef}
      style={{
        position: "absolute",
        left: 25,
        bottom: 65,
        width: "200px",
        height: "200px",
        zIndex: 20,
        background: "rgba(0,0,0,0.05)",
        borderRadius: "50%",
      }}
    />
  );
}
