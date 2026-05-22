import 'dotenv/config';
import { FoodType, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

//DEMO_PASSWORD = 'azerty123';
const DEMO_PASSWORD_HASH =
  '$2b$10$GXMCAfKr1q0WoHZ8AhdEkeRPUBHgNqXsbje8plqmGobc1xXcp3.9m';

const defaultUser = {
  firstName: 'Demo',
  lastName: 'Conserve',
  birthDate: new Date('1990-01-01'),
  email: 'demo@conserve-cloud.local',
  password: DEMO_PASSWORD_HASH,
};

const conserves = [
  {
    name: 'Haricots verts extra fins',
    expirationDate: '2025-12-15',
    openingDate: null,
    description: 'Conserve volontairement périmée pour tester les alertes.',
    rawKeywords: 'haricot, légume, périmé',
    foodTypes: [FoodType.LEGUME],
  },
  {
    name: 'Thon au naturel',
    expirationDate: '2026-06-10',
    openingDate: null,
    description: 'Pour salades et sandwichs.',
    rawKeywords: 'thon, poisson, salade',
    foodTypes: [FoodType.POISSON],
  },
  {
    name: 'Pêches au sirop',
    expirationDate: '2026-08-01',
    openingDate: null,
    description: 'Dessert rapide.',
    rawKeywords: 'pêche, fruit, dessert',
    foodTypes: [FoodType.FRUIT],
  },
  {
    name: 'Ratatouille provençale',
    expirationDate: '2026-11-20',
    openingDate: null,
    description: 'Accompagnement de légumes.',
    rawKeywords: 'ratatouille, légume, provence',
    foodTypes: [FoodType.LEGUME],
  },
  {
    name: 'Maïs doux',
    expirationDate: '2027-02-14',
    openingDate: null,
    description: 'Pour salades composées.',
    rawKeywords: 'maïs, légume, salade',
    foodTypes: [FoodType.LEGUME],
  },
  {
    name: 'Sardines à l’huile',
    expirationDate: '2027-05-30',
    openingDate: null,
    description: 'Riches en oméga 3.',
    rawKeywords: 'sardine, poisson, huile',
    foodTypes: [FoodType.POISSON],
  },
  {
    name: 'Ananas en tranches',
    expirationDate: '2027-09-12',
    openingDate: null,
    description: 'Pour desserts et cuisine sucrée salée.',
    rawKeywords: 'ananas, fruit, dessert',
    foodTypes: [FoodType.FRUIT],
  },
  {
    name: 'Cassoulet',
    expirationDate: '2028-01-18',
    openingDate: null,
    description: 'Plat complet.',
    rawKeywords: 'cassoulet, viande, plat',
    foodTypes: [FoodType.VIANDE, FoodType.AUTRE],
  },
  {
    name: 'Pois chiches',
    expirationDate: '2028-04-05',
    openingDate: null,
    description: 'Pour houmous et salades.',
    rawKeywords: 'pois chiche, légume, houmous',
    foodTypes: [FoodType.LEGUME],
  },
  {
    name: 'Lait de coco',
    expirationDate: '2028-10-22',
    openingDate: null,
    description: 'Pour currys et desserts.',
    rawKeywords: 'coco, curry, autre',
    foodTypes: [FoodType.AUTRE],
  },
];

async function main() {
  await prisma.user.deleteMany({
    where: { email: defaultUser.email },
  });

  const user = await prisma.user.create({
    data: {
      firstName: defaultUser.firstName,
      lastName: defaultUser.lastName,
      birthDate: defaultUser.birthDate,
      email: defaultUser.email,
      password: DEMO_PASSWORD_HASH,
    },
  });

  for (const conserve of conserves) {
    const tagNames = conserve.rawKeywords
      .split(',')
      .map((keyword) => keyword.trim().toLowerCase())
      .filter(Boolean);

    const tags = await Promise.all(
      tagNames.map((name) =>
        prisma.tag.upsert({
          where: { name },
          create: { name },
          update: {},
        }),
      ),
    );

    await prisma.conserve.create({
      data: {
        name: conserve.name,
        expirationDate: new Date(conserve.expirationDate),
        openingDate: conserve.openingDate,
        description: conserve.description,
        photoUrl: null,
        rawKeywords: conserve.rawKeywords,
        foodTypes: conserve.foodTypes,
        userId: user.id,
        tags: { connect: tags.map((tag) => ({ id: tag.id })) },
      },
    });
  }

  console.log(`Seed terminé: ${defaultUser.email} / ${defaultUser.password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
