import { PrismaClient, OutageType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await prisma.outage.deleteMany();
    await prisma.site.deleteMany();

    // Create sites
    const sites = await Promise.all([
        prisma.site.create({
            data: {
                name: 'Google',
                url: 'https://google.com'
            }
        }),
        prisma.site.create({
            data: {
                name: 'Github',
                url: 'https://github.com'
            }
        }),
        prisma.site.create({
            data: {
                name: 'Broken Website',
                url: 'https://a.b.c.test.com' // Intentionally broken URL
            }
        })
    ]);

    console.log(`✅ Created ${sites.length} sites`);

    // Create some historical outages
    const outages = await Promise.all([
        // Completed outage for Main Website
        prisma.outage.create({
            data: {
                siteId: sites[0].id,
                type: OutageType.down,
                startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                endTime: new Date(Date.now() - 23 * 60 * 60 * 1000) // 23 hours ago
            }
        }),
        // Completed degraded outage for API Service
        prisma.outage.create({
            data: {
                siteId: sites[1].id,
                type: OutageType.degraded,
                startTime: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
                endTime: new Date(Date.now() - 10 * 60 * 60 * 1000) // 10 hours ago
            }
        }),
        // Active outage for Documentation
        prisma.outage.create({
            data: {
                siteId: sites[2].id,
                type: OutageType.degraded,
                startTime: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
                // No endTime - this is an active outage
            }
        })
    ]);

    console.log(`✅ Created ${outages.length} outages`);
    console.log('🎉 Database seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });