<template>
  <v-main class="fill-height">
    <v-card min-height="90vh" width="calc(100% - 100px)" style="margin: 0 auto">
      <v-toolbar flat>
        <v-toolbar-title class="text-grey">Fornecedores</v-toolbar-title>

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

      <v-card-text class="container-dados">
        <v-text-field
          label="CNPJ"
          v-mask="'##.###.###/####-##'"
          v-model="modelo.cnpj"
          variant="outlined"
        ></v-text-field>

        <v-text-field
          label="Razão social"
          v-model="modelo.razaoSocial"
          variant="outlined"
        ></v-text-field>

        <v-text-field
          label="Telefone"
          v-mask="'(##) #####-####'"
          v-model="modelo.telefone"
          variant="outlined"
        ></v-text-field>

        <div>
          <div style="padding: 15px">
            <div class="titulo-container-endereco">Endereço</div>
            <v-divider class="divisao-endereco"></v-divider>

            <div style="padding: 15px">
              <div class="campos-endereco">
                <v-text-field
                  label="Logradouro"
                  v-model="modelo.endereco.logradouro"
                  variant="outlined"
                ></v-text-field>

                <v-text-field
                  class="campos-endereco-margin"
                  label="Bairro"
                  v-model="modelo.endereco.bairro"
                  variant="outlined"
                ></v-text-field>
              </div>

              <div class="campos-endereco">
                <v-text-field
                  label="Número"
                  v-model="modelo.endereco.numero"
                  type="number"
                  variant="outlined"
                ></v-text-field>

                <v-text-field
                  class="campos-endereco-margin"
                  label="Lote"
                  type="number"
                  v-model="modelo.endereco.lote"
                  variant="outlined"
                ></v-text-field>

                <v-text-field
                  class="campos-endereco-margin"
                  v-mask="'#####-###'"
                  label="CEP"
                  v-model="modelo.endereco.cep"
                  variant="outlined"
                ></v-text-field>
              </div>

              <div class="campos-endereco">
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
                ></v-combobox>

                <v-combobox
                  v-if="carregouCidades"
                  class="campos-endereco-margin"
                  label="Cidade"
                  :items="cidades"
                  item-title="nome"
                  item-value="id"
                  v-model="modelo.endereco.municipio"
                  variant="outlined"
                ></v-combobox>
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
import comunicacaoEstados from '@/services/estados/comunicacao-estados';
import comunicacaoFornecedores from '@/services/fornecedores/comunicacao-fornecedores';
import comunicacaoMunicipios from '@/services/municipios/comunicacao-municipios';
import { useDadosStore, useAlerta, useDadosDeOutraTela } from '@/store/index';

export default {
  name: 'FornecedoresEdicao',
  data() {
    return {
      modelo: {
        endereco: {},
      },
      estados: [],
      cidades: [],
    };
  },
  methods: {
    podeGravar() {
      if (!this.modelo.cnpj) {
        useAlerta().exibirSnackbar('O CNPJ é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.razaoSocial) {
        useAlerta().exibirSnackbar('A razão social é obrigatória!', 'orange');
        return false;
      }

      if (!this.modelo.telefone) {
        useAlerta().exibirSnackbar('O telefone é obrigatório!', 'orange');
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

      if (this.modelo.endereco.numero && this.modelo.endereco.numero < 1) {
        useAlerta().exibirSnackbar('Número de endereço inválido!', 'orange');
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

    voltar() {
      if (
        useDadosDeOutraTela().ultimoElemento &&
        useDadosDeOutraTela().ultimoElemento.rotaOriginal !=
          'fornecedores-edicao'
      ) {
        if (this.modelo && this.modelo.id) {
          useDadosDeOutraTela().ultimoElemento.dadosOriginais.lancamentoProduto.fornecedor =
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
        this.$router.push('/fornecedores');
      }
    },

    async salvar() {
      if (!this.podeGravar()) {
        return;
      }

      if (this.dados && this.dados.ehTelaAtualizacao) {
        await comunicacaoFornecedores
          .atualizar(this.dados.id, this.modelo)
          .then(() => {
            useAlerta().exibirSnackbar(
              'O fornecedor foi atualizado com sucesso!',
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
        await comunicacaoFornecedores
          .criar(this.modelo)
          .then((resultado) => {
            useAlerta().exibirSnackbar(
              'O fornecedor foi criado com sucesso!',
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

    async obterFornecedores() {
      await comunicacaoFornecedores
        .obterPorId(this.dados.id)
        .then((response) => {
          this.modelo = null;

          this.modelo = response.data;

          this.modelo.endereco.estado = this.modelo.endereco.municipio.uf;

          this.obterCidades(this.modelo.endereco.estado);
        });
    },
  },
  created() {
    this.obterEstados();
    if (this.dados && this.dados.ehTelaAtualizacao) {
      this.obterFornecedores();
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
.container-dados {
  max-height: 80vh;
  overflow: auto;
}

.container-endereco {
  border-radius: 15px;
  border-style: solid;
  border-width: 2px;
  border-color: var(--primary-color);
  max-height: 450px;
  margin-bottom: 15px;
  overflow: auto;
}

.titulo-container-endereco {
  text-align: left;
  color: var(--primary-color);
  font-size: large;
}

.campos-endereco {
  @media (min-width: 850px) {
    display: flex;
  }

  @media (max-width: 849px) {
    display: block;
  }
}

.campos-endereco-margin {
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
