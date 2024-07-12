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
        v-if="mostrarBotaoDeFiltro"
        class="me-4"
        icon="mdi-filter"
        location="top end"
        absolute
        offset
        color="#AA00FF"
        @click="abrirModalFiltro"
        style="top: -55px"
      ></v-fab>

      <v-dialog v-model="modalAberto" max-width="500px">
        <v-card>
          <v-card-title>Filtrar</v-card-title>
          <v-card-text>
            <div>
              <v-select
                v-if="telaParaFiltrar == 'produtos'"
                v-model="filtros.categorias"
                item-title="descricao"
                item-value="id"
                :items="categorias"
                label="Categorias"
                multiple
                color="#AA00FF"
                variant="outlined"
                persistent-hint
              ></v-select>

              <v-select
                v-if="telaParaFiltrar == 'produtos'"
                v-model="filtros.marcas"
                item-title="descricao"
                item-value="id"
                :items="marcas"
                label="Marcas"
                multiple
                color="#AA00FF"
                variant="outlined"
                persistent-hint
              ></v-select>

              <v-combobox
                v-if="telaParaFiltrar == 'movimentacoes'"
                label="Tipo de movimentação"
                :items="['Entrada', 'Saída']"
                item-title="descricao"
                item-value="id"
                v-model="filtros.tipoMovimentacao"
                variant="outlined"
                @update:model-value="
                  filtros.quantidadeMaiorQue = null;
                  filtros.quantidadeMenorQue = null;
                  filtros.diasParaVencer = null;
                  filtros.produtosVencidos = false;
                "
              ></v-combobox>

              <v-select
                v-if="telaParaFiltrar == 'movimentacoes'"
                v-model="filtros.produtos"
                item-title="nome"
                item-value="id"
                :items="produtos"
                label="Produtos"
                multiple
                color="#AA00FF"
                variant="outlined"
                persistent-hint
              ></v-select>

              <v-select
                v-if="
                  telaParaFiltrar == 'produtos' ||
                  telaParaFiltrar == 'movimentacoes'
                "
                v-model="filtros.operadores"
                item-title="nome"
                item-value="id"
                :items="operadores"
                label="Operadores"
                multiple
                color="#AA00FF"
                variant="outlined"
                persistent-hint
              ></v-select>

              <v-select
                v-if="telaParaFiltrar == 'movimentacoes'"
                v-model="filtros.depositos"
                item-title="descricao"
                item-value="id"
                :items="depositos"
                label="Depósitos"
                multiple
                color="#AA00FF"
                variant="outlined"
                persistent-hint
              ></v-select>

              <v-select
                v-if="telaParaFiltrar == 'movimentacoes'"
                v-model="filtros.fornecedores"
                item-title="razaoSocial"
                item-value="id"
                :items="fornecedores"
                label="Forncedores"
                multiple
                color="#AA00FF"
                variant="outlined"
                persistent-hint
              ></v-select>

              <v-text-field
                :disabled="filtros.tipoMovimentacao == 'Saída'"
                v-if="telaParaFiltrar == 'movimentacoes'"
                label="Quantidade maior que"
                v-model="filtros.quantidadeMaiorQue"
                variant="outlined"
                type="number"
                @update:model-value="
                  filtros.quantidadeMenorQue = null;
                  filtros.tipoMovimentacao = 'Entrada';
                "
              ></v-text-field>

              <v-text-field
                :disabled="filtros.tipoMovimentacao == 'Saída'"
                v-if="telaParaFiltrar == 'movimentacoes'"
                label="Quantidade menor que"
                v-model="filtros.quantidadeMenorQue"
                variant="outlined"
                type="number"
                @update:model-value="
                  filtros.quantidadeMaiorQue = null;
                  filtros.tipoMovimentacao = 'Entrada';
                "
              ></v-text-field>

              <v-text-field
                :disabled="filtros.tipoMovimentacao == 'Saída'"
                v-if="telaParaFiltrar == 'movimentacoes'"
                label="Dias para vencer"
                v-model="filtros.diasParaVencer"
                variant="outlined"
                type="number"
                @update:model-value="filtros.tipoMovimentacao = 'Entrada'"
              ></v-text-field>

              <v-switch
                :disabled="filtros.tipoMovimentacao == 'Saída'"
                v-if="telaParaFiltrar == 'movimentacoes'"
                v-model="filtros.produtosVencidos"
                label="Produtos vencidos"
                color="#AA00FF"
                hide-details
                inset
                @update:model-value="filtros.tipoMovimentacao = 'Entrada'"
              ></v-switch>

              <v-combobox
                v-if="telaParaFiltrar == 'operadores'"
                label="Genêros"
                :items="['Feminino', 'Masculino']"
                item-title="descricao"
                item-value="id"
                v-model="filtros.generoUsuario"
                variant="outlined"
              ></v-combobox>

              <v-combobox
                v-if="telaParaFiltrar == 'operadores'"
                label="Permissões"
                :items="['Administrador', 'Usuario']"
                item-title="descricao"
                item-value="id"
                v-model="filtros.permissaoUsuario"
                variant="outlined"
              ></v-combobox>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="modalAberto = false">Fechar</v-btn>
            <v-btn color="#aa00ff" @click="obterParcial" variant="tonal">
              Filtrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
  name: 'Aterrissagem',
  props: {
    titulo: String,
    provider: String,
    colunasAterrissagem: [],
    telaEdicao: String,
    telaParaFiltrar: String,
    mostrarBotaoDeFiltro: Boolean,
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
      modalAberto: false,
      categorias: [],
      operadores: [],
      filtros: {},
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

      return this.dados;
    },

    async obterdadosParaFiltrar() {},

    async obterParcial() {
      if (this.modalAberto) {
        this.modalAberto = false;
      }

      this.filtros.termoDePesquisa = this.termoDePesquisa;
      api
        .post(
          `http://localhost:3000/${this.provider}/obter-parcial`,
          this.filtros,
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

    abrirModalFiltro() {
      this.modalAberto = true;
    },

    async obterCategorias() {
      api
        .get(`http://localhost:3000/categorias/`, {
          headers: {
            Authorization: `Bearer ${this.obterToken()}`,
          },
        })
        .then((response) => {
          this.categorias = [];

          for (const dado of response.data) {
            this.categorias.push(dado);
          }
        });
    },

    async obterMarcas() {
      api
        .get(`http://localhost:3000/marcas/`, {
          headers: {
            Authorization: `Bearer ${this.obterToken()}`,
          },
        })
        .then((response) => {
          this.marcas = [];

          for (const dado of response.data) {
            this.marcas.push(dado);
          }
        });
    },

    async obterOperadores() {
      api
        .get(`http://localhost:3000/usuarios/`, {
          headers: {
            Authorization: `Bearer ${this.obterToken()}`,
          },
        })
        .then((response) => {
          this.operadores = [];

          for (const dado of response.data) {
            this.operadores.push(dado);
          }
        });
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

          for (const dado of response.data) {
            this.depositos.push(dado);
          }
        });
    },

    async obterFornecedores() {
      api
        .get(`http://localhost:3000/fornecedores/`, {
          headers: {
            Authorization: `Bearer ${this.obterToken()}`,
          },
        })
        .then((response) => {
          this.fornecedores = [];

          for (const dado of response.data) {
            this.fornecedores.push(dado);
          }
        });
    },

    async obterProdutos() {
      api
        .get(`http://localhost:3000/produtos/`, {
          headers: {
            Authorization: `Bearer ${this.obterToken()}`,
          },
        })
        .then((response) => {
          this.produtos = [];

          for (const dado of response.data) {
            this.produtos.push(dado);
          }
        });
    },
  },
  created() {
    this.obtemDados();
    if (this.mostrarBotaoDeFiltro) {
      if (this.telaParaFiltrar === 'produtos') {
        this.obterCategorias();
        this.obterMarcas();
        this.obterOperadores();
      }

      if (this.telaParaFiltrar === 'movimentacoes') {
        this.obterOperadores();
        this.obterDepositos();
        this.obterFornecedores();

        this.obterProdutos();
      }
    }
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
