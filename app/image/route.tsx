import sharp from "sharp";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const startTime = searchParams.get("start"); // 格式 "HH:mm"
  const endTime = searchParams.get("end"); // 格式 "HH:mm"

  if (!startTime || !endTime) {
    return new Response("Missing parameters", { status: 400 });
  }

  const now = new Date();
  now.setMinutes(now.getMinutes() + now.getTimezoneOffset() + 480); // 調整為 UTC+8 時區
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  const isActive =
    currentMinutes >= startMinutes && currentMinutes <= endMinutes;

  const color = isActive
    ? { r: 0, g: 255, b: 0, alpha: 255 }
    : { r: 255, g: 255, b: 255, alpha: 255 };
  const buffer = await sharp({
    create: { width: 1, height: 1, channels: 4, background: color },
  })
    .png()
    .toBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  });
}
