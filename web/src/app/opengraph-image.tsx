import { ImageResponse } from "next/og";

export const alt = "IMPEVOS | Yapay Zeka ve Yazılım Çözümleri";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "#070b14",
          color: "#f4f6fb",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 8 }}>IMPEVOS</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, lineHeight: 1.05, maxWidth: 920 }}>Yapay zeka ve yazılım çözümleri</div>
          <div style={{ marginTop: 24, fontSize: 24, color: "#a8b0c2" }}>impevos.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
