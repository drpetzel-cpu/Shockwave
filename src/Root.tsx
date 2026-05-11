import "./index.css";
import { Composition } from "remotion";
import { ShockwaveVideo } from "./Composition";

export const RemotionRoot = () => {
  return (
    <Composition
      id="ShockwaveTherapy"
      component={ShockwaveVideo}
      durationInFrames={1800}
      fps={30}
      width={1280}
      height={720}
    />
  );
};
