<template>
  <v-main class="fill-height">
    <v-card min-height="90vh" width="calc(100% - 100px)" style="margin: 0 auto">
      <v-toolbar flat>
        <v-toolbar-title class="text-grey">Categorias</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon color="green" @click="salvar()">
          <v-icon>mdi-check</v-icon>
        </v-btn>

        <v-btn icon color="red" @click="voltar()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-text-field
          label="Descrição"
          v-model="modelo.descricao"
          variant="outlined"
        ></v-text-field>
      </v-card-text>

      <v-divider></v-divider>
    </v-card>
  </v-main>
</template>

<script>
import api from '@/services/api';
import { useAuthStore, useDadosStore, useAlerta } from '@/store/index';
export default {
  name: 'CategoriaEdicao',
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

    voltar() {
      this.$router.push('/categorias');
    },

    async salvar() {
      if (!this.modelo.descricao) {
        useAlerta().exibirSnackbar('A descrição é obrigatória!', 'orange');
        return;
      }

      if (this.dados && this.dados.ehTelaAtualizacao) {
        api
          .patch(
            `http://localhost:3000/categorias/${this.dados.id}`,
            this.modelo,
            {
              headers: {
                Authorization: `Bearer ${this.obterToken()}`,
              },
            },
          )
          .then(() => {
            useAlerta().exibirSnackbar(
              'A categoria foi atualizada com sucesso!',
              'green',
            );

            this.voltar();
          })
          .catch((error) => {
            if (error.response && error.response.data) {
              useAlerta().exibirSnackbar(error.response.data.message, 'red');
            } else {
              useAlerta().exibirSnackbar(error.message, 'red');
            }
          });
      } else {
        api
          .post(`http://localhost:3000/categorias/`, this.modelo, {
            headers: {
              Authorization: `Bearer ${this.obterToken()}`,
            },
          })
          .then(() => {
            useAlerta().exibirSnackbar(
              'A categoria foi criada com sucesso!',
              'green',
            );
            this.voltar();
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

    async obterCategoria() {
      api
        .get(`http://localhost:3000/categorias/${this.dados.id}`, {
          headers: {
            Authorization: `Bearer ${this.obterToken()}`,
          },
        })
        .then((response) => {
          this.modelo = null;

          this.modelo = response.data;
        });
    },
  },
  created() {
    if (this.dados && this.dados.ehTelaAtualizacao) {
      this.obterCategoria();
    }
  },
  computed: {
    dados() {
      return useDadosStore().getDadosParaEdicao;
    },
  },
};
</script>
