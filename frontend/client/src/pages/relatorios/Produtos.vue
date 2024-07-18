<template>
  <v-main class="fill-height">
    <v-card min-height="90vh" width="calc(100% - 100px)" style="margin: 0 auto">
      <v-toolbar flat>
        <v-toolbar-title class="text-grey">Emissão de produtos</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon color="#AA00FF" @click="emitirEmExcel()">
          <v-icon>mdi-microsoft-excel</v-icon>
          <v-tooltip activator="parent" location="top">
            Emitir em Excel
          </v-tooltip>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-select
          v-model="modelo.depositos"
          item-title="descricao"
          item-value="id"
          :items="depositos"
          label="Depósitos"
          multiple
          color="#AA00FF"
          variant="outlined"
          persistent-hint
          clearable
        ></v-select>

        <v-select
          v-model="modelo.fornecedores"
          item-title="razaoSocial"
          item-value="id"
          :items="fornecedores"
          label="Forncedores"
          multiple
          color="#AA00FF"
          variant="outlined"
          persistent-hint
          clearable
        ></v-select>

        <v-text-field
          label="Quantidade em estoque maior que"
          v-model="modelo.quantidadeMaiorQue"
          variant="outlined"
          type="number"
          clearable
          @update:model-value="modelo.quantidadeMenorQue = null"
        ></v-text-field>

        <v-text-field
          label="Quantidade em estoque menor que"
          v-model="modelo.quantidadeMenorQue"
          variant="outlined"
          type="number"
          clearable
          @update:model-value="modelo.quantidadeMaiorQue = null"
        ></v-text-field>

        <v-text-field
          :disabled="modelo.produtosVencidos"
          label="Dias para vencer"
          v-model="modelo.diasParaVencer"
          variant="outlined"
          type="number"
          clearable
          @update:model-value="modelo.produtosVencidos = false"
        ></v-text-field>

        <v-switch
          v-model="modelo.produtosVencidos"
          label="Produtos vencidos"
          color="#AA00FF"
          hide-details
          inset
          clearable
          @update:model-value="modelo.diasParaVencer = null"
        ></v-switch>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script>
import comunicacaoDepositos from '@/services/depositos/comunicacao-deposito';
import comunicacaoFornecedores from '@/services/fornecedores/comunicacao-fornecedores';
import { emissaoProdutos } from '@/services/relatorios/comunicacao-relatorios';
import { useAlerta } from '@/store/index';

export default {
  name: 'EmissaoProdutos',
  data() {
    return {
      modelo: {},
      depositos: [],
      fornecedor: [],
    };
  },
  methods: {
    async obterDepositos() {
      await comunicacaoDepositos
        .obterParcialFiltro(this.modelo)
        .then((response) => {
          this.depositos = [];

          for (const deposito of response.data) {
            this.depositos.push(deposito);
          }
        });
    },

    async obterFornecedores() {
      await comunicacaoFornecedores.obterTodos().then((response) => {
        this.fornecedores = [];

        for (const fornecedor of response.data) {
          this.fornecedores.push(fornecedor);
        }
      });
    },

    async emitirEmExcel() {
      await emissaoProdutos(this.modelo)
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
    this.obterFornecedores();
  },
};
</script>
