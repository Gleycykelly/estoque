<template>
  <Aterrissagem
    titulo="Unidades de medida"
    :provider="'unidades-medidas'"
    :telaEdicao="'unidades-medida-edicao'"
    :colunasAterrissagem="[
      { title: 'Identificador', value: 'id' },
      { title: 'Sigla', value: 'sigla' },
      { title: 'Descrição', value: 'descricao' },
    ]"
  />
</template>

<script>
import Aterrissagem from '../../components/Aterrisagem.vue';

export default {
  name: 'unidadesMedida',
  components: {
    Aterrissagem,
  },
};
</script>
