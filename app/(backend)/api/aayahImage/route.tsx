import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { arabic, translation, surah, ayah } = await req.json();
    if (!arabic || !translation || !surah || !ayah) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Responsive font size based on content length
    const getFontSize = (text: string, baseSize: number, minSize: number) => {
      const length = text.length;
      if (length > 100) return `${Math.max(baseSize - 10, minSize)}px`;
      if (length > 60) return `${Math.max(baseSize - 5, minSize)}px`;
      if (length > 30) return `${baseSize}px`;
      return `${Math.min(baseSize + 10, 80)}px`; // Larger font for short text
    };

    // Calculate responsive font sizes
    const arabicFontSize = getFontSize(arabic, 60, 40);
    const translationFontSize = getFontSize(translation, 28, 22);

    // Calculate optimal dimensions based on content length
    const getOptimalDimensions = (arabicText: string, translationText: string) => {
      const totalLength = arabicText.length + translationText.length;
      
      // Increased base size for more width
      let width = 1400;
      let height = 630; // Default Open Graph dimensions
      
      // Adjust height and width based on content volume
      if (totalLength > 200) {
        height = 800; // Taller for very long content
      } else if (totalLength < 50) {
        height = 600; // Shorter for brief content
        width = 1200; // Wider for brief content
      }
      
      return { width, height };
    };
    
    const dimensions = getOptimalDimensions(arabic, translation);
    
    // Construct the absolute URL for the font file
    // Assuming Indopak.ttf is in your_project_root/public/fonts/
    const fontUrl = new URL("/fonts/Indopak.ttf", req.nextUrl.origin);

    return new ImageResponse(
      (
        <div
          tw="flex flex-col w-full h-full items-center justify-center bg-white p-6"
          style={{
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(circle at 50% 50%, #fff 60%, #e5e5e5 100%)",
          }}
        >
          {/* Manual approach: Word-by-word with correct RTL */}
          <div 
            tw="flex flex-row-reverse justify-center items-center flex-wrap w-full"
            style={{ 
              lineHeight: "1.8", 
              letterSpacing: "-0.1em",
              padding: "0 2px"
            }}
          >
            {arabic.split(' ').map((word: string, i: number) => (
              <span
                key={i}
                tw="text-black"
                style={{ 
                  fontFamily: "Indopak",
                  fontSize: arabicFontSize
                }}
              >
                {word}
              </span>
            ))}
          </div>
          
          {/* Translation Text: Centered block with responsive width */}
          <p 
            tw="mt-6 text-black text-center flex justify-center items-center font-sans w-11/12 font-medium"
            style={{ 
              fontSize: translationFontSize,
              maxWidth: "90%",
              lineHeight: "1.4"
            }}
          >
            {translation} [{surah}:{ayah}]
          </p>
        </div>
      ),
      {
        width: dimensions.width,
        height: dimensions.height,
        fonts: [
          {
            name: "Indopak",
            data: await fetch(fontUrl).then((res) => res.arrayBuffer()),
            style: "normal",
            weight: 400,
          },
        ],
      }
    );
  } catch (err: any) {
    console.error("Error generating image:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
