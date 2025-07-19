import { NextRequest, NextResponse } from "next/server";
import { OutageService } from "@quick-status/services";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    try {
        const id = (await params).id;
        const outage = await OutageService.get(id);

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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const outage = await OutageService.get(id);

        if (!outage) {
            return NextResponse.json(
                { error: "Outage not found" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { action } = body;

        if (action !== "end") return NextResponse.json(
            { error: "Invalid action. Only 'end' is supported" },
            { status: 400 }
        );

        const res = await OutageService.end(id);
        return NextResponse.json(res);

    } catch (error) {
        console.error("Error updating outage:", error);
        return NextResponse.json(
            { error: "Failed to update outage" },
            { status: 500 }
        );
    }
}
