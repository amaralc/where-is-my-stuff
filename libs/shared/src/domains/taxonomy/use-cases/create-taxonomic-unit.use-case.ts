import { CreateTaxonomicUnitDto } from '../dto/create-taxonomic-unit.dto';
import { TaxonomicUnit } from '../entities/taxonomic-unit.entity';

export class CreateTaxonomicUnitUseCase {
  async execute(
    createTaxonomicUnitDto: CreateTaxonomicUnitDto
  ): Promise<TaxonomicUnit> {
    const taxonomicUnit = new TaxonomicUnit(createTaxonomicUnitDto);
    return taxonomicUnit;
  }
}
