<template>
  <v-main class="fill-height">
    <v-card min-height="90vh" width="calc(100% - 100px)" style="margin: 0 auto">
      <v-toolbar flat>
        <v-toolbar-title class="text-grey">
          Emissão de produtos por estoque
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon color="#AA00FF" @click="emitirEmPDF()">
          <v-icon>mdi-file-pdf-box</v-icon>
          <v-tooltip activator="parent" location="top">Emitir em PDF</v-tooltip>
        </v-btn>

        <v-btn icon color="#AA00FF" @click="emitirEmExcel()">
          <v-icon>mdi-microsoft-excel</v-icon>
          <v-tooltip activator="parent" location="top">
            Emitir em Excel
          </v-tooltip>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-combobox
          label="Depósitos"
          :items="depositos"
          item-title="descricao"
          item-value="id"
          v-model="modelo.deposito"
          variant="outlined"
          clearable
        ></v-combobox>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script>
import api from '@/services/api';
import { useAuthStore, useAlerta } from '@/store/index';

export default {
  name: 'ProdutosPorEstoque',
  data() {
    return {
      modelo: {},
      depositos: [],
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
      this.$router.push('/operadores');
    },
    async obterDepositos() {
      api
        .get(`http://localhost:3000/depositos/`, {
          headers: {
            Authorization: `Bearer ${this.obterToken()}`,
          },
        })
        .then((response) => {
          this.depositos = [];

          for (const deposito of response.data) {
            this.depositos.push(deposito);
          }
        });
    },
    async emitirEmExcel() {
      api
        .post(`http://localhost:3000/excel/produtos-por-estoque`, this.modelo, {
          headers: {
            Authorization: `Bearer ${this.obterToken()}`,
          },
          responseType: 'blob',
        })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `produtos.xlsx`);
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          if (error.response && error.response.status == 404) {
            useAlerta().exibirSnackbar(
              'Nenhum item encontrado para emissão!',
              'red',
            );
          } else {
            useAlerta().exibirSnackbar(
              'Não foi possível realizar a emissão. Entre em contato com o suporte!',
              'red',
            );
          }
        });
    },
    async emitirEmPDF() {
      try {
        api
          .post(`http://localhost:3000/pdf/produtos-por-estoque`, this.modelo, {
            headers: {
              Authorization: `Bearer ${this.obterToken()}`,
            },
            responseType: 'blob',
          })
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'documento.pdf');
            document.body.appendChild(link);
            link.click();
          });
      } catch (error) {
        console.error('Erro ao baixar o arquivo Excel', error);
      }
    },
  },
  created() {
    this.obterDepositos();
  },
};
</script>
