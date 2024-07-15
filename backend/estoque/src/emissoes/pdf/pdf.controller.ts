import { Controller, Get } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('emissoes')
@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('produtos-por-estoque')
  produtosPorEstoque() {
    return this.pdfService.produtosPorEstoque();
  }
}
