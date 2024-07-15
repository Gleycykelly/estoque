import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { DadosEmissaoExcelDto } from './dto/dados-emissao-excel.dto';
import { MovimentacoesService } from 'src/movimentacoes/movimentacoes.service';
import * as fs from 'fs';

@Injectable()
export class ExcelService {
  constructor(private readonly movimentacaoService: MovimentacoesService) {}

  async produtosPorEstoque(
    dadosEmissaoExcelDto: DadosEmissaoExcelDto,
  ): Promise<string> {
    const data = await this.movimentacaoService.obterProdutosPorEstoque(
      dadosEmissaoExcelDto.deposito.id,
    );

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Dados');

    worksheet.columns = [
      { header: 'Depósito', key: 'deposito' },
      { header: 'Produto', key: 'produto' },
      { header: 'Quantidade em estoque', key: 'quantidadeEmEstoque' },
    ];

    data.forEach((item) => {
      worksheet.addRow({
        deposito: item.deposito,
        produto: item.produto,
        quantidadeEmEstoque: item.quantidadeEmEstoque,
      });
    });

    const tempFilePath = `temp/excel-${Date.now()}.xlsx`;

    await workbook.xlsx.writeFile(tempFilePath);
    return tempFilePath;
  }

  async deleteFile(filePath: string): Promise<void> {
    await fs.promises.unlink(filePath);
  }
}
