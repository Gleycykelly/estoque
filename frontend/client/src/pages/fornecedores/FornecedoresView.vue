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
  name: 'fornecedores',
  components: {
    Aterrissagem,
  },
};
</script>
