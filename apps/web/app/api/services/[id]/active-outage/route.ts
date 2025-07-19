import { NextRequest, NextResponse } from "next/server";
import { OutageService } from "@quick-status/services";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const activeOutage = await OutageService.getActiveBySite(id);
        
        if (!activeOutage) {
            return NextResponse.json(null);
        }

        return NextResponse.json(activeOutage);
    } catch (error) {
        console.error("Error fetching active outage:", error);
        return NextResponse.json(
            { error: "Failed to fetch active outage" },
            { status: 500 }
        );
    }
}
