<template>
  <v-main class="fill-height">
    <v-card min-height="90vh" width="calc(100% - 100px)" style="margin: 0 auto">
      <v-toolbar flat>
        <v-toolbar-title class="text-grey">
          Emissão de produtos por estoque
        </v-toolbar-title>

        <v-spacer></v-spacer>

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
import comunicacaoDepositos from '@/services/depositos/comunicacao-deposito';
import { emissaoProdutosPorEstoque } from '@/services/relatorios/comunicacao-relatorios';
import { useAlerta } from '@/store/index';

export default {
  name: 'ProdutosPorEstoque',
  data() {
    return {
      modelo: {},
      depositos: [],
    };
  },
  methods: {
    voltar() {
      this.$router.push('/operadores');
    },
    async obterDepositos() {
      await comunicacaoDepositos.obterTodos().then((response) => {
        this.depositos = [];

        for (const deposito of response.data) {
          this.depositos.push(deposito);
        }
      });
    },
    async emitirEmExcel() {
      await emissaoProdutosPorEstoque(this.modelo)
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
  },
  created() {
    this.obterDepositos();
  },
};
</script>
