<template>
  <Aterrissagem
    titulo="Depósitos"
    :provider="'depositos'"
    :telaEdicao="'depositos-edicao'"
    :comunicacao="comunicacaoDepositos"
    :colunasAterrissagem="[
      { title: 'Identificador', value: 'id' },
      { title: 'Descrição', value: 'descricao' },
    ]"
  />
</template>

<script>
import comunicacaoDepositos from '@/services/depositos/comunicacao-deposito';
import Aterrissagem from '../../components/Aterrisagem.vue';

export default {
  name: 'depositos',
  components: {
    Aterrissagem,
  },
  data() {
    return {
      comunicacaoDepositos,
    };
  },
};
</script>
