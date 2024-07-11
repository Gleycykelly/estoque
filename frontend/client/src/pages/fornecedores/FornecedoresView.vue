<template>
  <Aterrissagem
    titulo="Fornecedores"
    :provider="'fornecedores'"
    :telaEdicao="'fornecedores-edicao'"
    :colunasAterrissagem="[
      { title: 'Identificador', value: 'id' },
      { title: 'CNPJ', value: 'cnpj' },
      { title: 'Razão Social', value: 'razaoSocial' },
      { title: 'Telefone', value: 'telefone' },
    ]"
  />
</template>

<script>
import Aterrissagem from '../../components/Aterrisagem.vue';
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'fornecedores',
  components: {
    Aterrissagem,
  },
};
</script>
