import { AbsoluteFill, Sequence } from "remotion";
import { TitleScene } from "./scenes/TitleScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { SolutionScene } from "./scenes/SolutionScene";
import { BenefitsScene } from "./scenes/BenefitsScene";
import { CTAScene } from "./scenes/CTAScene";

// Scene timing at 30fps:
// TitleScene:     0–89    (3s)
// ProblemScene:  90–539   (15s)
// SolutionScene: 540–1049 (17s)
// BenefitsScene: 1050–1499(15s)
// CTAScene:      1500–1799(10s)
export const ShockwaveVideo = () => {
  return (
    <AbsoluteFill style={{ background: "#0A1628" }}>
      <Sequence durationInFrames={90}>
        <TitleScene />
      </Sequence>
      <Sequence from={90} durationInFrames={450}>
        <ProblemScene />
      </Sequence>
      <Sequence from={540} durationInFrames={510}>
        <SolutionScene />
      </Sequence>
      <Sequence from={1050} durationInFrames={450}>
        <BenefitsScene />
      </Sequence>
      <Sequence from={1500} durationInFrames={300}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
