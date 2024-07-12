<template>
  <v-main class="fill-height">
    <v-card min-height="90vh" width="calc(100% - 100px)" style="margin: 0 auto">
      <v-toolbar flat>
        <v-toolbar-title class="text-grey">Perfil</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon color="green" @click="salvar()">
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          label="Nome"
          v-model="modelo.nome"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          label="CPF"
          v-mask="'###.###.###-##'"
          v-model="modelo.cpf"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          label="RG"
          v-mask="'##.###.###-#'"
          v-model="modelo.rg"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          label="E-mail"
          v-model="modelo.email"
          variant="outlined"
        ></v-text-field>

        <div class="campos-dados-flex">
          <v-text-field
            class="campos-data"
            variant="outlined"
            type="date"
            v-model="modelo.dataNascimento"
            label="Data de Nascimento"
          ></v-text-field>
          <v-combobox
            class="campos-dados-margin"
            label="Genêros"
            :items="['Feminino', 'Masculino']"
            item-title="descricao"
            item-value="id"
            v-model="modelo.generoUsuario"
            variant="outlined"
          ></v-combobox>
        </div>
        <div class="campos-dados-flex">
          <v-text-field
            label="Senha atual"
            v-model="modelo.senha"
            variant="outlined"
          ></v-text-field>
          <v-text-field
            class="campos-dados-margin"
            label="Nova senha"
            v-model="modelo.novaSenha"
            variant="outlined"
          ></v-text-field>
        </div>
      </v-card-text>
      <v-divider></v-divider>
    </v-card>
  </v-main>
</template>

<script>
import api from '@/services/api';
import { useAuthStore, useDadosStore, useAlerta } from '@/store/index';

export default {
  name: 'Perfil',
  data() {
    return {
      modelo: {},
    };
  },
  methods: {
    obterToken() {
      const authStore = useAuthStore();
      const token = authStore.getToken();

      if (!token) {
        this.$router.push('/login');
      }

      return token;
    },

    podeGravar() {
      if (!this.modelo.nome) {
        useAlerta().exibirSnackbar('O nome é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.cpf) {
        useAlerta().exibirSnackbar('O CPF é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.rg) {
        useAlerta().exibirSnackbar('O RG é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.email) {
        useAlerta().exibirSnackbar('O E-mail é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.dataNascimento) {
        useAlerta().exibirSnackbar(
          'A data de nascimento é obrigatória!',
          'orange',
        );
        return false;
      }

      if (!this.modelo.generoUsuario) {
        useAlerta().exibirSnackbar('O genêro é obrigatório!', 'orange');
        return false;
      }

      if (this.modelo.novaSenha && !this.modelo.senha) {
        useAlerta().exibirSnackbar(
          'Insira sua senha atual para criar uma nova senha!',
          'orange',
        );
        return false;
      }

      return true;
    },
    async salvar() {
      if (!this.podeGravar()) {
        return;
      }
      if (this.modelo) {
        api
          .patch(
            `http://localhost:3000/usuarios/${this.modelo.id}`,
            this.modelo,
            {
              headers: {
                Authorization: `Bearer ${this.obterToken()}`,
              },
            },
          )
          .then(() => {
            useAlerta().exibirSnackbar(
              'Usuário alterado com sucesso!',
              'green',
            );
          })
          .catch((error) => {
            if (error.response && error.response.data) {
              useAlerta().exibirSnackbar(error.response.data.message, 'red');
            } else {
              useAlerta().exibirSnackbar(error.message, 'red');
            }
          });
      }
    },

    async obterUsuario() {
      api
        .post(
          `http://localhost:3000/usuarios/obter-usuario-logado`,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.obterToken()}`,
            },
          },
        )
        .then((response) => {
          this.modelo = null;

          this.modelo = response.data;
        });
    },
  },
  created() {
    this.obterUsuario();
  },
  computed: {
    dados() {
      return useDadosStore().getDadosParaEdicao;
    },
  },
};
</script>

<style scoped>
.campos-dados-flex {
  @media (min-width: 850px) {
    display: flex;
  }

  @media (max-width: 849px) {
    display: block;
  }
}

.campos-dados-margin {
  @media (min-width: 850px) {
    margin-left: 15px;
  }

  @media (max-width: 849px) {
    margin-left: 0;
  }
}

.campos-data {
  @media (min-width: 850px) {
    max-width: 180px;
  }
}
</style>
