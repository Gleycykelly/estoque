<template>
  <Aterrissagem
    titulo="Categorias"
    :provider="'categorias'"
    :telaEdicao="'categorias-edicao'"
    :comunicacao="comunicacaoCategorias"
    :colunasAterrissagem="[
      { title: 'Identificador', value: 'id' },
      { title: 'Descrição', value: 'descricao' },
    ]"
  />
</template>

<script>
import Aterrissagem from '../../components/Aterrisagem.vue';
import comunicacaoCategorias from '@/services/categorias/comunicacao-categorias';

export default {
  name: 'categorias',
  components: {
    Aterrissagem,
  },
  data() {
    return {
      comunicacaoCategorias,
    };
  },
};
</script>
