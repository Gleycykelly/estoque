<template>
  <Aterrissagem
    titulo="Depósitos"
    :provider="'depositos'"
    :telaEdicao="'depositos-edicao'"
    :colunasAterrissagem="[
      { title: 'Identificador', value: 'id' },
      { title: 'Descrição', value: 'descricao' },
    ]"
  />
</template>

<script>
import Aterrissagem from '../../components/Aterrisagem.vue';

export default {
  name: 'depositos',
  components: {
    Aterrissagem,
  },
};
</script>
