<template>
  <Aterrissagem
    titulo="Movimentações"
    :provider="'movimentacoes'"
    :telaEdicao="'movimentacoes-edicao'"
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
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'movimentacoes',
  components: {
    Aterrissagem,
  },
};
</script>
