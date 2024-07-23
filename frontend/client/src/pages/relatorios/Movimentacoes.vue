<template>
  <v-main class="fill-height">
    <v-card min-height="90vh" width="calc(100% - 100px)" style="margin: 0 auto">
      <v-toolbar flat>
        <v-toolbar-title class="text-grey">
          Emissão movimentações
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon color="var(--primary-color)" @click="emitirEmExcel()">
          <v-icon>mdi-microsoft-excel</v-icon>
          <v-tooltip activator="parent" location="top">
            Emitir em Excel
          </v-tooltip>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-combobox
          label="Tipo de movimentação"
          :items="['Entrada', 'Saída']"
          item-title="descricao"
          item-value="id"
          v-model="modelo.tipoMovimentacao"
          variant="outlined"
          clearable
          color="var(--primary-color)"
        ></v-combobox>
        <div class="periodo-datas">
          <v-text-field
            variant="outlined"
            type="date"
            v-model="modelo.dataInicial"
            label="Data inicial"
            clearable
          ></v-text-field>
          <v-text-field
            class="data-secundaria"
            variant="outlined"
            type="date"
            v-model="modelo.dataFinal"
            label="Data final"
            clearable
          ></v-text-field>
        </div>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script>
import { emissaoMovimentacoes } from '@/services/relatorios/comunicacao-relatorios';
import { useAlerta } from '@/store/index';

export default {
  name: 'EmissaoMovimentacao',
  data() {
    return {
      modelo: {},
    };
  },
  methods: {
    async emitirEmExcel() {
      await emissaoMovimentacoes(this.modelo)
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
};
</script>

<style>
.periodo-datas {
  @media (min-width: 850px) {
    display: flex;
  }

  @media (max-width: 849px) {
    display: block;
  }
}
.data-secundaria {
  @media (min-width: 850px) {
    margin-left: 15px;
  }
}
</style>
