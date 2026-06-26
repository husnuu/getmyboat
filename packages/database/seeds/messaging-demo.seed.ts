/**
 * Demo messaging seed: fake customer + reservation + conversation with sample messages.
 * Idempotent — safe to re-run.
 *
 * Usage: pnpm --filter @getyourboat/database db:seed:messaging
 * Optional env: MESSAGING_DEMO_CAPTAIN_EMAIL
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/client/index.js";

const prisma = new PrismaClient();

const DEMO_CUSTOMER_EMAIL = "demo.customer@getyourboat.test";
const DEMO_MESSAGES = [
  "Merhaba, Cumartesi turu için müsait misiniz?",
  "4 kişiyiz, öğle yemeği dahil mi?",
  "Teşekkürler, cevabınızı bekliyorum.",
];

async function main() {
  const captainEmail = process.env.MESSAGING_DEMO_CAPTAIN_EMAIL;
  const captain = await prisma.profile.findFirst({
    where: captainEmail ? { email: captainEmail } : undefined,
    orderBy: { createdAt: "asc" },
    include: {
      boats: { where: { status: "ACTIVE" }, take: 1 },
    },
  });

  if (!captain) {
    console.error("No captain profile found. Sign up in Captain app first.");
    process.exit(1);
  }

  const boat =
    captain.boats[0] ??
    (await prisma.boat.findFirst({
      where: { ownerId: captain.id },
      orderBy: { updatedAt: "desc" },
    }));

  if (!boat) {
    console.error("Captain has no boats. Create a boat before seeding messaging demo.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash("demo-customer-pass", 10);
  const customer = await prisma.user.upsert({
    where: { email: DEMO_CUSTOMER_EMAIL },
    update: { name: "Demo Müşteri" },
    create: {
      email: DEMO_CUSTOMER_EMAIL,
      passwordHash,
      name: "Demo Müşteri",
      phone: "+905551112233",
      role: "CUSTOMER",
    },
  });

  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 7);
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 4);

  let reservation = await prisma.reservation.findFirst({
    where: { boatId: boat.id, customerId: customer.id },
  });

  if (!reservation) {
    reservation = await prisma.reservation.create({
      data: {
        boatId: boat.id,
        customerId: customer.id,
        startDate,
        endDate,
        guests: 4,
        totalPrice: 1500,
        status: "CONFIRMED",
      },
    });
  }

  let conversation = await prisma.conversation.findUnique({
    where: { reservationId: reservation.id },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        reservationId: reservation.id,
        customerId: customer.id,
        captainId: captain.id,
      },
    });
  }

  const existingCount = await prisma.message.count({
    where: { conversationId: conversation.id },
  });

  if (existingCount === 0) {
    for (const body of DEMO_MESSAGES) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: customer.id,
          senderType: "CUSTOMER",
          body,
        },
      });
    }
  }

  console.log("Messaging demo seed complete:");
  console.log(`  Captain: ${captain.email ?? captain.id}`);
  console.log(`  Boat: ${boat.title ?? boat.id}`);
  console.log(`  Customer: ${customer.email}`);
  console.log(`  Reservation: ${reservation.id}`);
  console.log(`  Conversation: ${conversation.id}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
