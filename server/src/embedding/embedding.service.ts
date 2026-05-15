import { Injectable } from '@nestjs/common';

@Injectable()
export class EmbeddingService {
  private pipe: any = null;

  private async getPipeline() {
    if (!this.pipe) {
      // Dynamic import so NestJS CommonJS build handles ESM module correctly
      const { pipeline, env } = await import('@xenova/transformers');
      env.allowLocalModels = false;
      this.pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return this.pipe;
  }

  async embed(text: string): Promise<number[]> {
    const pipe = await this.getPipeline();
    const output = await pipe(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data as Float32Array);
  }
}
