import { Injectable } from '@nestjs/common';

@Injectable()
export class PdfService {
  produtosPorEstoque() {
    return 'Path/to/generated/excel/file.xlsx';
  }
}
