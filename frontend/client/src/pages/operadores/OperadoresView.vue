<template>
  <Aterrissagem
    titulo="Operadores"
    :provider="'usuarios'"
    :telaEdicao="'operadores-edicao'"
    :telaParaFiltrar="'operadores'"
    :mostrarBotaoDeFiltro="true"
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
  name: 'operadores',
  components: {
    Aterrissagem,
  },
};
</script>
