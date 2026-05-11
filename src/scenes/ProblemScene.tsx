import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

const EXT = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const fi = (f: number, from: number, to: number, a = 0, b = 1) =>
  interpolate(f, [from, to], [a, b], EXT);

const Foot = ({ opacity, pulse }: { opacity: number; pulse: number }) => (
  <svg
    width="380"
    height="240"
    viewBox="0 0 380 240"
    style={{ overflow: "visible" }}
  >
    <defs>
      <filter id="heelGlow">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="fasciaGlow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Foot body */}
    <path
      d="M 45,205 L 42,165 C 40,130 55,100 85,80 C 112,62 150,54 185,56 C 218,58 245,72 258,95 C 268,112 270,135 285,150 C 298,163 315,168 325,172 C 335,176 340,182 335,188 C 310,200 80,220 45,205 Z"
      fill="#C4855A"
      stroke="#A06030"
      strokeWidth="1.5"
      opacity={opacity}
    />

    {/* Arch shading */}
    <path
      d="M 50,202 Q 190,218 332,186"
      fill="none"
      stroke="#A06030"
      strokeWidth="2"
      opacity={opacity * 0.4}
    />

    {/* Plantar fascia highlighted */}
    <path
      d="M 48,200 Q 188,216 330,184"
      stroke="#FF5722"
      strokeWidth="7"
      fill="none"
      strokeLinecap="round"
      opacity={opacity}
      filter="url(#fasciaGlow)"
    />

    {/* Heel pain glow */}
    <ellipse
      cx="55"
      cy="188"
      rx={28 + pulse * 6}
      ry={22 + pulse * 5}
      fill="#FF3B30"
      opacity={(0.45 + pulse * 0.2) * opacity}
      filter="url(#heelGlow)"
    />

    {/* Label: Plantar Fascia */}
    <line
      x1="190"
      y1="218"
      x2="190"
      y2="232"
      stroke="#FF5722"
      strokeWidth="1.5"
      opacity={opacity}
    />
    <text
      x="190"
      y="243"
      textAnchor="middle"
      fill="#FF5722"
      fontSize="12"
      fontFamily="system-ui"
      fontWeight="600"
      opacity={opacity}
    >
      Plantar Fascia
    </text>

    {/* Label: Heel Pain */}
    <line
      x1="55"
      y1="170"
      x2="18"
      y2="148"
      stroke="#FF8C70"
      strokeWidth="1.5"
      opacity={opacity}
    />
    <text
      x="12"
      y="142"
      textAnchor="middle"
      fill="#FF8C70"
      fontSize="11"
      fontFamily="system-ui"
      fontWeight="600"
      opacity={opacity}
    >
      Heel
    </text>
    <text
      x="12"
      y="155"
      textAnchor="middle"
      fill="#FF8C70"
      fontSize="11"
      fontFamily="system-ui"
      fontWeight="600"
      opacity={opacity}
    >
      Pain
    </text>
  </svg>
);

interface CardProps {
  icon: string;
  title: string;
  desc: string;
  color: string;
  opacity: number;
  x: number;
}

const Card = ({ icon, title, desc, color, opacity, x }: CardProps) => (
  <div
    style={{
      opacity,
      transform: `translateX(${x}px)`,
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${color}35`,
      borderLeft: `4px solid ${color}`,
      borderRadius: 12,
      padding: "16px 20px",
      marginBottom: 14,
      display: "flex",
      gap: 14,
      alignItems: "flex-start",
    }}
  >
    <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
    <div>
      <div
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: "#FFFFFF",
          marginBottom: 4,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 14, color: "#8AA0C8", lineHeight: 1.5 }}>
        {desc}
      </div>
    </div>
  </div>
);

export const ProblemScene = () => {
  const frame = useCurrentFrame();

  const headerOpacity = fi(frame, 0, 25);
  const headerY = fi(frame, 0, 25, -20, 0);
  const footOpacity = fi(frame, 20, 80);
  const pulse = Math.sin(frame * 0.14) * 0.5 + 0.5;

  const c1o = fi(frame, 100, 130);
  const c1x = fi(frame, 100, 130, 70, 0);
  const c2o = fi(frame, 190, 220);
  const c2x = fi(frame, 190, 220, 70, 0);
  const c3o = fi(frame, 280, 310);
  const c3x = fi(frame, 280, 310, 70, 0);
  const c4o = fi(frame, 360, 390);
  const c4x = fi(frame, 360, 390, 70, 0);

  return (
    <AbsoluteFill
      style={{
        background: "#0A1628",
        padding: "36px 55px 28px",
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
          marginBottom: 28,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#FF5722",
            fontWeight: 700,
            letterSpacing: "3.5px",
            marginBottom: 6,
            textTransform: "uppercase",
          }}
        >
          The Problem
        </div>
        <div
          style={{ fontSize: 40, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1 }}
        >
          Understanding{" "}
          <span style={{ color: "#FF6B35" }}>Plantar Fasciitis</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div
        style={{
          display: "flex",
          flex: 1,
          gap: 50,
          alignItems: "flex-start",
        }}
      >
        {/* Left: Foot diagram */}
        <div style={{ width: 380, flexShrink: 0 }}>
          <Foot opacity={footOpacity} pulse={pulse} />
          <div
            style={{
              opacity: footOpacity,
              fontSize: 13,
              color: "#8AA0C8",
              textAlign: "center",
              marginTop: 8,
              lineHeight: 1.6,
            }}
          >
            Inflammation of the thick band of tissue
            <br />
            connecting the heel bone to the toes
          </div>
        </div>

        {/* Right: Info cards */}
        <div style={{ flex: 1, paddingTop: 4 }}>
          <Card
            icon="📊"
            title="1 in 10 adults affected"
            desc="The most common cause of heel pain, affecting millions of people worldwide each year."
            color="#FF6B35"
            opacity={c1o}
            x={c1x}
          />
          <Card
            icon="🌅"
            title="Stabbing morning pain"
            desc='Characteristic "first step pain" — sharp and intense on waking, easing with movement but returning after rest.'
            color="#FF5722"
            opacity={c2o}
            x={c2x}
          />
          <Card
            icon="🏃"
            title="Common in active people"
            desc="Runners, hikers, healthcare workers, and anyone on their feet for long hours are at highest risk."
            color="#FFB347"
            opacity={c3o}
            x={c3x}
          />
          <Card
            icon="⏳"
            title="Slow to resolve on its own"
            desc="Without effective treatment, plantar fasciitis can persist for months or years, limiting mobility and quality of life."
            color="#FFA500"
            opacity={c4o}
            x={c4x}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
