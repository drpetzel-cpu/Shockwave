import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

const EXT = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const fi = (f: number, from: number, to: number, a = 0, b = 1) =>
  interpolate(f, [from, to], [a, b], EXT);

export const TitleScene = () => {
  const frame = useCurrentFrame();

  const logoScale = fi(frame, 0, 25, 0.3, 1);
  const logoOpacity = fi(frame, 0, 20);
  const titleOpacity = fi(frame, 20, 45);
  const titleY = fi(frame, 20, 45, 40, 0);
  const subOpacity = fi(frame, 40, 65);
  const lineWidth = fi(frame, 55, 85, 0, 220);

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #0A1628 0%, #1A2F5A 60%, #0A1628 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Subtle background rings */}
      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.07,
        }}
        viewBox="0 0 1280 720"
      >
        {[300, 450, 600, 750].map((r, i) => (
          <circle
            key={i}
            cx="640"
            cy="360"
            r={r}
            fill="none"
            stroke="#1E90FF"
            strokeWidth="1.5"
          />
        ))}
      </svg>

      {/* Foot + wave logo mark */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: 28,
        }}
      >
        <svg width="140" height="90" viewBox="0 0 280 180">
          {/* Foot silhouette */}
          <path
            d="M 50,165 C 40,145 35,120 35,95 C 35,50 60,22 105,10 C 140,0 175,5 195,20 C 215,35 215,60 220,85 C 224,105 238,120 255,132 C 270,142 280,146 284,152 C 288,158 285,167 275,170 C 200,178 90,178 50,165 Z"
            fill="#C4855A"
          />
          {/* Plantar fascia band */}
          <path
            d="M 53,162 Q 165,172 274,165"
            stroke="#FF5722"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          {/* Shock wave arcs */}
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M ${40 + i * 15},${142 - i * 12} C ${58 + i * 15},${
                118 - i * 12
              } ${50 + i * 15},${98 - i * 12} ${65 + i * 15},${80 - i * 12}`}
              stroke="#1E90FF"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              opacity={0.9 - i * 0.25}
            />
          ))}
        </svg>
      </div>

      {/* Main title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: "-2px",
            lineHeight: 1,
          }}
        >
          Shockwave
          <span style={{ color: "#1E90FF" }}> Therapy</span>
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subOpacity,
          marginTop: 18,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: "#A8B8D8",
            letterSpacing: "0.3px",
          }}
        >
          The breakthrough solution for{" "}
          <span style={{ color: "#00D4AA", fontWeight: 600 }}>
            Plantar Fasciitis
          </span>
        </div>
      </div>

      {/* Animated divider */}
      <div
        style={{
          marginTop: 30,
          width: lineWidth,
          height: 3,
          background: "linear-gradient(90deg, #1E90FF, #00D4AA)",
          borderRadius: 2,
          opacity: subOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
