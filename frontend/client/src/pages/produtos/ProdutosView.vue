<template>
  <Aterrissagem
    titulo="Produtos"
    :provider="'produtos'"
    :telaEdicao="'produtos-edicao'"
    :telaParaFiltrar="'produtos'"
    :comunicacao="comunicacaoProdutos"
    :mostrarBotaoDeFiltro="true"
    :colunasAterrissagem="[
      { title: 'Identificador', value: 'id' },
      { title: 'Código do produto', value: 'codigoProduto' },
      { title: 'Nome', value: 'nome' },
      { title: 'Descrição', value: 'descricao' },
      { title: 'Data de cadastro', value: 'dataCadastro' },
      { title: 'Categoria', value: 'categoria.descricao' },
      { title: 'Unidade de medida', value: 'unidadeMedida.descricao' },
      { title: 'Operador de cadastro', value: 'usuario.nome' },
    ]"
  />
</template>

<script>
import comunicacaoProdutos from '@/services/produtos/comunicacao-produtos';
import Aterrissagem from '../../components/Aterrisagem.vue';

export default {
  name: 'produtos',
  components: {
    Aterrissagem,
  },
  data() {
    return {
      comunicacaoProdutos,
    };
  },
};
</script>
