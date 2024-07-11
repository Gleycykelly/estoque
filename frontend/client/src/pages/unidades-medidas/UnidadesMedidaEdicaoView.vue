<template>
  <v-main class="fill-height">
    <v-card min-height="90vh" width="calc(100% - 100px)" style="margin: 0 auto">
      <v-toolbar flat>
        <v-toolbar-title class="text-grey">Unidades de medida</v-toolbar-title>

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
          label="Sigla"
          v-model="modelo.sigla"
          variant="outlined"
        ></v-text-field>
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
  name: 'UnidadesMedidasEdicao',
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
      this.$router.push('/unidadesMedida');
    },

    async salvar() {
      if (!this.modelo.sigla) {
        useAlerta().exibirSnackbar('A sigla é obrigatória!', 'orange');
        return;
      }

      if (this.modelo.sigla && this.modelo.sigla.length > 4) {
        useAlerta().exibirSnackbar(
          'A sigla pode ter no máximo 4 caracteres!',
          'orange',
        );
        return;
      }

      if (!this.modelo.descricao) {
        useAlerta().exibirSnackbar('A descrição é obrigatória!', 'orange');
        return;
      }

      if (this.dados && this.dados.ehTelaAtualizacao) {
        api
          .patch(
            `http://localhost:3000/unidades-medidas/${this.dados.id}`,
            this.modelo,
            {
              headers: {
                Authorization: `Bearer ${this.obterToken()}`,
              },
            },
          )
          .then(() => {
            useAlerta().exibirSnackbar(
              'A unidade de medida atualizada com sucesso!',
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
          .post(`http://localhost:3000/unidades-medidas/`, this.modelo, {
            headers: {
              Authorization: `Bearer ${this.obterToken()}`,
            },
          })
          .then(() => {
            useAlerta().exibirSnackbar(
              'A unidade de medida foi criada com sucesso!',
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

    async obterUnidadesMedida() {
      api
        .get(`http://localhost:3000/unidades-medidas/${this.dados.id}`, {
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
      this.obterUnidadesMedida();
    }
  },
  computed: {
    dados() {
      return useDadosStore().getDadosParaEdicao;
    },
  },
};
</script>
