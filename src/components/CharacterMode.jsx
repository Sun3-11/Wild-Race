import { useEffect } from "react";
import { useAnimations } from "@react-three/drei";

export function CharacterModel({ scene, animations, selection, playing }) {
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (!actions) return;
    if (playing) {
      actions.walk?.reset().fadeIn(0.3).play();
      actions.fun?.fadeOut(0.3);
    } else {
      actions.fun?.reset().fadeIn(0.3).play();
      actions.walk?.fadeOut(0.3);
    }
  }, [playing, actions]);

  return (
    <primitive object={scene} scale={selection === "timon" ? 0.2 : 0.03} />
  );
}
