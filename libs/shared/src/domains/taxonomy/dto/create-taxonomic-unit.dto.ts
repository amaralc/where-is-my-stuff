import { IsSlug } from '../../../decorators/is-slug.decorator';

export class CreateTaxonomicUnitDto {
  @IsSlug({ message: 'Should only contain lower case, numbers and dashes' })
  slug!: string;
}
