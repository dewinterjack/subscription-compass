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
          fontSize: 120,
          letterSpacing: -2,
          fontWeight: 800,
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
            paddingBottom: 70,
          }}
        >
          Subs 🧭 Compass
        </div>
        <div
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))",
            backgroundClip: "text",
            // @ts-expect-error ignore
            "-webkit-background-clip": "text",
            color: "transparent",
            fontSize: 80,
            paddingBottom: 10,
            fontWeight: 600,
          }}
        >
          Simplify your subscriptions
        </div>
        <div
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))",
            backgroundClip: "text",
            // @ts-expect-error ignore
            "-webkit-background-clip": "text",
            color: "transparent",
            fontSize: 60,
            fontWeight: 400,
          }}
        >
          Manage all your subscriptions in one place
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
