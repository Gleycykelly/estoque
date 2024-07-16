<template>
  <Aterrissagem
    titulo="Unidades de medida"
    :provider="'unidades-medidas'"
    :telaEdicao="'unidades-medida-edicao'"
    :comunicacao="comunicacaoUnidadesMedidas"
    :colunasAterrissagem="[
      { title: 'Identificador', value: 'id' },
      { title: 'Sigla', value: 'sigla' },
      { title: 'Descrição', value: 'descricao' },
    ]"
  />
</template>

<script>
import comunicacaoUnidadesMedidas from '@/services/unidades-medidas/comunicacao-unidade-medidas';
import Aterrissagem from '../../components/Aterrisagem.vue';

export default {
  name: 'unidadesMedida',
  components: {
    Aterrissagem,
  },
  data() {
    return comunicacaoUnidadesMedidas;
  },
};
</script>
