import { Body, Controller, Post, Res } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { ApiTags } from '@nestjs/swagger';
import { DadosEmissaoExcelDto } from './dto/dados-emissao-excel.dto';
import { Response } from 'express';

@ApiTags('emissoes')
@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('produtos')
  async emissaoProdutos(
    @Body() dadosEmissaoExcelDto: DadosEmissaoExcelDto,
    @Res() res: Response,
  ): Promise<void> {
    const filePath =
      await this.excelService.emissaoProdutos(dadosEmissaoExcelDto);
    res.download(filePath, () => {
      this.excelService.deleteFile(filePath);
    });
  }

  @Post('movimentacoes')
  async emissaoMovimentacoes(
    @Body() dadosEmissaoExcelDto: DadosEmissaoExcelDto,
    @Res() res: Response,
  ): Promise<void> {
    const filePath =
      await this.excelService.emissaoMovimentacoes(dadosEmissaoExcelDto);
    res.download(filePath, () => {
      this.excelService.deleteFile(filePath);
    });
  }
}
