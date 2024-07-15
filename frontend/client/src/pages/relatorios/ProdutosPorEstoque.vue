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

        <v-btn icon color="#AA00FF" @click="emitirEmCSV()">
          <v-icon>mdi-microsoft-excel</v-icon>
          <v-tooltip activator="parent" location="top">Emitir em CSV</v-tooltip>
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
          cleatable
        ></v-combobox>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script>
import api from '@/services/api';
import { useAuthStore } from '@/store/index';

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
            console.log(this.depositos);
          }
        });
    },
  },
  created() {
    this.obterDepositos();
  },
};
</script>
