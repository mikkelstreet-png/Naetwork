import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Naetwork — One hour of expert career help. 300 DKK against cancer.";

export default async function OpengraphImage() {
  const didot = await readFile(join(process.cwd(), "assets", "GFSDidot-Regular.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0A0A",
          color: "#FBFBFA",
          padding: 84,
        }}
      >
        <div style={{ display: "flex", fontFamily: "Didot", fontSize: 34, letterSpacing: 14 }}>
          {"N\u039BETWORK"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Didot" }}>
          <div style={{ fontSize: 66, lineHeight: 1.1 }}>One hour of expert career help.</div>
          <div style={{ fontSize: 66, lineHeight: 1.1, color: "#9A9A95", marginTop: 4 }}>
            300 DKK against cancer.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 40, fontSize: 22 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 40 }}>300 DKK</span>
            <span style={{ color: "#9A9A95", fontSize: 18 }}>you donate</span>
          </div>
          <span style={{ color: "#3A3A3A", fontSize: 34 }}>·</span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 40 }}>100%</span>
            <span style={{ color: "#9A9A95", fontSize: 18 }}>to Kr&aelig;ftens Bek&aelig;mpelse</span>
          </div>
          <span style={{ color: "#3A3A3A", fontSize: 34 }}>·</span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 40 }}>0 DKK</span>
            <span style={{ color: "#9A9A95", fontSize: 18 }}>kept by the platform</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Didot", data: didot, style: "normal", weight: 400 }] },
  );
}
