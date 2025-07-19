import { NextRequest, NextResponse } from "next/server";
import { OutageService, OutageType } from "@quick-status/services";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const siteId = searchParams.get('siteId');
        
        if (siteId) {
            const outages = await OutageService.getSiteOutages(siteId);
            return NextResponse.json(outages);
        } else {
            return NextResponse.json(
                { error: "siteId parameter is required" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error fetching outages:", error);
        return NextResponse.json(
            { error: "Failed to fetch outages" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { siteId, type } = body;

        if (!siteId || !type) {
            return NextResponse.json(
                { error: "siteId and type are required" },
                { status: 400 }
            );
        }

        if (!Object.values(OutageType).includes(type)) {
            return NextResponse.json(
                { error: "Invalid outage type" },
                { status: 400 }
            );
        }

        const outage = await OutageService.create(siteId, type);
        return NextResponse.json(outage, { status: 201 });
    } catch (error) {
        console.error("Error creating outage:", error);
        return NextResponse.json(
            { error: "Failed to create outage" },
            { status: 500 }
        );
    }
}
