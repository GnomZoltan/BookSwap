import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import Groq from 'groq-sdk';
import { DatabaseService } from 'src/database/database.service';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[a.length][b.length];
}

function fuzzyTextScore(book: { title: string; author: string }, query: string): number {
  const target = `${book.title} ${book.author}`.toLowerCase();
  const queryWords = query.toLowerCase().split(/\s+/).filter(Boolean);
  const targetWords = target.split(/\s+/).filter(Boolean);

  const wordScores = queryWords.map(qw =>
    Math.max(...targetWords.map(tw => {
      const dist = levenshtein(qw, tw);
      return 1 - dist / Math.max(qw.length, tw.length, 1);
    })),
  );
  return wordScores.reduce((sum, s) => sum + s, 0) / (wordScores.length || 1);
}

function bookToText(book: { title: string; author: string; description: string; genre?: { genre: { name: string } }[] }): string {
  const genres = book.genre?.map(g => g.genre.name).join(' ') ?? '';
  return `${book.title} ${book.author} ${book.description} ${genres}`.trim();
}

const BOOK_INCLUDE = {
  genre: { include: { genre: true } },
  photos: true,
};

@Injectable()
export class BooksService implements OnModuleInit {

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async onModuleInit() {
    this.backfillEmbeddings().catch(err =>
      console.error('Embedding backfill failed:', err),
    );
  }

  private async backfillEmbeddings() {
    const books = await this.databaseService.bookForExchange.findMany({
      where: { embedding: { equals: Prisma.JsonNull } },
      include: { genre: { include: { genre: true } } },
    });

    if (books.length === 0) return;

    console.log(`Generating embeddings for ${books.length} existing books...`);

    for (const book of books) {
      const embedding = await this.embeddingService.embed(bookToText(book));
      await this.databaseService.bookForExchange.update({
        where: { id: book.id },
        data: { embedding },
      });
    }

    console.log(`Embeddings backfill complete.`);
  }

  async create(createBookDto: CreateBookDto) {
    const { genreNames, bookPhotos, ...bookData } = createBookDto;

    const genres = await this.databaseService.genre.findMany({
      where: { name: { in: genreNames } },
      select: { id: true, name: true },
    });

    const book = await this.databaseService.bookForExchange.create({
      data: {
        ...bookData,
        genre: {
          create: genres.map((genre) => ({
            genre: { connect: { id: genre.id } },
          })),
        },
        photos: {
          create: (bookPhotos ?? []).map((photoUrl) => ({ photoUrl })),
        },
      },
      include: BOOK_INCLUDE,
    });

    const embedding = await this.embeddingService.embed(bookToText(book));
    return this.databaseService.bookForExchange.update({
      where: { id: book.id },
      data: { embedding },
      include: BOOK_INCLUDE,
    });
  }

  async deactivateById(id: string) {
    return this.databaseService.bookForExchange.update({
      data: { status: 'SWAPPED' },
      where: { id },
    });
  }

  async searchBooks(query: string) {
    if (!query) {
      throw new Error('Query parameter is required for search');
    }

    const books = await this.databaseService.bookForExchange.findMany({
      where: { status: 'AVAILABLE' },
      include: BOOK_INCLUDE,
    });

    const booksWithEmbeddings = books.filter(b => Array.isArray(b.embedding));

    if (booksWithEmbeddings.length === 0) {
      return books
        .map(b => ({ book: b, score: fuzzyTextScore(b, query) }))
        .filter(r => r.score > 0.5)
        .sort((a, b) => b.score - a.score)
        .slice(0, 20)
        .map(r => r.book);
    }

    const queryEmbedding = await this.embeddingService.embed(query);

    // Hybrid: 70% semantic vector + 30% fuzzy word match (handles typos)
    return booksWithEmbeddings
      .map(b => ({
        book: b,
        score:
          cosineSimilarity(queryEmbedding, b.embedding as number[]) * 0.7 +
          fuzzyTextScore(b, query) * 0.3,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map(r => r.book);
  }

  async findBooksByGenres(genreNames: string[]) {
    if (!genreNames || genreNames.length === 0) {
      throw new Error('Genre names are required');
    }

    return this.databaseService.bookForExchange.findMany({
      where: {
        genre: {
          some: {
            genre: { name: { in: genreNames } },
          },
        },
      },
      include: BOOK_INCLUDE,
    });
  }

  async findAll() {
    return this.databaseService.bookForExchange.findMany({
      include: BOOK_INCLUDE,
    });
  }

  async findAllAvailable() {
    return this.databaseService.bookForExchange.findMany({
      where: { status: 'AVAILABLE' },
      include: BOOK_INCLUDE,
    });
  }

  async findByOwnerId(userId: string) {
    return this.databaseService.bookForExchange.findMany({
      where: { userId },
      include: BOOK_INCLUDE,
    });
  }

  async findOne(id: string) {
    return this.databaseService.bookForExchange.findUnique({
      where: { id },
      include: BOOK_INCLUDE,
    });
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const { genreNames, bookPhotos, ...bookData } = updateBookDto;

    const genres = await this.databaseService.genre.findMany({
      where: { name: { in: genreNames } },
      select: { id: true },
    });

    const book = await this.databaseService.bookForExchange.update({
      where: { id },
      data: {
        ...bookData,
        genre: {
          deleteMany: {},
          create: genres.map((genre) => ({
            genre: { connect: { id: genre.id } },
          })),
        },
        photos: {
          deleteMany: {},
          create: (bookPhotos ?? []).map((photoUrl) => ({ photoUrl })),
        },
      },
      include: BOOK_INCLUDE,
    });

    const embedding = await this.embeddingService.embed(bookToText(book));
    return this.databaseService.bookForExchange.update({
      where: { id },
      data: { embedding },
      include: BOOK_INCLUDE,
    });
  }

  async remove(id: string) {
    return this.databaseService.bookForExchange.delete({ where: { id } });
  }

  private truncate(text: string, max = 250): string {
    if (text.length <= max) return text;
    const sentenceEnd = /[.!?]/g;
    let lastSentenceBreak = -1;
    let match: RegExpExecArray | null;
    while ((match = sentenceEnd.exec(text)) !== null) {
      if (match.index < max) lastSentenceBreak = match.index + 1;
      else break;
    }
    if (lastSentenceBreak > 0) return text.substring(0, lastSentenceBreak).trim();
    const cut = text.substring(0, max);
    return cut.substring(0, cut.lastIndexOf(' ')) + '…';
  }

  private async fetchGoogleBooksDescription(title: string, author: string): Promise<string | null> {
    const queries = [
      `intitle:${title} inauthor:${author}`,
      `${title} ${author}`,
      title,
    ];
    for (const q of queries) {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=1`);
      const data = await res.json() as any;
      const description: string | undefined = data.items?.[0]?.volumeInfo?.description;
      if (description) return this.truncate(description);
    }
    return null;
  }

  private async generateWithGroq(title: string, author: string): Promise<string> {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: `Напиши короткий опис книги "${title}" автора ${author}. Відповідай лише українською мовою. Поверни лише текст опису, без лапок і міток. Важливо: пиши лише завершені речення, загальна довжина — до 200 символів.` }],
      max_tokens: 80,
    });
    return response.choices[0].message.content.trim();
  }

  async generateDescription(title: string, author: string): Promise<string> {
    const fromBooks = await this.fetchGoogleBooksDescription(title, author);
    if (fromBooks) return fromBooks;
    return this.generateWithGroq(title, author);
  }
}
