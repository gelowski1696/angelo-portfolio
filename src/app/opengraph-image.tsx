import { ImageResponse } from "next/og";
import { portfolio } from "@/data/portfolio";

export const alt = `${portfolio.name} — Full-Stack Developer portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "64px",
        background: "#081426",
        color: "#f4f1eb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", color: "#f28c5a", fontSize: 24 }}>
        &lt;{portfolio.name} /&gt;
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 104,
            fontWeight: 700,
            letterSpacing: "-6px",
            lineHeight: 0.92,
            textTransform: "uppercase",
          }}
        >
          I build what’s next.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            color: "#aab6c8",
            fontSize: 25,
          }}
        >
          Full-stack development · Business systems · Product delivery
        </div>
      </div>
    </div>,
    size,
  );
}

