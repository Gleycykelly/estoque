<template>
  <Aterrissagem
    titulo="Categorias"
    :provider="'categorias'"
    :telaEdicao="'categorias-edicao'"
    :colunasAterrissagem="[
      { title: 'Identificador', value: 'id' },
      { title: 'Descrição', value: 'descricao' },
    ]"
  />
</template>

<script>
import Aterrissagem from '../../components/Aterrisagem.vue';

export default {
  name: 'categorias',
  components: {
    Aterrissagem,
  },
};
</script>
