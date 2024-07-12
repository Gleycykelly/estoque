<template>
  <Aterrissagem
    titulo="Marcas"
    :provider="'marcas'"
    :telaEdicao="'marcas-edicao'"
    :colunasAterrissagem="[
      { title: 'Identificador', value: 'id' },
      { title: 'Descrição', value: 'descricao' },
    ]"
  />
</template>

<script>
import Aterrissagem from '../../components/Aterrisagem.vue';

export default {
  name: 'marcas',
  components: {
    Aterrissagem,
  },
};
</script>
