<template>
  <v-main class="fill-height">
    <v-card min-height="90vh" width="calc(100% - 100px)" style="margin: 0 auto">
      <v-toolbar flat>
        <v-toolbar-title class="text-grey">Movimentações</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon color="green" @click="salvar()">
          <v-icon>mdi-check</v-icon>
        </v-btn>

        <v-btn icon color="red" @click="voltar()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-tabs
          v-model="tab"
          align-tabs="center"
          color="#AA00FF"
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
            ></v-combobox>
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
            ></v-text-field>

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
            ></v-text-field>

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
              ></v-text-field>
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
            ></v-text-field>

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
              ></v-text-field>
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
              ></v-text-field>
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
            ></v-combobox>

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
            ></v-combobox>
          </v-tabs-window-item>

          <v-tabs-window-item :key="2" :value="2" style="padding: 5px">
            <v-combobox
              :disabled="
                modelo.tipoMovimentacao === null ||
                modelo.tipoMovimentacao === 'Saída'
              "
              label="Depósto"
              :items="depositos"
              item-title="descricao"
              item-value="id"
              v-model="modelo.lancamentoProduto.localizacaoDeposito.deposito"
              variant="outlined"
              append-icon="mdi-plus-circle-outline"
              @click:append="adicionarDeposito"
            ></v-combobox>

            <div class="movimentacao-campos">
              <v-text-field
                :disabled="
                  modelo.tipoMovimentacao === null ||
                  modelo.tipoMovimentacao === 'Saída'
                "
                label="Corredor"
                v-model="modelo.lancamentoProduto.localizacaoDeposito.corredor"
                variant="outlined"
              ></v-text-field>

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
              ></v-text-field>
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
import api from '@/services/api';
import {
  useAuthStore,
  useDadosStore,
  useAlerta,
  useDadosDeOutraTela,
} from '@/store/index';

export default {
  name: 'MovimentacoesEdicao',
  data() {
    return {
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
    obterToken() {
      const authStore = useAuthStore();
      const token = authStore.getToken();

      if (!token) {
        this.$router.push('/login');
      }

      return token;
    },

    voltar() {
      this.$router.push('/movimentacoes');
    },

    podeGravar() {
      if (!this.modelo.tipoMovimentacao) {
        useAlerta().exibirSnackbar(
          'Selecione o tipo de movimentação!',
          'orange',
        );
        return false;
      }

      if (!this.modelo.lancamentoProduto.lote) {
        useAlerta().exibirSnackbar('O lote é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.lancamentoProduto.dataValidade) {
        useAlerta().exibirSnackbar(
          'A data de validade é obrigatória!',
          'orange',
        );
        return false;
      }

      if (!this.modelo.quantidade) {
        useAlerta().exibirSnackbar('A quantidade é obrigatória!', 'orange');
        return false;
      }

      if (!this.modelo.lancamentoProduto.precoCusto) {
        useAlerta().exibirSnackbar('O preço de custo é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.lancamentoProduto.precoVenda) {
        useAlerta().exibirSnackbar('O preço de venda é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.lancamentoProduto.produto) {
        useAlerta().exibirSnackbar('Selecione o produto!', 'orange');
        return false;
      }

      if (!this.modelo.lancamentoProduto.fornecedor) {
        useAlerta().exibirSnackbar('Selecione o fornecedor!', 'orange');
        return false;
      }

      if (!this.modelo.lancamentoProduto.localizacaoDeposito.deposito) {
        useAlerta().exibirSnackbar(
          'Selecione o depósito onde o produto será armazenado!',
          'orange',
        );
        return false;
      }

      if (!this.modelo.lancamentoProduto.localizacaoDeposito.deposito) {
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

    salvar() {
      if (!this.podeGravar()) {
        return;
      }

      this.modelo.quantidade = parseInt(this.modelo.quantidade, 10);

      if (this.dados && this.dados.ehTelaAtualizacao) {
        api
          .patch(
            `http://localhost:3000/movimentacoes/${this.dados.id}`,
            this.modelo,
            {
              headers: {
                Authorization: `Bearer ${this.obterToken()}`,
              },
            },
          )
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
        api
          .post(`http://localhost:3000/movimentacoes/`, this.modelo, {
            headers: {
              Authorization: `Bearer ${this.obterToken()}`,
            },
          })
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
      api
        .get(`http://localhost:3000/movimentacoes/${this.dados.id}`, {
          headers: {
            Authorization: `Bearer ${this.obterToken()}`,
          },
        })
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
      api
        .get(`http://localhost:3000/produtos/`, {
          headers: {
            Authorization: `Bearer ${this.obterToken()}`,
          },
        })
        .then((response) => {
          this.produtos = [];

          for (const produto of response.data) {
            this.produtos.push(produto);
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

          for (const fornecedor of response.data) {
            this.fornecedores.push(fornecedor);
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

          for (const deposito of response.data) {
            this.depositos.push(deposito);
          }
        });
    },
    adicionarProduto() {
      const dadosOutraTela = {
        dadosOriginais: this.modelo,
        rotaOriginal: 'movimentacoes-edicao',
        rotaCriacao: 'produtos-edicao',
        indoParaCriacao: true,
      };

      useDadosDeOutraTela().salvarDadosDeOutraTela(dadosOutraTela);

      this.$router.push('produtos-edicao');
    },
    adicionarDeposito() {
      const dadosOutraTela = {
        dadosOriginais: this.modelo,
        rotaOriginal: 'movimentacoes-edicao',
        rotaCriacao: 'depositos-edicao',
        indoParaCriacao: true,
      };
      useDadosDeOutraTela().salvarDadosDeOutraTela(dadosOutraTela);

      this.$router.push('depositos-edicao');
    },
    adicionarFornecedor() {
      const dadosOutraTela = {
        dadosOriginais: this.modelo,
        rotaOriginal: 'movimentacoes-edicao',
        rotaCriacao: 'fornecedores-edicao',
        indoParaCriacao: true,
      };
      useDadosDeOutraTela().salvarDadosDeOutraTela(dadosOutraTela);

      this.$router.push('fornecedores-edicao');
    },

    obterDadosPorLote(lote) {
      this.loading = true;
      api
        .get(
          `http://localhost:3000/movimentacoes/obter-movimentacoes-por-lote/${lote}`,
          {
            headers: {
              Authorization: `Bearer ${this.obterToken()}`,
            },
          },
        )
        .then((response) => {
          this.modelo = null;

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

    if (this.dadosDeOutraTela && !this.dadosDeOutraTela.indoParaCriacao) {
      this.modelo = this.dadosDeOutraTela.dadosOriginais;
      useDadosDeOutraTela().salvarDadosDeOutraTela(null);
    }
  },
  computed: {
    dados() {
      return useDadosStore().getDadosParaEdicao;
    },

    dadosDeOutraTela() {
      return useDadosDeOutraTela().getDadosDeOutraTela;
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
