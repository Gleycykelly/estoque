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
            v-model="senhaAtual"
            variant="outlined"
          ></v-text-field>
          <v-text-field
            class="campos-dados-margin"
            label="Nova senha"
            v-model="novaSenha"
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
import { useAuthStore, useDadosStore } from '@/store/index';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Perfil',
  data() {
    return {
      modelo: {
        nome: '',
        cpf: '',
        rg: '',
        email: '',
        dataNascimento: null,
      },
      senhaAtual: null,
      novaSenha: null,
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
    async salvar() {
      if (this.senhaAtual != null && this.novaSenha != null) {
        this.modelo.senha = this.novaSenha;
      }
      if (this.modelo) {
        api
          .patch(
            `http://localhost:3000/usuarios/${this.modelo.id}`,
            {
              nome: this.modelo.nome,
              cpf: this.modelo.cpf,
              rg: this.modelo.rg,
              email: this.modelo.email,
              dataNascimento: this.modelo.dataNascimento,
              generoUsuario: this.modelo.generoUsuario,
              senha: this.senhaAtual,
              novaSenha: this.novaSenha,
            },
            {
              headers: {
                Authorization: `Bearer ${this.obterToken()}`,
              },
            },
          )
          .then(() => {
            // this.$refs.alerta.mostrarAlerta('A categoria foi criada com sucesso!', 'green');
            this.voltar();
          })
          .catch((error) => {
            if (error.response && error.response.data) {
              // this.$refs.alerta.mostrarAlerta(error.response.data.message, 'red');
            } else {
              // this.$refs.alerta.mostrarAlerta(error.message, 'red');
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
