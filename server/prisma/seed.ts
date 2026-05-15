import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const genres = [
  'Художня література',
  'Наукова фантастика',
  'Фентезі',
  'Детектив',
  'Романтика',
  'Пригоди',
  'Саморозвиток',
  'Історія',
  'Дитяча література',
  'Поезія',
  'Нон-фікшн',
  'Класика',
];

async function main() {
  // Delete old English genres that are no longer needed
  const existingGenres = await prisma.genre.findMany();
  const newGenreSet = new Set(genres);

  for (const existing of existingGenres) {
    if (!newGenreSet.has(existing.name)) {
      // Only delete if no books are using this genre
      const usageCount = await prisma.bookGenre.count({
        where: { genreId: existing.id },
      });
      if (usageCount === 0) {
        await prisma.genre.delete({ where: { id: existing.id } });
        console.log(`Deleted unused genre: ${existing.name}`);
      } else {
        console.log(`Kept genre "${existing.name}" (used by ${usageCount} books)`);
      }
    }
  }

  // Upsert all Ukrainian genres
  for (const name of genres) {
    await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log(`Seeded ${genres.length} main genres (Ukrainian).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
