<template>
  <v-main class="fill-height">
    <v-card min-height="90vh" width="calc(100% - 100px)" style="margin: 0 auto">
      <v-toolbar flat>
        <v-toolbar-title class="text-grey">Depósitos</v-toolbar-title>

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
        <v-text-field
          label="Descrição"
          v-model="modelo.descricao"
          variant="outlined"
        >
          <template #label>
            Descrição
            <span><strong>*</strong></span>
          </template>
        </v-text-field>
        <div>
          <div style="padding: 15px">
            <div
              style="
                text-align: left;
                color: var(--primary-color);
                font-size: large;
              "
            >
              Endereço
            </div>
            <v-divider class="divisao-endereco"></v-divider>
            <div style="padding: 15px">
              <div class="endereco-campos">
                <v-text-field
                  label="Logradouro"
                  v-model="modelo.endereco.logradouro"
                  maxlength="100"
                  variant="outlined"
                >
                  <template #label>
                    Logradouro
                    <span><strong>*</strong></span>
                  </template>
                </v-text-field>
                <v-text-field
                  class="margin-enderecos"
                  label="Bairro"
                  v-model="modelo.endereco.bairro"
                  maxlength="100"
                  variant="outlined"
                >
                  <template #label>
                    Bairro
                    <span><strong>*</strong></span>
                  </template>
                </v-text-field>
              </div>

              <div class="endereco-campos">
                <v-text-field
                  label="Número"
                  v-model="modelo.endereco.numero"
                  type="number"
                  variant="outlined"
                ></v-text-field>
                <v-text-field
                  class="margin-enderecos"
                  label="Lote"
                  type="number"
                  v-model="modelo.endereco.lote"
                  variant="outlined"
                ></v-text-field>
                <v-text-field
                  class="margin-enderecos"
                  v-mask="'#####-###'"
                  label="CEP"
                  v-model="modelo.endereco.cep"
                  variant="outlined"
                >
                  <template #label>
                    CEP
                    <span><strong>*</strong></span>
                  </template>
                </v-text-field>
              </div>

              <div class="endereco-campos">
                <v-combobox
                  label="Estado"
                  :items="estados"
                  item-title="nome"
                  item-value="id"
                  v-model="modelo.endereco.estado"
                  variant="outlined"
                  @update:model-value="
                    obterCidades($event);
                    modelo.endereco.municipio = null;
                  "
                >
                  <template #label>
                    Estado
                    <span><strong>*</strong></span>
                  </template>
                </v-combobox>

                <v-combobox
                  v-if="carregouCidades"
                  class="margin-enderecos"
                  label="Cidade"
                  :items="cidades"
                  item-title="nome"
                  item-value="id"
                  v-model="modelo.endereco.municipio"
                  variant="outlined"
                >
                  <template #label>
                    Cidade
                    <span><strong>*</strong></span>
                  </template>
                </v-combobox>
              </div>
              <v-text-field
                label="Complemento"
                v-model="modelo.endereco.complemento"
                variant="outlined"
              ></v-text-field>
            </div>
            <v-divider class="divisao-endereco"></v-divider>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script>
import comunicacaoDepositos from '@/services/depositos/comunicacao-deposito';
import comunicacaoEstados from '@/services/estados/comunicacao-estados';
import comunicacaoMunicipios from '@/services/municipios/comunicacao-municipios';
import { useDadosStore, useAlerta, useDadosDeOutraTela } from '@/store/index';
export default {
  name: 'DepositosEdicao',
  data() {
    return {
      carregouCidades: false,
      modelo: {
        descricao: '',
        endereco: {
          logradouro: '',
          bairro: '',
          numero: null,
          lote: null,
          cep: '',
          complemento: '',
          estado: null,
          municipio: null,
        },
      },
      estados: [],
      cidades: [],
    };
  },
  methods: {
    voltar() {
      if (
        useDadosDeOutraTela().ultimoElemento &&
        useDadosDeOutraTela().ultimoElemento.rotaOriginal !=
          'fornecedores-edicao'
      ) {
        if (this.modelo && this.modelo.id) {
          useDadosDeOutraTela().ultimoElemento.dadosOriginais.lancamentoProduto.localizacaoDeposito.deposito =
            this.modelo;
        }

        const dadosOutraTela = {
          dadosOriginais: useDadosDeOutraTela().ultimoElemento.dadosOriginais,
          rotaOriginal: useDadosDeOutraTela().ultimoElemento.rotaOriginal,
          rotaCriacao: useDadosDeOutraTela().ultimoElemento.rotaCriacao,
        };

        useDadosDeOutraTela().retirarDadosDeOutraTela();
        useDadosDeOutraTela().adicionarDadosDeOutraTela(dadosOutraTela);
        this.$router.push(useDadosDeOutraTela().ultimoElemento.rotaOriginal);
      } else {
        this.$router.push('/depositos');
      }
    },

    podeGravar() {
      if (!this.modelo.descricao) {
        useAlerta().exibirSnackbar('A descrição é obrigatória!', 'orange');
        return false;
      }

      if (!this.modelo.endereco) {
        useAlerta().exibirSnackbar(
          'O endereço do depósito é obrigatório!',
          'orange',
        );
        return false;
      }

      if (!this.modelo.endereco.logradouro) {
        useAlerta().exibirSnackbar('O logradouro é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.endereco.bairro) {
        useAlerta().exibirSnackbar('O bairro é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.endereco.cep) {
        useAlerta().exibirSnackbar('O CEP é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.endereco.estado) {
        useAlerta().exibirSnackbar('O estado é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.endereco.municipio) {
        useAlerta().exibirSnackbar('A cidade é obrigatória!', 'orange');
        return false;
      }

      return true;
    },

    async salvar() {
      if (!this.podeGravar()) {
        return;
      }

      if (this.dados && this.dados.ehTelaAtualizacao) {
        await comunicacaoDepositos
          .atualizar(this.dados.id, this.modelo)
          .then(() => {
            useAlerta().exibirSnackbar(
              'O depósito foi atualizado com sucesso!',
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
        await comunicacaoDepositos
          .criar(this.modelo)
          .then((resultado) => {
            useAlerta().exibirSnackbar(
              'O depósito foi criado com sucesso!',
              'green',
            );
            this.modelo = resultado.data;

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

    async obterDepositos() {
      await comunicacaoDepositos.obterPorId(this.dados.id).then((response) => {
        this.modelo = null;

        this.modelo = response.data;

        this.modelo.endereco.estado = this.modelo.endereco.municipio.uf;
        this.obterCidades(this.modelo.endereco.estado);
      });
    },

    async obterEstados(termo = '') {
      await comunicacaoEstados
        .obterParcialFiltro({
          termoDePesquisa: termo,
        })
        .then((response) => {
          this.estados = [];

          this.carregouCidades = false;

          setTimeout(() => {
            this.carregouCidades = true;
          });

          for (const dado of response.data) {
            this.estados.push(dado);
          }
        });
    },

    async obterCidades(estadoSelecionado) {
      if (estadoSelecionado) {
        await comunicacaoMunicipios
          .obterParcialFiltro({
            uf: estadoSelecionado.uf,
          })
          .then((response) => {
            this.cidades = [];

            for (const dado of response.data) {
              this.cidades.push(dado);
            }
          });
      }
    },
  },

  created() {
    this.obterEstados();

    if (this.dados && this.dados.ehTelaAtualizacao) {
      this.obterDepositos();
    }
  },
  computed: {
    dados() {
      return useDadosStore().getDadosParaEdicao;
    },
  },
};
</script>

<style scoped>
.endereco-campos {
  @media (min-width: 850px) {
    display: flex;
  }

  @media (max-width: 849px) {
    display: block;
  }
}

.margin-enderecos {
  @media (min-width: 850px) {
    margin-left: 15px;
  }

  @media (max-width: 849px) {
    margin-left: 0;
  }
}

.divisao-endereco {
  border-color: var(--primary-color);
  border-width: 1px;
  border-style: solid;
}
</style>
