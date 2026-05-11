import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

const EXT = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const fi = (f: number, from: number, to: number, a = 0, b = 1) =>
  interpolate(f, [from, to], [a, b], EXT);

const makeWave = (frame: number, offset: number) => {
  const cycle = 25;
  const t = ((frame + offset) % cycle) / cycle;
  return { r: t * 72, opacity: (1 - t) * 0.85 };
};

const Diagram = ({
  frame,
  footOpacity,
}: {
  frame: number;
  footOpacity: number;
}) => {
  const waves = [0, 8, 16].map((offset) => makeWave(frame, offset));

  return (
    <svg
      width="420"
      height="270"
      viewBox="0 0 420 270"
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id="waveGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Foot body */}
      <path
        d="M 80,220 L 77,182 C 75,148 92,118 122,98 C 148,80 182,72 215,74 C 248,76 272,90 284,112 C 294,130 295,150 310,165 C 323,178 337,183 345,186 C 353,189 357,195 352,200 C 330,210 105,235 80,220 Z"
        fill="#C4855A"
        stroke="#A06030"
        strokeWidth="1.5"
        opacity={footOpacity}
      />

      {/* Plantar fascia */}
      <path
        d="M 84,215 Q 218,229 350,196"
        stroke="#FF5722"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity={footOpacity * 0.7}
      />

      {/* Probe handle */}
      <g opacity={footOpacity} transform="translate(14,112) rotate(-18)">
        <rect x="0" y="0" width="28" height="72" rx="8" fill="#3A5F8A" />
        <rect x="3" y="4" width="8" height="28" rx="4" fill="#5A7FAA" opacity="0.6" />
        {/* Probe head */}
        <rect x="-4" y="72" width="36" height="16" rx="6" fill="#1E6AAA" />
        <rect x="8" y="88" width="12" height="6" rx="2" fill="#1E90FF" />
      </g>

      {/* Animated shock waves */}
      {waves.map((w, i) => (
        <path
          key={i}
          d={`M 60,208 A ${w.r},${w.r} 0 0,1 ${60 + w.r * 0.68},${208 - w.r * 0.68}`}
          stroke="#1E90FF"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity={w.opacity * footOpacity}
          filter="url(#waveGlow)"
        />
      ))}

      {/* Badges */}
      <rect
        x="130"
        y="18"
        width="116"
        height="26"
        rx="13"
        fill="#00D4AA20"
        stroke="#00D4AA"
        strokeWidth="1.5"
        opacity={footOpacity}
      />
      <text
        x="188"
        y="36"
        textAnchor="middle"
        fill="#00D4AA"
        fontSize="12"
        fontFamily="system-ui"
        fontWeight="700"
        opacity={footOpacity}
      >
        Non-Invasive
      </text>
      <rect
        x="258"
        y="18"
        width="96"
        height="26"
        rx="13"
        fill="#1E90FF20"
        stroke="#1E90FF"
        strokeWidth="1.5"
        opacity={footOpacity}
      />
      <text
        x="306"
        y="36"
        textAnchor="middle"
        fill="#1E90FF"
        fontSize="12"
        fontFamily="system-ui"
        fontWeight="700"
        opacity={footOpacity}
      >
        FDA-Cleared
      </text>
    </svg>
  );
};

interface StepProps {
  num: string;
  title: string;
  desc: string;
  opacity: number;
  y: number;
}

const Step = ({ num, title, desc, opacity, y }: StepProps) => (
  <div
    style={{
      opacity,
      transform: `translateY(${y}px)`,
      display: "flex",
      gap: 16,
      marginBottom: 20,
      alignItems: "flex-start",
    }}
  >
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #1E90FF, #00D4AA)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        fontWeight: 800,
        color: "#fff",
        flexShrink: 0,
      }}
    >
      {num}
    </div>
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
      <div style={{ fontSize: 14, color: "#8AA0C8", lineHeight: 1.55 }}>
        {desc}
      </div>
    </div>
  </div>
);

export const SolutionScene = () => {
  const frame = useCurrentFrame();

  const headerOpacity = fi(frame, 0, 30);
  const headerY = fi(frame, 0, 30, -20, 0);
  const diagOpacity = fi(frame, 25, 90);

  const s1o = fi(frame, 150, 180);
  const s1y = fi(frame, 150, 180, 25, 0);
  const s2o = fi(frame, 250, 280);
  const s2y = fi(frame, 250, 280, 25, 0);
  const s3o = fi(frame, 350, 380);
  const s3y = fi(frame, 350, 380, 25, 0);

  const barOpacity = fi(frame, 440, 480);
  const barScale = fi(frame, 440, 480, 0.85, 1);

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
            color: "#1E90FF",
            fontWeight: 700,
            letterSpacing: "3.5px",
            marginBottom: 6,
            textTransform: "uppercase",
          }}
        >
          The Solution
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 800,
            color: "#FFFFFF",
            lineHeight: 1.1,
          }}
        >
          Extracorporeal Shock Wave Therapy{" "}
          <span style={{ color: "#1E90FF" }}>(ESWT)</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div
        style={{ display: "flex", flex: 1, gap: 50, alignItems: "flex-start" }}
      >
        {/* Left: Animated diagram */}
        <div style={{ width: 420, flexShrink: 0 }}>
          <Diagram frame={frame} footOpacity={diagOpacity} />
          <div
            style={{
              opacity: diagOpacity,
              fontSize: 13,
              color: "#8AA0C8",
              textAlign: "center",
              marginTop: 4,
              lineHeight: 1.6,
            }}
          >
            High-energy acoustic waves delivered directly
            <br />
            to the site of injury
          </div>
        </div>

        {/* Right: How it works */}
        <div style={{ flex: 1, paddingTop: 16 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#A8B8D8",
              marginBottom: 20,
              letterSpacing: "2px",
              textTransform: "uppercase",
              opacity: fi(frame, 100, 130),
            }}
          >
            How It Works
          </div>

          <Step
            num="1"
            title="Acoustic waves reach injured tissue"
            desc="Precisely calibrated pulses of acoustic energy are delivered through the skin directly to the inflamed plantar fascia and heel bone."
            opacity={s1o}
            y={s1y}
          />
          <Step
            num="2"
            title="Stimulates the healing response"
            desc="The mechanical stimulation triggers increased blood flow, collagen production, and growth factors that repair damaged tissue."
            opacity={s2o}
            y={s2y}
          />
          <Step
            num="3"
            title="Breaks down calcium deposits"
            desc="Shock waves dissolve calcifications and scar tissue that drive chronic pain, letting the body reabsorb and clear them naturally."
            opacity={s3o}
            y={s3y}
          />

          {/* Quick-stats bar */}
          <div
            style={{
              opacity: barOpacity,
              transform: `scale(${barScale})`,
              transformOrigin: "left center",
              display: "flex",
              marginTop: 12,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {[
              { label: "Sessions", val: "3–5" },
              { label: "Per session", val: "15–20 min" },
              { label: "Downtime", val: "Minimal" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background:
                    i % 2 === 0
                      ? "rgba(30,144,255,0.12)"
                      : "rgba(0,212,170,0.10)",
                  padding: "12px 16px",
                  borderRight:
                    i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: i % 2 === 0 ? "#1E90FF" : "#00D4AA",
                  }}
                >
                  {item.val}
                </div>
                <div style={{ fontSize: 12, color: "#8AA0C8", marginTop: 2 }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
