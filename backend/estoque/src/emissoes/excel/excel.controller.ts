import { Body, Controller, Post, Res } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { ApiTags } from '@nestjs/swagger';
import { DadosEmissaoExcelDto } from './dto/dados-emissao-excel.dto';
import { Response } from 'express';

@ApiTags('emissoes')
@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('produtos-por-estoque')
  async produtosPorEstoque(
    @Body() dadosEmissaoExcelDto: DadosEmissaoExcelDto,
    @Res() res: Response,
  ): Promise<void> {
    console.log('emissao');
    console.log(dadosEmissaoExcelDto);
    const filePath =
      await this.excelService.produtosPorEstoque(dadosEmissaoExcelDto);
    res.download(filePath, () => {
      this.excelService.deleteFile(filePath);
    });
  }
}