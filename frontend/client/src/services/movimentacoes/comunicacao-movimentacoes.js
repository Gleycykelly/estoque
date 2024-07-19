import comunicacaoAbstrata from '../comunicacao-abstrata';

const caminho = 'movimentacoes';
const comunicacaoMovimentacoes = comunicacaoAbstrata(caminho);

const obterMovimentacoesPorLote = (lote) => {
  return comunicacaoMovimentacoes.instancia.get(
    `/movimentacoes/obter-movimentacoes-por-lote/${lote}`,
  );
};

const valorTotalEntradasESaidas = () => {
  return comunicacaoMovimentacoes.instancia.get(
    `/movimentacoes/valor-total-entradas-saidas/`,
  );
};

const produtosProximosDoVencimento = () => {
  return comunicacaoMovimentacoes.instancia.get(
    `/movimentacoes/produtos-proximo-vencimento/`,
  );
};

const quantidadeDeProdutosPorEstoque = () => {
  return comunicacaoMovimentacoes.instancia.get(
    `/movimentacoes/produtos-por-estoque/`,
  );
};

const ultimasMovimentacoes = () => {
  return comunicacaoMovimentacoes.instancia.get(
    `/movimentacoes/ultimas-movimentacoes/`,
  );
};

export default {
  ...comunicacaoMovimentacoes,
  obterMovimentacoesPorLote,
  valorTotalEntradasESaidas,
  produtosProximosDoVencimento,
  quantidadeDeProdutosPorEstoque,
  ultimasMovimentacoes,
};
