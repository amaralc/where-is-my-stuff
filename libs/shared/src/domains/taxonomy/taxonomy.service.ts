import { CreateTaxonomicUnitDto } from './dto/create-taxonomic-unit.dto';
import { TaxonomicUnit } from './entities/taxonomic-unit.entity';
import { CreateTaxonomicUnitUseCase } from './use-cases/create-taxonomic-unit.use-case';

export class TaxonomyService {
  constructor(
    private readonly createTaxonomicUnitUseCase: CreateTaxonomicUnitUseCase
  ) {}

  async create(
    createTaxonomicUnitDto: CreateTaxonomicUnitDto
  ): Promise<TaxonomicUnit> {
    return this.createTaxonomicUnitUseCase.execute(createTaxonomicUnitDto);
  }
}
