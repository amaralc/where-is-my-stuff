import { randomUUID } from 'crypto';

export interface IMakeTaxonomicUnit {
  id?: string;
  slug: string;
}

export class TaxonomicUnit {
  id!: string;
  slug!: string;

  constructor({ slug, id }: IMakeTaxonomicUnit) {
    this.id = id ?? randomUUID();
    this.slug = slug;
  }
}
