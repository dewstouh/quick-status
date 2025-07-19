import { NextRequest, NextResponse } from "next/server";
import { OutageService } from "@quick-status/services";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const outages = await OutageService.getSiteOutages(id);
        return NextResponse.json(outages);
    } catch (error) {
        console.error("Error fetching outages:", error);
        return NextResponse.json(
            { error: "Failed to fetch outages" },
            { status: 500 }
        );
    }
}
