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
            style="color: var(--primary-color)"
            @click="irParaTelaDeEdicao"
            icon
            v-if="mostrarBotaoEdicao"
          >
            <v-icon>mdi-square-edit-outline</v-icon>
            <v-tooltip activator="parent" location="top">Editar item</v-tooltip>
          </v-btn>

          <v-btn
            style="color: var(--primary-color)"
            @click="modalConfirmarExclusao = true"
            icon
            v-if="mostrarBotaoEdicao"
          >
            <v-icon>mdi-delete-outline</v-icon>
            <v-tooltip activator="parent" location="top">
              Excluir item
            </v-tooltip>
          </v-btn>
        </div>

        <v-dialog v-model="modalConfirmarExclusao" max-width="500" persistent>
          <v-card>
            <v-card-text>
              Tem certeza que deseja excluir o item?
              <div
                style="padding: 25px"
                v-if="telaParaFiltrar == 'movimentacoes'"
              >
                <v-alert
                  border="top"
                  type="warning"
                  variant="outlined"
                  prominent
                >
                  Ao excluir uma movimentação de entrada, todas as movimentações
                  de saída associadas ao mesmo lote serão excluídas também!
                </v-alert>
              </div>
            </v-card-text>

            <template v-slot:actions>
              <v-spacer></v-spacer>

              <v-btn @click="modalConfirmarExclusao = false">voltar</v-btn>

              <v-btn
                color="var(--primary-color)"
                variant="tonal"
                @click="
                  deletarItem();
                  modalConfirmarExclusao = false;
                "
              >
                Excluir
              </v-btn>
            </template>
          </v-card>
        </v-dialog>

        <v-btn
          color="var(--primary-color)"
          @click="pesquisa = true"
          v-if="!pesquisa && !mostrarBotaoEdicao"
          icon
        >
          <v-icon>mdi-magnify</v-icon>
          <v-tooltip activator="parent" location="start">Buscar</v-tooltip>
        </v-btn>

        <v-text-field
          class="busca-itens"
          v-if="pesquisa && !mostrarBotaoEdicao"
          prepend-icon="mdi-magnify"
          hide-details
          single-line
          v-model="filtros.termoDePesquisa"
          placeholder="Digite um termo para pesquisa"
          @update:model-value="obterParcial()"
          variant="outlined"
        ></v-text-field>

        <v-btn
          color="var(--primary-color)"
          @click="pesquisa = false"
          icon
          v-if="pesquisa && !mostrarBotaoEdicao"
        >
          <v-icon>mdi-close</v-icon>
          <v-tooltip activator="parent" location="top">Fechar busca</v-tooltip>
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
        color="var(--primary-color)"
        @click="abrirModalFiltro"
        style="top: -55px"
      >
        <v-icon class="cor-icones">mdi-filter</v-icon>
        <v-tooltip activator="parent" location="start">Filtrar itens</v-tooltip>
      </v-fab>

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
                color="var(--primary-color)"
                variant="outlined"
                persistent-hint
                clearable
              ></v-select>

              <v-select
                v-if="telaParaFiltrar == 'produtos'"
                v-model="filtros.marcas"
                item-title="descricao"
                item-value="id"
                :items="marcas"
                label="Marcas"
                multiple
                color="var(--primary-color)"
                variant="outlined"
                persistent-hint
                clearable
              ></v-select>

              <v-combobox
                v-if="telaParaFiltrar == 'movimentacoes'"
                label="Tipo de movimentação"
                :items="['Entrada', 'Saída']"
                item-title="descricao"
                item-value="id"
                v-model="filtros.tipoMovimentacao"
                variant="outlined"
                clearable
                color="var(--primary-color)"
                @update:model-value="
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
                color="var(--primary-color)"
                variant="outlined"
                persistent-hint
                clearable
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
                color="var(--primary-color)"
                variant="outlined"
                persistent-hint
                clearable
              ></v-select>

              <v-select
                v-if="telaParaFiltrar == 'movimentacoes'"
                :disabled="filtros.naoEhAdministrador"
                v-model="filtros.depositos"
                item-title="descricao"
                item-value="id"
                :items="depositos"
                label="Depósitos"
                multiple
                color="var(--primary-color)"
                variant="outlined"
                persistent-hint
                clearable
              ></v-select>

              <v-select
                v-if="telaParaFiltrar == 'movimentacoes'"
                v-model="filtros.fornecedores"
                item-title="razaoSocial"
                item-value="id"
                :items="fornecedores"
                label="Fornecedores"
                multiple
                color="var(--primary-color)"
                variant="outlined"
                persistent-hint
                clearable
              ></v-select>

              <v-text-field
                :disabled="filtros.tipoMovimentacao == 'Saída'"
                v-if="telaParaFiltrar == 'movimentacoes'"
                label="Dias para vencer"
                v-model="filtros.diasParaVencer"
                variant="outlined"
                type="number"
                clearable
                @update:model-value="filtros.tipoMovimentacao = 'Entrada'"
              ></v-text-field>

              <v-switch
                :disabled="filtros.tipoMovimentacao == 'Saída'"
                v-if="telaParaFiltrar == 'movimentacoes'"
                v-model="filtros.produtosVencidos"
                label="Produtos vencidos"
                color="var(--primary-color)"
                hide-details
                inset
                clearable
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
                clearable
                color="var(--primary-color)"
              ></v-combobox>

              <v-combobox
                v-if="telaParaFiltrar == 'operadores'"
                label="Permissões"
                :items="['Administrador', 'Usuario']"
                item-title="descricao"
                item-value="id"
                v-model="filtros.permissaoUsuario"
                variant="outlined"
                clearable
                color="var(--primary-color)"
              ></v-combobox>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="modalAberto = false">Fechar</v-btn>
            <v-btn
              color="var(--primary-color)"
              @click="obterParcial"
              variant="tonal"
            >
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
        color="var(--primary-color)"
        @click="irParaTelaDeCriacao"
      >
        <v-icon class="cor-icones">mdi-plus</v-icon>
        <v-tooltip activator="parent" location="start">
          Adicionar item
        </v-tooltip>
      </v-fab>
    </v-sheet>
  </v-main>
</template>

<script>
import comunicacaoCategorias from '@/services/categorias/comunicacao-categorias';
import comunicacaoDepositos from '@/services/depositos/comunicacao-deposito';
import comunicacaoFornecedores from '@/services/fornecedores/comunicacao-fornecedores';
import comunicacaoMarcas from '@/services/marcas/comunicacao-marcas';
import comunicacaoProdutos from '@/services/produtos/comunicacao-produtos';
import comunicacaoUsuarios from '@/services/usuarios/comunicacao-usuarios';
import { useDadosStore, useAlerta } from '@/store/index';

export default {
  name: 'Aterrissagem',
  props: {
    titulo: String,
    provider: String,
    comunicacao: {
      type: Object,
      required: true,
    },
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
      modalConfirmarExclusao: false,
    };
  },
  methods: {
    calculateTableHeight() {
      const cardHeight = document.querySelector('.fill-height').clientHeight;
      return cardHeight;
    },

    async obterdadosParaFiltrar() {},

    async obterParcial() {
      if (this.modalAberto) {
        this.modalAberto = false;
      }

      await this.comunicacao
        .obterParcialFiltro(this.filtros)
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

    async deletarItem() {
      if (this.selected.length > 1) {
        useAlerta().exibirSnackbar(
          'Selecione apenas um item para exclusão!',
          'orange',
        );
        return;
      }

      await this.comunicacao
        .excluir(this.selected[0])
        .then(() => {
          useAlerta().exibirSnackbar('Item excluído com sucesso!', 'green');
          this.selected = null;
          this.obterParcial();
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
      await comunicacaoCategorias.obterTodos().then((response) => {
        this.categorias = [];

        for (const dado of response.data) {
          this.categorias.push(dado);
        }
      });
    },

    async obterMarcas() {
      await comunicacaoMarcas.obterTodos().then((response) => {
        this.marcas = [];

        for (const dado of response.data) {
          this.marcas.push(dado);
        }
      });
    },

    async obterOperadores() {
      await comunicacaoUsuarios.obterTodos().then((response) => {
        this.operadores = [];

        for (const dado of response.data) {
          this.operadores.push(dado);
        }
      });
    },

    async obterDepositos() {
      await comunicacaoDepositos.obterParcialFiltro().then((response) => {
        this.depositos = [];

        for (const dado of response.data) {
          this.depositos.push(dado);
        }
      });
    },

    async obterFornecedores() {
      await comunicacaoFornecedores.obterTodos().then((response) => {
        this.fornecedores = [];

        for (const dado of response.data) {
          this.fornecedores.push(dado);
        }
      });
    },

    async obterProdutos() {
      await comunicacaoProdutos.obterTodos().then((response) => {
        this.produtos = [];

        for (const dado of response.data) {
          this.produtos.push(dado);
        }
      });
    },
  },
  created() {
    this.obterParcial();
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
  color: var(--primary-color);
}

.custom-header i {
  color: var(--primary-color);
}

.cor-icones {
  color: white;
}
</style>
