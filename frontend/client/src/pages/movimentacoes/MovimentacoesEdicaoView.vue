<template>
  <v-main class="fill-height">
    <v-card min-height="90vh" width="calc(100% - 100px)" style="margin: 0 auto">
      <v-toolbar flat>
        <v-toolbar-title class="text-grey">Movimentações</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon color="green" @click="salvar()">
          <v-icon>mdi-check</v-icon>
          <v-tooltip activator="parent" location="top">Salvar</v-tooltip>
        </v-btn>

        <v-btn icon color="red" @click="voltar()">
          <v-icon>mdi-close</v-icon>
          <v-tooltip activator="parent" location="top">Voltar</v-tooltip>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-tabs
          v-model="tab"
          align-tabs="center"
          color="var(--primary-color)"
          style="margin-bottom: 25px"
        >
          <v-tab :value="1">Dados do produto</v-tab>
          <v-tab :value="2">Localização</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item :key="1" :value="1" style="padding: 5px">
            <v-combobox
              :disabled="dados && dados.ehTelaAtualizacao"
              label="Tipo de movimentação"
              :items="['Entrada', 'Saída']"
              item-title="descricao"
              item-value="id"
              v-model="modelo.tipoMovimentacao"
              variant="outlined"
              @update:model-value="limparDados(modelo.tipoMovimentacao)"
            >
              <template #label>
                Tipo de movimentação
                <span><strong>*</strong></span>
              </template>
            </v-combobox>
            <v-text-field
              v-if="
                modelo.tipoMovimentacao && modelo.tipoMovimentacao === 'Saída'
              "
              :disabled="dados && dados.ehTelaAtualizacao"
              style="margin-bottom: 25px"
              :loading="loading"
              append-inner-icon="mdi-magnify"
              density="compact"
              label="Lote"
              variant="solo"
              hide-details
              single-line
              v-model="modelo.lancamentoProduto.lote"
              @click:append-inner="
                obterDadosPorLote(modelo.lancamentoProduto.lote)
              "
            >
              <template #label>
                Lote
                <span><strong>*</strong></span>
              </template>
              <v-tooltip activator="parent" location="top">
                Buscar por lote
              </v-tooltip>
            </v-text-field>

            <div
              class="movimentacao-campos"
              v-if="!(this.dados && this.dados.ehTelaAtualizacao)"
            >
              <v-text-field
                disabled
                v-if="
                  modelo.tipoMovimentacao && modelo.tipoMovimentacao === 'Saída'
                "
                label="Quantidade de entrada"
                v-model="totalEntrada"
                type="number"
                variant="outlined"
              ></v-text-field>

              <v-text-field
                disabled
                class="margin-campos"
                v-if="
                  modelo.tipoMovimentacao && modelo.tipoMovimentacao === 'Saída'
                "
                label="Quantidade de saída"
                v-model="totalSaida"
                type="number"
                variant="outlined"
              ></v-text-field>

              <v-text-field
                disabled
                class="margin-campos"
                v-if="
                  modelo.tipoMovimentacao && modelo.tipoMovimentacao === 'Saída'
                "
                label="Total em estoque"
                v-model="totalRestante"
                type="number"
                variant="outlined"
              ></v-text-field>
            </div>
            <v-text-field
              v-if="
                modelo.tipoMovimentacao && modelo.tipoMovimentacao === 'Saída'
              "
              :disabled="dados && dados.ehTelaAtualizacao"
              label="Quantidade para saída"
              v-model="modelo.quantidade"
              type="number"
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-if="
                !modelo.tipoMovimentacao ||
                modelo.tipoMovimentacao === 'Entrada'
              "
              label="Lote"
              v-model="modelo.lancamentoProduto.lote"
              variant="outlined"
            >
              <template #label>
                Lote
                <span><strong>*</strong></span>
              </template>
            </v-text-field>

            <div class="movimentacao-campos">
              <v-text-field
                :disabled="
                  modelo.tipoMovimentacao === null ||
                  modelo.tipoMovimentacao === 'Saída'
                "
                class="campos-datas"
                variant="outlined"
                type="date"
                v-model="modelo.lancamentoProduto.dataValidade"
                label="Data de validade"
                clearable
              >
                <template #label>
                  Data de validade
                  <span><strong>*</strong></span>
                </template>
              </v-text-field>
              <v-text-field
                v-if="modelo.dataMovimentacao"
                disabled
                class="campos-datas margin-campos"
                variant="outlined"
                type="datetime-local"
                v-model="modelo.dataMovimentacao"
                label="Data da última movimentação"
              ></v-text-field>
            </div>

            <v-text-field
              v-if="
                !modelo.tipoMovimentacao ||
                modelo.tipoMovimentacao === 'Entrada'
              "
              label="Quantidade"
              v-model="modelo.quantidade"
              type="number"
              variant="outlined"
            >
              <template #label>
                Quantidade
                <span><strong>*</strong></span>
              </template>
            </v-text-field>

            <div class="movimentacao-campos">
              <v-text-field
                :disabled="
                  modelo.tipoMovimentacao === null ||
                  modelo.tipoMovimentacao === 'Saída'
                "
                prefix="R$"
                label="Preço de custo"
                v-model="modelo.lancamentoProduto.precoCusto"
                type="number"
                variant="outlined"
              >
                <template #label>
                  Preço de custo
                  <span><strong>*</strong></span>
                </template>
              </v-text-field>
              <v-text-field
                :disabled="
                  modelo.tipoMovimentacao === null ||
                  modelo.tipoMovimentacao === 'Saída'
                "
                prefix="R$"
                class="margin-campos"
                label="Preço de venda"
                v-model="modelo.lancamentoProduto.precoVenda"
                type="number"
                variant="outlined"
              >
                <template #label>
                  Preço de venda
                  <span><strong>*</strong></span>
                </template>
              </v-text-field>
            </div>

            <v-combobox
              :disabled="
                modelo.tipoMovimentacao === null ||
                modelo.tipoMovimentacao === 'Saída'
              "
              label="Produto"
              :items="produtos"
              item-title="nome"
              item-value="id"
              v-model="modelo.lancamentoProduto.produto"
              variant="outlined"
              append-icon="mdi-plus-circle-outline"
              @click:append="adicionarProduto"
            >
              <template #label>
                Produto
                <span><strong>*</strong></span>
              </template>
            </v-combobox>

            <v-combobox
              :disabled="
                modelo.tipoMovimentacao === null ||
                modelo.tipoMovimentacao === 'Saída'
              "
              label="Fornecedor"
              :items="fornecedores"
              item-title="razaoSocial"
              item-value="id"
              v-model="modelo.lancamentoProduto.fornecedor"
              variant="outlined"
              append-icon="mdi-plus-circle-outline"
              @click:append="adicionarFornecedor"
            >
              <template #label>
                Fornecedor
                <span><strong>*</strong></span>
              </template>
            </v-combobox>
          </v-tabs-window-item>

          <v-tabs-window-item :key="2" :value="2" style="padding: 5px">
            <v-combobox
              :disabled="
                modelo.tipoMovimentacao === null ||
                modelo.tipoMovimentacao === 'Saída'
              "
              label="Depósito"
              :items="depositos"
              item-title="descricao"
              item-value="id"
              v-model="modelo.lancamentoProduto.localizacaoDeposito.deposito"
              variant="outlined"
              append-icon="mdi-plus-circle-outline"
              @click:append="adicionarDeposito"
            >
              <template #label>
                Depósito
                <span><strong>*</strong></span>
              </template>
            </v-combobox>

            <div class="movimentacao-campos">
              <v-text-field
                :disabled="
                  modelo.tipoMovimentacao === null ||
                  modelo.tipoMovimentacao === 'Saída'
                "
                label="Corredor"
                v-model="modelo.lancamentoProduto.localizacaoDeposito.corredor"
                variant="outlined"
              >
                <template #label>
                  Corredor
                  <span><strong>*</strong></span>
                </template>
              </v-text-field>

              <v-text-field
                :disabled="
                  modelo.tipoMovimentacao === null ||
                  modelo.tipoMovimentacao === 'Saída'
                "
                class="margin-campos"
                label="Prateleira"
                v-model="
                  modelo.lancamentoProduto.localizacaoDeposito.prateleira
                "
                variant="outlined"
              >
                <template #label>
                  Prateleira
                  <span><strong>*</strong></span>
                </template>
              </v-text-field>
            </div>

            <v-text-field
              :disabled="
                modelo.tipoMovimentacao === null ||
                modelo.tipoMovimentacao === 'Saída'
              "
              label="Observação"
              v-model="modelo.lancamentoProduto.localizacaoDeposito.observacao"
              variant="outlined"
            ></v-text-field>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script>
import comunicacaoDepositos from '@/services/depositos/comunicacao-deposito';
import comunicacaoFornecedores from '@/services/fornecedores/comunicacao-fornecedores';
import comunicacaoMovimentacoes from '@/services/movimentacoes/comunicacao-movimentacoes';
import comunicacaoProdutos from '@/services/produtos/comunicacao-produtos';
import { useDadosStore, useAlerta, useDadosDeOutraTela } from '@/store/index';

export default {
  name: 'MovimentacoesEdicao',
  data() {
    return {
      obteveDadosDoLote: false,
      loaded: false,
      loading: false,
      totalEntrada: null,
      totalSaida: null,
      totalRestante: null,
      modelo: {
        quantidade: null,
        lancamentoProduto: {
          localizacaoDeposito: {},
        },
      },
      tab: 0,
      produtos: [],
      fornecedores: [],
      depositos: [],
    };
  },
  methods: {
    voltar() {
      this.$router.push('/movimentacoes');
    },

    podeGravar() {
      if (!this.modelo.lancamentoProduto.lote) {
        useAlerta().exibirSnackbar('O lote é obrigatório!', 'orange');
        return false;
      }

      if (this.modelo.tipoMovimentacao == 'Saída' && !this.obteveDadosDoLote) {
        useAlerta().exibirSnackbar(
          'Clique na lupa para buscar pelos dados referentes ao lote !',
          'orange',
        );
        return false;
      }

      if (!this.modelo.quantidade) {
        useAlerta().exibirSnackbar('A quantidade é obrigatória!', 'orange');
        return false;
      }

      if (this.modelo.quantidade && this.modelo.quantidade < 1) {
        useAlerta().exibirSnackbar(
          'A quantidade deve ser maior que zero!',
          'orange',
        );
        return false;
      }

      if (!this.modelo.tipoMovimentacao) {
        useAlerta().exibirSnackbar(
          'Selecione o tipo de movimentação!',
          'orange',
        );
        return false;
      }

      if (!this.modelo.lancamentoProduto.dataValidade) {
        useAlerta().exibirSnackbar(
          'A data de validade é obrigatória!',
          'orange',
        );
        return false;
      }

      if (this.modelo.quantidade < 1) {
        useAlerta().exibirSnackbar(
          'Insira um valor válido para a quantidade!',
          'orange',
        );
        return false;
      }

      if (!this.modelo.lancamentoProduto.precoCusto) {
        useAlerta().exibirSnackbar('O preço de custo é obrigatório!', 'orange');
        return false;
      }

      if (this.modelo.lancamentoProduto.precoCusto < 0) {
        useAlerta().exibirSnackbar(
          'O preço de custo deve ser maior que zero!',
          'orange',
        );
        return false;
      }

      if (!this.modelo.lancamentoProduto.precoVenda) {
        useAlerta().exibirSnackbar('O preço de venda é obrigatório!', 'orange');
        return false;
      }

      if (this.modelo.lancamentoProduto.precoVenda < 0) {
        useAlerta().exibirSnackbar(
          'O preço de venda deve ser maior que zero!',
          'orange',
        );
        return false;
      }

      if (
        !this.modelo.lancamentoProduto.produto ||
        !this.modelo.lancamentoProduto.produto.id
      ) {
        useAlerta().exibirSnackbar('Selecione o produto!', 'orange');
        return false;
      }

      if (
        !this.modelo.lancamentoProduto.fornecedor ||
        !this.modelo.lancamentoProduto.fornecedor.id
      ) {
        useAlerta().exibirSnackbar('Selecione o fornecedor!', 'orange');
        return false;
      }

      if (
        !this.modelo.lancamentoProduto.localizacaoDeposito.deposito ||
        !this.modelo.lancamentoProduto.localizacaoDeposito.deposito.id
      ) {
        useAlerta().exibirSnackbar(
          'Selecione o depósito onde o produto será armazenado!',
          'orange',
        );
        return false;
      }

      if (!this.modelo.lancamentoProduto.localizacaoDeposito.corredor) {
        useAlerta().exibirSnackbar(
          'Selecione o corredor onde o produto será armazenado!',
          'orange',
        );
        return false;
      }

      if (!this.modelo.lancamentoProduto.localizacaoDeposito.prateleira) {
        useAlerta().exibirSnackbar(
          'Selecione a prateleira onde o produto será armazenado!',
          'orange',
        );
        return false;
      }

      if (this.modelo.tipoMovimentacao === 'Saída') {
        if (this.totalRestante < this.modelo.quantidade && !this.dados) {
          useAlerta().exibirSnackbar(
            'Quantidade insuficiente no estoque!',
            'orange',
          );
          return false;
        }
      }

      return true;
    },

    async salvar() {
      if (!this.podeGravar()) {
        return;
      }

      this.modelo.quantidade = parseInt(this.modelo.quantidade, 10);

      if (this.dados && this.dados.ehTelaAtualizacao) {
        await comunicacaoMovimentacoes
          .atualizar(this.dados.id, this.modelo)
          .then(() => {
            useAlerta().exibirSnackbar(
              'A movimentação foi atualizada com sucesso!',
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
        await comunicacaoMovimentacoes
          .criar(this.modelo)
          .then(() => {
            useAlerta().exibirSnackbar(
              'A movimentação foi criada com sucesso!',
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

    async obterMovimentacao() {
      await comunicacaoMovimentacoes
        .obterPorId(this.dados.id)
        .then((response) => {
          this.modelo = null;

          this.modelo = response.data;

          this.ajustarDateTime();
        });
    },

    ajustarDateTime() {
      let dataUTC = new Date(this.modelo.dataMovimentacao);

      function pad(number) {
        if (number < 10) {
          return '0' + number;
        }
        return number;
      }

      this.modelo.dataMovimentacao = `${dataUTC.getFullYear()}-${pad(dataUTC.getMonth() + 1)}-${pad(dataUTC.getDate())}T${pad(dataUTC.getHours())}:${pad(dataUTC.getMinutes())}`;
    },

    async obterProdutos() {
      await comunicacaoProdutos.obterTodos().then((response) => {
        this.produtos = [];

        for (const produto of response.data) {
          this.produtos.push(produto);
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

    async obterDepositos() {
      await comunicacaoDepositos.obterParcialFiltro().then((response) => {
        this.depositos = [];

        for (const deposito of response.data) {
          this.depositos.push(deposito);
        }
      });
    },

    adicionarProduto() {
      if (this.dados && this.dados.ehTelaAtualizacao) {
        useAlerta().exibirSnackbar(
          'No momento esta funcionalidade só está funcionando ao criar um novo elemento, novas atualizações serão implementadas. Aguarde!',
          'orange',
        );
        return;
      }
      const dadosOutraTela = {
        dadosOriginais: this.modelo,
        rotaOriginal: 'movimentacoes-edicao',
        rotaCriacao: 'produtos-edicao',
      };

      useDadosDeOutraTela().adicionarDadosDeOutraTela(dadosOutraTela);

      this.$router.push('produtos-edicao');
    },

    adicionarDeposito() {
      if (this.dados && this.dados.ehTelaAtualizacao) {
        useAlerta().exibirSnackbar(
          'No momento esta funcionalidade só está funcionando ao criar um novo elemento, novas atualizações serão implementadas. Aguarde!',
          'orange',
        );
        return;
      }
      const dadosOutraTela = {
        dadosOriginais: this.modelo,
        rotaOriginal: 'movimentacoes-edicao',
        rotaCriacao: 'depositos-edicao',
      };
      useDadosDeOutraTela().adicionarDadosDeOutraTela(dadosOutraTela);

      this.$router.push('depositos-edicao');
    },

    adicionarFornecedor() {
      if (this.dados && this.dados.ehTelaAtualizacao) {
        useAlerta().exibirSnackbar(
          'No momento esta funcionalidade só está funcionando ao criar um novo elemento, novas atualizações serão implementadas. Aguarde!',
          'orange',
        );
        return;
      }
      const dadosOutraTela = {
        dadosOriginais: this.modelo,
        rotaOriginal: 'movimentacoes-edicao',
        rotaCriacao: 'fornecedores-edicao',
      };
      useDadosDeOutraTela().adicionarDadosDeOutraTela(dadosOutraTela);

      this.$router.push('fornecedores-edicao');
    },

    async obterDadosPorLote(lote) {
      this.limparDados(this.modelo.tipoMovimentacao);
      if (!lote) {
        useAlerta().exibirSnackbar(
          'Insira o lote do produto para realizar a saída!',
          'orange',
        );
        return;
      }
      this.loading = true;
      await comunicacaoMovimentacoes
        .obterMovimentacoesPorLote(lote)
        .then((response) => {
          this.obteveDadosDoLote = true;

          this.totalEntrada = response.data.totalEntrada;
          this.totalSaida = response.data.totalSaida;
          this.totalRestante = this.totalEntrada - this.totalSaida;

          this.modelo = response.data.movimentacao;
          this.modelo.tipoMovimentacao = 'Saída';
          this.modelo.quantidade = null;

          this.ajustarDateTime();
          this.loading = false;
          this.loaded = true;
        })
        .catch((error) => {
          this.loading = false;
          this.loaded = true;
          if (error.response && error.response.data) {
            useAlerta().exibirSnackbar(error.response.data.message, 'red');
          } else {
            useAlerta().exibirSnackbar(error.message, 'red');
          }
        });
    },

    limparDados(movimentacaoAtual) {
      if (movimentacaoAtual) {
        this.totalEntrada = null;
        this.totalSaida = null;
        this.obteveDadosDoLote = false;
        (this.modelo = {
          lancamentoProduto: {
            localizacaoDeposito: {},
          },
        }),
          (this.modelo.tipoMovimentacao = movimentacaoAtual);
      }
    },
  },
  created() {
    this.obterFornecedores();
    this.obterProdutos();
    this.obterDepositos();
    if (this.dados && this.dados.ehTelaAtualizacao) {
      this.obterMovimentacao();
    }

    if (
      useDadosDeOutraTela().ultimoElemento &&
      useDadosDeOutraTela().ultimoElemento.rotaOriginal ==
        'movimentacoes-edicao'
    ) {
      this.modelo = useDadosDeOutraTela().ultimoElemento.dadosOriginais;
      useDadosDeOutraTela().finalizar();
    }
  },
  computed: {
    dados() {
      return useDadosStore().getDadosParaEdicao;
    },
  },
};
</script>

<style>
.movimentacao-campos {
  @media (min-width: 850px) {
    display: flex;
  }

  @media (max-width: 849px) {
    display: block;
  }
}

.margin-campos {
  @media (min-width: 850px) {
    margin-left: 15px;
  }

  @media (max-width: 849px) {
    margin-left: 0;
  }
}

.campos-datas {
  @media (min-width: 850px) {
    width: 180px;
  }
}
</style>
