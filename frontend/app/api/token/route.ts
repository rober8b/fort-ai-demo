import { NextRequest, NextResponse } from "next/server";
import { AccessToken, RoomServiceClient, AgentDispatchClient } from "livekit-server-sdk";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room") ?? "fort-demo";
  const identity = searchParams.get("identity") ?? `user-${Date.now()}`;

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const livekitUrl = process.env.LIVEKIT_URL;

  if (!apiKey || !apiSecret || !livekitUrl) {
    return NextResponse.json(
      { error: "LIVEKIT_API_KEY o LIVEKIT_API_SECRET no configurados" },
      { status: 500 }
    );
  }

  const httpUrl = livekitUrl
    .replace(/^wss:\/\//, "https://")
    .replace(/^ws:\/\//, "http://");

  // 1. Crear el room si no existe
  try {
    const roomService = new RoomServiceClient(httpUrl, apiKey, apiSecret);
    await roomService.createRoom({ name: room });
    console.log("[room] created or already exists:", room);
  } catch (e: any) {
    console.log("[room] warning:", e?.message);
  }

  // 2. Despachar el agente al room
  try {
    const dispatch = new AgentDispatchClient(httpUrl, apiKey, apiSecret);
    const result = await dispatch.createDispatch(room, "fort-agent");
    console.log("[dispatch] OK:", JSON.stringify(result));
  } catch (e: any) {
    console.log("[dispatch] error:", e?.message, e?.status);
  }

  // 3. Generar token para el participante humano
  const at = new AccessToken(apiKey, apiSecret, { identity, ttl: "1h" });
  at.addGrant({
    roomJoin: true,
    room,
    canPublish: true,
    canSubscribe: true,
  });
  const token = await at.toJwt();

  return NextResponse.json({ token, url: livekitUrl });
}
