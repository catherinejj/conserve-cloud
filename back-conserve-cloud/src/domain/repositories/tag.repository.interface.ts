import { TagEntity } from '../entities/tag.entity';

export const TAG_REPOSITORY = Symbol('ITagRepository');

export interface ITagRepository {
  upsertMany(names: string[]): Promise<TagEntity[]>;
}
