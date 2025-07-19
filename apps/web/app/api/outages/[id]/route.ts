import { NextRequest, NextResponse } from "next/server";
import { OutageService } from "@quick-status/services";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const outage = await OutageService.get(params.id);
        
        if (!outage) {
            return NextResponse.json(
                { error: "Outage not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(outage);
    } catch (error) {
        console.error("Error fetching outage:", error);
        return NextResponse.json(
            { error: "Failed to fetch outage" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { action } = body;

        if (action === "end") {
            const outage = await OutageService.end(params.id);
            return NextResponse.json(outage);
        } else {
            return NextResponse.json(
                { error: "Invalid action. Only 'end' is supported" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error updating outage:", error);
        return NextResponse.json(
            { error: "Failed to update outage" },
            { status: 500 }
        );
    }
}
