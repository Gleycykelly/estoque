<template>
  <Aterrissagem
    titulo="Operadores"
    :provider="'usuarios'"
    :telaEdicao="'operadores-edicao'"
    :colunasAterrissagem="[
      { title: 'Identificador', value: 'id' },
      { title: 'E-mail', value: 'email' },
      { title: 'Nome', value: 'nome' },
      { title: 'CPF', value: 'cpf' },
      { title: 'RG', value: 'rg' },
      { title: 'Data de Nascimento', value: 'dataNascimento' },
      { title: 'Genêro', value: 'generoUsuario' },
      { title: 'Permissão', value: 'permissaoUsuario' },
    ]"
  />
</template>

<script>
import Aterrissagem from '../../components/Aterrisagem.vue';
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'operadores',
  components: {
    Aterrissagem,
  },
};
</script>
