import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const EXT = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const fi = (f: number, from: number, to: number, a = 0, b = 1) =>
  interpolate(f, [from, to], [a, b], EXT);

interface BenefitCardProps {
  icon: string;
  stat: string;
  title: string;
  desc: string;
  color: string;
  opacity: number;
  scale: number;
}

const BenefitCard = ({
  icon,
  stat,
  title,
  desc,
  color,
  opacity,
  scale,
}: BenefitCardProps) => (
  <div
    style={{
      opacity,
      transform: `scale(${scale})`,
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${color}30`,
      borderTop: `3px solid ${color}`,
      borderRadius: 14,
      padding: "28px 26px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
    <div
      style={{
        fontSize: 44,
        fontWeight: 900,
        color,
        marginBottom: 4,
        lineHeight: 1,
      }}
    >
      {stat}
    </div>
    <div
      style={{
        fontSize: 17,
        fontWeight: 700,
        color: "#FFFFFF",
        marginBottom: 8,
      }}
    >
      {title}
    </div>
    <div style={{ fontSize: 13, color: "#8AA0C8", lineHeight: 1.6 }}>{desc}</div>
  </div>
);

export const BenefitsScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = fi(frame, 0, 25);
  const headerY = fi(frame, 0, 25, -20, 0);

  const sp = (startFrame: number) =>
    spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 14, stiffness: 90, mass: 0.8 },
    });

  const s1 = frame >= 30 ? sp(30) : 0;
  const s2 = frame >= 120 ? sp(120) : 0;
  const s3 = frame >= 210 ? sp(210) : 0;
  const s4 = frame >= 300 ? sp(300) : 0;

  const o1 = fi(frame, 30, 50);
  const o2 = fi(frame, 120, 140);
  const o3 = fi(frame, 210, 230);
  const o4 = fi(frame, 300, 320);

  const cards: BenefitCardProps[] = [
    {
      icon: "✅",
      stat: "85%+",
      title: "Success Rate",
      desc: "The majority of patients experience significant or complete relief from plantar fasciitis pain after ESWT.",
      color: "#00D4AA",
      opacity: o1,
      scale: s1,
    },
    {
      icon: "⚡",
      stat: "3–5",
      title: "Sessions Only",
      desc: "Short in-office treatments, typically 15–20 minutes each, spaced one to two weeks apart.",
      color: "#1E90FF",
      opacity: o2,
      scale: s2,
    },
    {
      icon: "🏃",
      stat: "Fast",
      title: "Return to Activity",
      desc: "Most patients resume normal activities quickly — no lengthy recovery or immobilization required.",
      color: "#7B68EE",
      opacity: o3,
      scale: s3,
    },
    {
      icon: "🔬",
      stat: "Root",
      title: "Cause Treatment",
      desc: "Unlike pain medications that mask symptoms, ESWT triggers genuine tissue repair and regeneration.",
      color: "#FFB347",
      opacity: o4,
      scale: s4,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "#0A1628",
        padding: "36px 55px 36px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#00D4AA",
            fontWeight: 700,
            letterSpacing: "3.5px",
            marginBottom: 6,
            textTransform: "uppercase",
          }}
        >
          Why Choose ESWT
        </div>
        <div
          style={{ fontSize: 40, fontWeight: 800, color: "#FFFFFF" }}
        >
          Proven Benefits of{" "}
          <span style={{ color: "#1E90FF" }}>Shockwave Therapy</span>
        </div>
      </div>

      {/* 2x2 card grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          flex: 1,
        }}
      >
        {cards.map((card, i) => (
          <BenefitCard key={i} {...card} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
