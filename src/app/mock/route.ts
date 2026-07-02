import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await request.json();

  await new Promise(resolve => setTimeout(resolve, 1500));

  return NextResponse.json({
    message: "SERVER: Received your data successfully",
    receivedAt: new Date().toISOString(),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    data: body,
  });
};
