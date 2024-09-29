import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          backgroundImage: "linear-gradient(to bottom, #dbf4ff, #fff1f1)",
          fontSize: 60,
          letterSpacing: -2,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        <div
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))",
            backgroundClip: "text",
            // @ts-expect-error ignore
            "-webkit-background-clip": "text",
            color: "transparent",
          }}
        >
          Sub 🧭 Compass
        </div>
        <div
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))",
            backgroundClip: "text",
            // @ts-expect-error ignore
            "-webkit-background-clip": "text",
            color: "transparent",
          }}
        >
          Track your subscriptions
        </div>
        <div
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))",
            backgroundClip: "text",
            // @ts-expect-error ignore
            "-webkit-background-clip": "text",
            color: "transparent",
          }}
        >
          All in one place
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
