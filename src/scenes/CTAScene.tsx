import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

const EXT = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const fi = (f: number, from: number, to: number, a = 0, b = 1) =>
  interpolate(f, [from, to], [a, b], EXT);

export const CTAScene = () => {
  const frame = useCurrentFrame();

  const bgOpacity = fi(frame, 0, 30);
  const headOpacity = fi(frame, 20, 55);
  const headY = fi(frame, 20, 55, 30, 0);
  const subOpacity = fi(frame, 55, 90);
  const subY = fi(frame, 55, 90, 20, 0);
  const lineWidth = fi(frame, 80, 120, 0, 300);
  const ctaOpacity = fi(frame, 120, 160);
  const ctaScale = fi(frame, 120, 160, 0.9, 1);
  const footerOpacity = fi(frame, 200, 240);

  const p1 = 200 + Math.sin(frame * 0.1) * 30;
  const p2 = 330 + Math.sin(frame * 0.08 + 1) * 40;
  const p3 = 460 + Math.sin(frame * 0.06 + 2) * 50;

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #071020 0%, #0F2A50 50%, #071020 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        opacity: bgOpacity,
      }}
    >
      {/* Pulsing background rings */}
      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.08,
        }}
        viewBox="0 0 1280 720"
      >
        <circle cx="640" cy="360" r={p1} fill="none" stroke="#1E90FF" strokeWidth="2" />
        <circle cx="640" cy="360" r={p2} fill="none" stroke="#1E90FF" strokeWidth="1.5" />
        <circle cx="640" cy="360" r={p3} fill="none" stroke="#1E90FF" strokeWidth="1" />
      </svg>

      {/* Main headline */}
      <div
        style={{
          opacity: headOpacity,
          transform: `translateY(${headY}px)`,
          textAlign: "center",
          maxWidth: 900,
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 900,
            color: "#FFFFFF",
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
          }}
        >
          Ready to Walk{" "}
          <span style={{ color: "#00D4AA" }}>Pain-Free?</span>
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          textAlign: "center",
          maxWidth: 700,
          marginTop: 20,
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: "#A8B8D8",
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          Ask your healthcare provider about{" "}
          <strong style={{ color: "#1E90FF" }}>
            Extracorporeal Shock Wave Therapy
          </strong>{" "}
          for plantar fasciitis.
        </div>
      </div>

      {/* Animated gradient divider */}
      <div
        style={{
          marginTop: 36,
          width: lineWidth,
          height: 2,
          background:
            "linear-gradient(90deg, transparent, #1E90FF, #00D4AA, transparent)",
          borderRadius: 1,
          opacity: subOpacity,
        }}
      />

      {/* CTA pill */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `scale(${ctaScale})`,
          marginTop: 36,
          background: "linear-gradient(135deg, #1E90FF, #00A8D4)",
          borderRadius: 50,
          padding: "16px 48px",
          fontSize: 20,
          fontWeight: 700,
          color: "#FFFFFF",
          letterSpacing: "0.5px",
          boxShadow: "0 0 40px rgba(30,144,255,0.4)",
        }}
      >
        Talk to Your Doctor Today
      </div>

      {/* Key points row */}
      <div
        style={{
          opacity: footerOpacity,
          marginTop: 40,
          display: "flex",
          gap: 40,
        }}
      >
        {[
          "✓ Non-Invasive",
          "✓ FDA-Cleared",
          "✓ Proven Results",
          "✓ No Surgery",
        ].map((item) => (
          <div
            key={item}
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#00D4AA",
              letterSpacing: "0.3px",
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
