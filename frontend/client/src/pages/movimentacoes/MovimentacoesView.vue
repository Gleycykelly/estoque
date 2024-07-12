<template>
  <Aterrissagem
    titulo="Movimentações"
    :provider="'movimentacoes'"
    :telaEdicao="'movimentacoes-edicao'"
    :telaParaFiltrar="'movimentacoes'"
    :mostrarBotaoDeFiltro="true"
    :colunasAterrissagem="[
      { title: 'Identificador', value: 'id' },
      { title: 'Produto', value: 'lancamentoProduto.produto.nome' },
      { title: 'Quantidade', value: 'quantidade' },
      { title: 'Tipo de movimentação', value: 'tipoMovimentacao' },
      { title: 'Data da movimentação', value: 'dataMovimentacao' },
      { title: 'Operador', value: 'usuario.nome' },
    ]"
  />
</template>

<script>
import Aterrissagem from '../../components/Aterrisagem.vue';

export default {
  name: 'movimentacoes',
  components: {
    Aterrissagem,
  },
};
</script>
