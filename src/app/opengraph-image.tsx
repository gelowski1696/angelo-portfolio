import { ImageResponse } from "next/og";
import { portfolio } from "@/data/portfolio";

export const alt = `${portfolio.name} — Software Engineer portfolio`;
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
        background: "#070a12",
        color: "#eef4ff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", color: "#59d8ff", fontSize: 24 }}>
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
            color: "#9baac1",
            fontSize: 25,
          }}
        >
          Software engineering · Product systems · Interface craft
        </div>
      </div>
    </div>,
    size,
  );
}

