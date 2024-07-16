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
      dadosEmissaoExcelDto.deposito ? dadosEmissaoExcelDto.deposito.id : null,
    );

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Produtos');

    worksheet.columns = [
      { header: 'Depósito', key: 'deposito', width: 20 },
      { header: 'Código do produto', key: 'codigoProduto', width: 20 },
      { header: 'Lote', key: 'lote', width: 15 },
      { header: 'Produto', key: 'produto', width: 30 },
      { header: 'Data de validade', key: 'dataValidade', width: 20 },
      {
        header: 'Quantidade em estoque',
        key: 'quantidadeEmEstoque',
        width: 21,
      },
    ];

    data.forEach((item) => {
      worksheet.addRow({
        deposito: item.deposito,
        codigoProduto: item.codigoProduto,
        lote: item.lote,
        produto: item.produto,
        dataValidade: item.dataValidade,
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
