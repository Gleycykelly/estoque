<template>
  <v-main class="fill-height">
    <v-card min-height="90vh" width="calc(100% - 100px)" style="margin: 0 auto">
      <v-toolbar flat>
        <v-toolbar-title v-if="!pesquisa" class="text-grey">
          {{ titulo }}
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <div>
          <v-btn
            style="color: #aa00ff"
            @click="irParaTelaDeEdicao"
            icon
            v-if="mostrarBotaoEdicao"
          >
            <v-icon>mdi-square-edit-outline</v-icon>
          </v-btn>

          <v-btn
            style="color: #aa00ff"
            @click="deletarItem"
            icon
            v-if="mostrarBotaoEdicao"
          >
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </div>

        <v-btn
          color="#AA00FF"
          @click="pesquisa = true"
          v-if="!pesquisa && !mostrarBotaoEdicao"
          icon
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-text-field
          class="busca-itens"
          v-if="pesquisa && !mostrarBotaoEdicao"
          prepend-icon="mdi-magnify"
          hide-details
          single-line
          v-model="termoDePesquisa"
          placeholder="Digite um termo para pesquisa"
          @update:model-value="obterParcial()"
          variant="outlined"
        ></v-text-field>

        <v-btn
          color="#AA00FF"
          @click="pesquisa = false"
          icon
          v-if="pesquisa && !mostrarBotaoEdicao"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text>
        <v-data-table-virtual
          v-if="dados && dados.length > 0"
          class="custom-header"
          :headers="colunasAterrissagem"
          :items="dados"
          item-value="id"
          height="80vh"
          @load="load"
          :loading="loading"
          fixed-header
          show-select
          v-model="selected"
          @input="enterSelect"
        >
          <template v-slot:[`item.dataCadastro`]="{ item }">
            <span>{{ new Date(item.dataCadastro).toLocaleString() }}</span>
          </template>
          <template v-slot:[`item.dataMovimentacao`]="{ item }">
            <span>{{ new Date(item.dataMovimentacao).toLocaleString() }}</span>
          </template>
          <template v-slot:[`item.tipoMovimentacao`]="{ item }">
            <v-chip :color="corDaMovimentacao(item.tipoMovimentacao)">
              {{ item.tipoMovimentacao }}
            </v-chip>
          </template>
        </v-data-table-virtual>

        <v-empty-state
          v-if="!dados || dados.length == 0"
          icon="mdi-magnify"
          title="Nenhum item encontrado!"
          color="#a09f9f"
        ></v-empty-state>
      </v-card-text>
    </v-card>
    <v-sheet>
      <v-fab
        class="me-4"
        icon="mdi-plus"
        location="top end"
        absolute
        offset
        color="#AA00FF"
        @click="irParaTelaDeCriacao"
      ></v-fab>
    </v-sheet>
  </v-main>
</template>

<script>
import api from '@/services/api';
import { useAuthStore, useDadosStore, useAlerta } from '@/store/index';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Aterrissagem',
  props: {
    titulo: String,
    provider: String,
    colunasAterrissagem: [],
    telaEdicao: String,
  },
  data() {
    return {
      headers: [],
      dados: [],
      pesquisa: false,
      loading: false,
      termoDePesquisa: null,
      selected: null,
      mostrarBotaoEdicao: false,
    };
  },
  methods: {
    calculateTableHeight() {
      const cardHeight = document.querySelector('.fill-height').clientHeight;
      return cardHeight;
    },
    obterToken() {
      const authStore = useAuthStore();
      const token = authStore.getToken();

      if (!token) {
        this.$router.push('/login');
      }

      return token;
    },

    async obtemDados() {
      let loader = this.$loading.show();

      api
        .get(`http://localhost:3000/${this.provider}/`, {
          headers: {
            Authorization: `Bearer ${this.obterToken()}`,
          },
        })
        .then((response) => {
          this.dados = [];

          for (const dado of response.data) {
            this.dados.push(dado);
          }
        });

      loader.hide();

      return this.dados;
    },

    async obterParcial() {
      api
        .post(
          `http://localhost:3000/${this.provider}/obter-parcial`,
          {
            termoDePesquisa: this.termoDePesquisa,
          },
          {
            headers: {
              Authorization: `Bearer ${this.obterToken()}`,
            },
          },
        )
        .then((response) => {
          this.dados = [];
          for (const dado of response.data) {
            this.dados.push(dado);
          }
        });

      return this.dados;
    },

    irParaTelaDeCriacao() {
      useDadosStore().salvarDadosParaEdicao(null);
      this.$router.push(`/${this.telaEdicao}`);
    },

    enterSelect() {
      if (this.selected.length > 0) {
        this.mostrarBotaoEdicao = true;
      } else {
        this.mostrarBotaoEdicao = false;
      }
    },

    irParaTelaDeEdicao() {
      if (this.selected.length > 1) {
        useAlerta().exibirSnackbar(
          'Selecione apenas um item para edição!',
          'orange',
        );
        return;
      }
      const dados = {
        id: this.selected[0],
        ehTelaAtualizacao: true,
      };

      useDadosStore().salvarDadosParaEdicao(dados);

      this.$router.push(this.telaEdicao);
    },

    deletarItem() {
      if (this.selected.length > 1) {
        useAlerta().exibirSnackbar(
          'Selecione apenas um item para exclusão!',
          'orange',
        );
        return;
      }

      api
        .delete(`http://localhost:3000/${this.provider}/${this.selected[0]}`, {
          headers: {
            Authorization: `Bearer ${this.obterToken()}`,
          },
        })
        .then(() => {
          useAlerta().exibirSnackbar('Item excluído com sucesso!', 'green');
          this.selected = null;
          this.obtemDados();
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            useAlerta().exibirSnackbar(error.response.data.message, 'red');
          } else {
            useAlerta().exibirSnackbar(error.message, 'red');
          }
        });
    },
    corDaMovimentacao(tipoMovimentacao) {
      if (tipoMovimentacao === 'Entrada') return 'green';
      if (tipoMovimentacao === 'Saída') return 'red';

      return 'gray';
    },
  },
  created() {
    this.obtemDados();
  },
};
</script>

<style>
th {
  text-align: left !important;
  font-weight: 900 !important;
}

tr {
  text-align: left;
}

.busca-itens i {
  color: #aa00ff;
}

.custom-header i {
  color: #aa00ff;
}
</style>
