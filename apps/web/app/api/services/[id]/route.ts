import { NextRequest, NextResponse } from "next/server";
import { SiteService } from "@quick-status/services";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const service = await SiteService.getById(params.id);
        
        if (!service) {
            return NextResponse.json(
                { error: "Service not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(service);
    } catch (error) {
        console.error("Error fetching service:", error);
        return NextResponse.json(
            { error: "Failed to fetch service" },
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
        const { name, url, onlineChecks, totalChecks, lastResponseTime, lastStatus, lastCheckedAt } = body;

        const updateData: Record<string, unknown> = {};
        if (name !== undefined) updateData.name = name;
        if (url !== undefined) updateData.url = url;
        if (onlineChecks !== undefined) updateData.onlineChecks = onlineChecks;
        if (totalChecks !== undefined) updateData.totalChecks = totalChecks;
        if (lastResponseTime !== undefined) updateData.lastResponseTime = lastResponseTime;
        if (lastStatus !== undefined) updateData.lastStatus = lastStatus;
        if (lastCheckedAt !== undefined) updateData.lastCheckedAt = new Date(lastCheckedAt);

        const service = await SiteService.update(params.id, updateData);
        return NextResponse.json(service);
    } catch (error) {
        console.error("Error updating service:", error);
        return NextResponse.json(
            { error: "Failed to update service" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await SiteService.delete(params.id);
        return NextResponse.json({ message: "Service deleted successfully" });
    } catch (error) {
        console.error("Error deleting service:", error);
        return NextResponse.json(
            { error: "Failed to delete service" },
            { status: 500 }
        );
    }
}
