import { PrismaClient, OutageType } from "@quick-status/db";

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Ensure database is connected and tables exist
    try {
        await prisma.$connect();
        console.log('✅ Database connection established');
    } catch (error) {
        console.error('❌ Failed to connect to database:', error);
        throw error;
    }

    // Clear existing data (with error handling for non-existent tables)
    try {
        await prisma.outage.deleteMany();
        console.log('✅ Cleared existing outages');
    } catch {
        console.log('ℹ️ No outages to clear (table might not exist yet)');
    }
    
    try {
        await prisma.site.deleteMany();
        console.log('✅ Cleared existing sites');
    } catch {
        console.log('ℹ️ No sites to clear (table might not exist yet)');
    }

    // Create sites with realistic monitoring data
    const sites = await Promise.all([
        prisma.site.create({
            data: {
                name: 'Google',
                url: 'https://google.com',
                onlineChecks: 2880, // 30 days * 24 hours * 4 checks per hour
                totalChecks: 2890,
                lastResponseTime: 120,
                lastStatus: 'operational',
                lastCheckedAt: new Date(),
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Created 30 days ago
            }
        }),
        prisma.site.create({
            data: {
                name: 'GitHub',
                url: 'https://github.com',
                onlineChecks: 2870,
                totalChecks: 2890,
                lastResponseTime: 200,
                lastStatus: 'operational',
                lastCheckedAt: new Date(),
                createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) // Created 12 days ago
            }
        }),
        prisma.site.create({
            data: {
                name: 'Broken Website',
                url: 'https://thiswebsitedoesnotexist.invalid',
                onlineChecks: 0,
                totalChecks: 2890,
                lastResponseTime: 0,
                lastStatus: 'down',
                lastCheckedAt: new Date()
            }
        })
    ]);

    console.log(`✅ Created ${sites.length} sites`);

    // Create historical outages with varied patterns
    const outages = await Promise.all([
        // Completed outage for Google (1 day ago)
        prisma.outage.create({
            data: {
                siteId: sites[0].id,
                type: OutageType.down,
                startTime: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago
                endTime: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
            }
        }),
        // Completed degraded outage for GitHub
        prisma.outage.create({
            data: {
                siteId: sites[1].id,
                type: OutageType.degraded,
                startTime: new Date(Date.now() - 15 * 60 * 60 * 1000), // 15 hours ago
                endTime: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
            }
        }),
        // Another short outage for GitHub
        prisma.outage.create({
            data: {
                siteId: sites[1].id,
                type: OutageType.down,
                startTime: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
                endTime: new Date(Date.now() - 7.5 * 60 * 60 * 1000) // 7.5 hours ago
            }
        }),
        // Active outage for Broken Website (ongoing since 3 days ago)
        prisma.outage.create({
            data: {
                siteId: sites[2].id,
                type: OutageType.down,
                startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
                // No endTime - this is an active outage
            }
        }),
        // Old completed outage for testing historical data
        prisma.outage.create({
            data: {
                siteId: sites[0].id,
                type: OutageType.degraded,
                startTime: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
                endTime: new Date(Date.now() - 19.8 * 24 * 60 * 60 * 1000) // 19.8 days ago
            }
        })
    ]);

    console.log(`✅ Created ${outages.length} outages`);
    console.log('🎉 Database seeding completed!');

    // Log summary
    console.log('\n📊 Seeded data summary:');
    console.log(`- Google: ${((2880 / 2890) * 100).toFixed(2)}% uptime`);
    console.log(`- GitHub: ${((2870 / 2890) * 100).toFixed(2)}% uptime`);
    console.log(`- Broken Website: ${((0 / 2890) * 100).toFixed(2)}% uptime`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });