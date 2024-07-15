import { Body, Controller, Get, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { ApiTags } from '@nestjs/swagger';
import { DadosEmissaoExcelDto } from '../excel/dto/dados-emissao-excel.dto';
import { Response } from 'express';
import { PDFDocument } from 'pdf-lib';

@ApiTags('emissoes')
@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('produtos-por-estoque')
  async produtosPorEstoque(
    @Body() dadosEmissaoExcelDto: DadosEmissaoExcelDto,
    @Res() res: Response,
  ) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    page.drawText(`Dados recebidos do Vue.js`, {
      x: 50,
      y: 700,
      size: 12,
    });

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBytes);
    // return this.pdfService.produtosPorEstoque(dadosEmissaoExcelDto);
  }
}
