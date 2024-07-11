<template>
  <Aterrissagem
    titulo="Produtos"
    :provider="'produtos'"
    :telaEdicao="'produtos-edicao'"
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
import Aterrissagem from '../../components/Aterrisagem.vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'produtos',
  components: {
    Aterrissagem,
  },
};
</script>
