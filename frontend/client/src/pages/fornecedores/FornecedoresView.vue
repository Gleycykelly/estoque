<template>
  <Aterrissagem
    titulo="Fornecedores"
    :provider="'fornecedores'"
    :telaEdicao="'fornecedores-edicao'"
    :comunicacao="comunicacaoFornecedores"
    :colunasAterrissagem="[
      { title: 'Identificador', value: 'id' },
      { title: 'CNPJ', value: 'cnpj' },
      { title: 'Razão Social', value: 'razaoSocial' },
      { title: 'Telefone', value: 'telefone' },
    ]"
  />
</template>

<script>
import comunicacaoFornecedores from '@/services/fornecedores/comunicacao-fornecedores';
import Aterrissagem from '../../components/Aterrisagem.vue';
export default {
  name: 'fornecedores',
  components: {
    Aterrissagem,
  },
  data() {
    return {
      comunicacaoFornecedores,
    };
  },
};
</script>
