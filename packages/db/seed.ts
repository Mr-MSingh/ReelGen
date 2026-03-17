import { prisma } from "./src/index.js";

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "founder@reelgen.dev",
      name: "ReelGen Founder",
      status: "active",
      workspaces: {
        create: {
          name: "ReelGen Studio",
          timezone: "UTC",
          defaultLanguage: "en",
          planId: "free",
          subscription: {
            create: {
              status: "trial",
              planCode: "free",
              monthlyVideoLimit: 5,
              monthlyCreditsIncluded: 50,
            },
          },
          series: {
            create: {
              name: "AI Daily",
              niche: "AI News",
              formatType: "narrated",
              targetDurationSec: 45,
              tone: "informative",
              artStyle: "minimal",
              voiceStyle: "calm",
              musicMode: "light",
              postingCadence: "daily",
              defaultHashtags: ["#ai", "#news"],
              defaultPlatforms: ["youtube"],
              status: "active",
            },
          },
        },
      },
    },
  });

  console.log("Seeded user", user.email);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
