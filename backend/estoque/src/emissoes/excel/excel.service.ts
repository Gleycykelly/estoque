import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { DadosEmissaoExcelDto } from './dto/dados-emissao-excel.dto';
import { MovimentacoesService } from 'src/movimentacoes/movimentacoes.service';
import * as fs from 'fs';

@Injectable()
export class ExcelService {
  constructor(private readonly movimentacaoService: MovimentacoesService) {}

  async emissaoProdutos(
    dadosEmissaoExcelDto: DadosEmissaoExcelDto,
  ): Promise<string> {
    const data =
      await this.movimentacaoService.obterMovimentacaoProdutosParaEmissao(
        dadosEmissaoExcelDto,
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
      {
        header: 'Localização no estoque',
        key: 'localizacao',
        width: 100,
      },
    ];

    data.forEach((item) => {
      worksheet.addRow(item);
    });

    const tempFilePath = `temp/excel-${Date.now()}.xlsx`;

    await workbook.xlsx.writeFile(tempFilePath);
    return tempFilePath;
  }

  async emissaoMovimentacoes(
    dadosEmissaoExcelDto: DadosEmissaoExcelDto,
  ): Promise<string> {
    const data =
      await this.movimentacaoService.obterMovimentacoesParaEmissao(
        dadosEmissaoExcelDto,
      );

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Produtos');

    worksheet.columns = [
      { header: 'Tipo da movimentação', key: 'tipoMovimentacao', width: 20 },
      { header: 'Data da movimentação', key: 'dataMovimentacao', width: 20 },
      { header: 'Lote', key: 'lote', width: 10 },
      { header: 'Produto', key: 'produto', width: 30 },
      { header: 'Data de validade', key: 'validade', width: 15 },
      { header: 'Preço de custo', key: 'precoCusto', width: 15 },
      { header: 'Preço de venda', key: 'precoVenda', width: 15 },
      { header: 'Quantidade', key: 'quantidade', width: 15 },
      { header: 'Fornecedor', key: 'fornecedor', width: 35 },
      { header: 'Depósito', key: 'deposito', width: 15 },
      { header: 'Operador da movimentação', key: 'operador', width: 30 },
    ];

    data.forEach((item) => {
      worksheet.addRow(item);
    });

    const tempFilePath = `temp/excel-${Date.now()}.xlsx`;

    await workbook.xlsx.writeFile(tempFilePath);
    return tempFilePath;
  }

  async deleteFile(filePath: string): Promise<void> {
    await fs.promises.unlink(filePath);
  }
}
