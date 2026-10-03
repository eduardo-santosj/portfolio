import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt =
  "Eduardo dos Santos Jacinto, Desenvolvedor Front-End Sênior com 9 anos de experiência";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const AMBER = "#ffb800";

async function loadGoogleFont(family: string, weight: number, text: string) {
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`,
      )
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const res = await fetch(url);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

async function loadPhoto() {
  try {
    const file = await readFile(
      path.join(process.cwd(), "public", "images", "eduardo-santos-og.jpg"),
    );
    return `data:image/jpeg;base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}

const TEXT =
  "ITAJAÍ, SC · PORTFOLIOEduardo dos Santos JacintoDesenvolvedor Front-End Sênior · Senior Front-End EngineerReact Next.js TypeScript Node.js9 anos de experiênciaedusantos.vercel.app";

export default async function OpengraphImage() {
  const [grotesk, mono, photo] = await Promise.all([
    loadGoogleFont("Space+Grotesk", 700, TEXT),
    loadGoogleFont("Space+Mono", 400, TEXT),
    loadPhoto(),
  ]);

  const fonts: { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" }[] = [];
  if (grotesk) fonts.push({ name: "Grotesk", data: grotesk, weight: 700, style: "normal" });
  if (mono) fonts.push({ name: "Mono", data: mono, weight: 400, style: "normal" });

  const sans = grotesk ? "Grotesk" : "sans-serif";
  const monoFamily = mono ? "Mono" : "monospace";
  const chips = ["React", "Next.js", "TypeScript", "Node.js"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0a0a0a",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          color: "#ededed",
          fontFamily: sans,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -10,
            left: 710,
            width: 560,
            height: 560,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle closest-side, rgba(255,184,0,0.16), rgba(255,184,0,0))",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontFamily: monoFamily,
                fontSize: 26,
                letterSpacing: 4,
                color: AMBER,
              }}
            >
              ITAJAÍ, SC · PORTFOLIO
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontSize: 82,
                fontWeight: 700,
                lineHeight: 1.04,
                maxWidth: photo ? 700 : 1000,
              }}
            >
              Eduardo dos Santos Jacinto
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 24, fontSize: 34 }}>
              <div style={{ display: "flex", color: "#ededed" }}>Desenvolvedor Front-End Sênior</div>
              <div style={{ display: "flex", marginTop: 6, color: "#8f8f8f" }}>Senior Front-End Engineer</div>
            </div>
            <div style={{ display: "flex", marginTop: 34 }}>
              {chips.map((chip) => (
                <div
                  key={chip}
                  style={{
                    display: "flex",
                    marginRight: 14,
                    padding: "10px 22px",
                    fontFamily: monoFamily,
                    fontSize: 26,
                    color: AMBER,
                    border: "2px solid rgba(255,184,0,0.5)",
                    borderRadius: 999,
                    background: "rgba(255,184,0,0.08)",
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: monoFamily,
              fontSize: 28,
            }}
          >
            <div style={{ display: "flex", color: "#ededed" }}>9 anos de experiência</div>
            <div style={{ display: "flex", color: AMBER }}>edusantos.vercel.app</div>
          </div>
        </div>
        {photo ? (
          <div
            style={{
              position: "absolute",
              right: 90,
              top: 140,
              width: 260,
              height: 260,
              display: "flex",
              borderRadius: 9999,
              border: `4px solid ${AMBER}`,
              overflow: "hidden",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} width={260} height={260} alt="" style={{ objectFit: "cover" }} />
          </div>
        ) : null}
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
