<template>
  <Aterrissagem
    titulo="Movimentações"
    :provider="'movimentacoes'"
    :telaEdicao="'movimentacoes-edicao'"
    :telaParaFiltrar="'movimentacoes'"
    :comunicacao="comunicacaoMovimentacoes"
    :mostrarBotaoDeFiltro="true"
    :colunasAterrissagem="[
      { title: 'Identificador', value: 'id' },
      { title: 'Produto', value: 'lancamentoProduto.produto.nome' },
      { title: 'Lote', value: 'lancamentoProduto.lote' },
      { title: 'Quantidade', value: 'quantidade' },
      { title: 'Tipo de movimentação', value: 'tipoMovimentacao' },
      { title: 'Data da movimentação', value: 'dataMovimentacao' },
      { title: 'Operador', value: 'usuario.nome' },
    ]"
  />
</template>

<script>
import comunicacaoMovimentacoes from '@/services/movimentacoes/comunicacao-movimentacoes';
import Aterrissagem from '../../components/Aterrisagem.vue';

export default {
  name: 'movimentacoes',
  components: {
    Aterrissagem,
  },
  data() {
    return {
      comunicacaoMovimentacoes,
    };
  },
};
</script>
