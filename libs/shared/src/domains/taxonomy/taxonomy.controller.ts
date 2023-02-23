import { Body, Controller, Post } from '@nestjs/common';
import { CreateTaxonomicUnitDto } from './dto/create-taxonomic-unit.dto';
import { TaxonomyService } from './taxonomy.service';

@Controller('taxonomic-units')
export class TaxonomyController {
  constructor(private readonly taxonomyService: TaxonomyService) {}

  @Post()
  create(@Body() createTaxonomicUnitDto: CreateTaxonomicUnitDto) {
    return this.taxonomyService.create(createTaxonomicUnitDto);
  }
}
