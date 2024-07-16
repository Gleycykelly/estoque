<template>
  <Aterrissagem
    titulo="Marcas"
    :provider="'marcas'"
    :telaEdicao="'marcas-edicao'"
    :comunicacao="comunicacaoMarcas"
    :colunasAterrissagem="[
      { title: 'Identificador', value: 'id' },
      { title: 'Descrição', value: 'descricao' },
    ]"
  />
</template>

<script>
import comunicacaoMarcas from '@/services/marcas/comunicacao-marcas';
import Aterrissagem from '../../components/Aterrisagem.vue';

export default {
  name: 'marcas',
  components: {
    Aterrissagem,
  },
  data() {
    return {
      comunicacaoMarcas,
    };
  },
};
</script>
