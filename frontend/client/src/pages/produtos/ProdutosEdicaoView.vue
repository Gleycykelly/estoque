<template>
  <v-main class="fill-height">
    <v-card min-height="90vh" width="calc(100% - 100px)" style="margin: 0 auto">
      <v-toolbar flat>
        <v-toolbar-title class="text-grey">Produtos</v-toolbar-title>

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

      <v-card-text style="margin-bottom: 30px">
        <v-tabs
          v-model="tab"
          align-tabs="center"
          color="var(--primary-color)"
          style="margin-bottom: 25px"
        >
          <v-tab :value="1">Dados do produto</v-tab>
          <v-tab :value="2">Informações nutricionais</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item :key="1" :value="1" style="padding: 5px">
            <v-text-field
              label="Código do produto"
              maxlength="60"
              v-model="modelo.codigoProduto"
              variant="outlined"
            >
              <template #label>
                Código do produto
                <span><strong>*</strong></span>
              </template>
            </v-text-field>

            <v-text-field
              label="Nome"
              maxlength="100"
              v-model="modelo.nome"
              variant="outlined"
            >
              <template #label>
                Nome
                <span><strong>*</strong></span>
              </template>
            </v-text-field>

            <v-text-field
              label="Descrição"
              v-model="modelo.descricao"
              maxlength="250"
              variant="outlined"
            ></v-text-field>

            <v-combobox
              label="Categorias"
              :items="categorias"
              item-title="descricao"
              item-value="id"
              v-model="modelo.categoria"
              variant="outlined"
              append-icon="mdi-plus-circle-outline"
              @click:append="adicionarCategoria"
            >
              <template #label>
                Categorias
                <span><strong>*</strong></span>
              </template>
            </v-combobox>

            <v-combobox
              label="Unidade de medida"
              :items="unidadesDeMedida"
              item-title="descricao"
              item-value="id"
              v-model="modelo.unidadeMedida"
              variant="outlined"
              append-icon="mdi-plus-circle-outline"
              @click:append="adicionarUnidadeMedida"
            >
              <template #label>
                Unidade de medida
                <span><strong>*</strong></span>
              </template>
            </v-combobox>

            <v-combobox
              label="Marcas"
              :items="marcas"
              item-title="descricao"
              item-value="id"
              v-model="modelo.marca"
              variant="outlined"
              append-icon="mdi-plus-circle-outline"
              @click:append="adicionarMarca"
            >
              <template #label>
                Marca
                <span><strong>*</strong></span>
              </template>
            </v-combobox>
          </v-tabs-window-item>

          <v-tabs-window-item :key="2" :value="2" style="padding: 5px">
            <div class="text-start">
              <v-card-title>
                <v-dialog class="container-informacoes" v-model="dialog">
                  <template #activator="{ props }">
                    <v-btn
                      class="botao-informacao-nutricional"
                      prepend-icon="mdi-plus"
                      v-bind="props"
                      variant="tonal"
                    >
                      Adicionar
                    </v-btn>
                  </template>
                  <div class="modal-nutricional">
                    <v-card
                      class="text-center informacoes-nutricionais"
                      title="Informaçao nutricional"
                    >
                      <v-card-text>
                        <v-text-field
                          label=" Porção"
                          v-model="novaPorcao.porcao"
                          variant="outlined"
                          type="number"
                        >
                          <template #label>
                            Porção
                            <span><strong>*</strong></span>
                          </template>
                        </v-text-field>

                        <v-text-field
                          label="Alergênicos"
                          maxlength="250"
                          v-model="novaPorcao.informacaoNutricional.alergenicos"
                          variant="outlined"
                        ></v-text-field>

                        <v-text-field
                          label="Ingredientes"
                          maxlength="250"
                          v-model="
                            novaPorcao.informacaoNutricional.ingredientes
                          "
                          variant="outlined"
                        ></v-text-field>

                        <v-combobox
                          label="Unidade de medida"
                          :items="unidadesDeMedida"
                          item-title="descricao"
                          item-value="id"
                          v-model="novaPorcao.unidadeMedida"
                          variant="outlined"
                        >
                          <template #label>
                            Unidade de medida
                            <span><strong>*</strong></span>
                          </template>
                        </v-combobox>

                        <div class="valores-nutricionais">
                          <div>
                            <div class="titulo-valores-nutricionais">
                              Valores nutricionais
                            </div>

                            <div>
                              <div class="valores-nutricionais-campos">
                                <v-text-field
                                  type="number"
                                  v-model="
                                    novaPorcao.valorNutricional.valorEnergetico
                                  "
                                  label="Valor energético"
                                  @input="
                                    !novaPorcao.valorNutricional.valorEnergetico
                                      ? (novaPorcao.valorNutricional.valorEnergetico =
                                          null)
                                      : novaPorcao.valorNutricional
                                          .valorEnergetico
                                  "
                                  variant="outlined"
                                ></v-text-field>

                                <v-text-field
                                  type="number"
                                  class="margin-para-valores-nutricionais"
                                  label="Carboidratos"
                                  v-model="
                                    novaPorcao.valorNutricional.carboidratos
                                  "
                                  @input="
                                    !novaPorcao.valorNutricional.carboidratos
                                      ? (novaPorcao.valorNutricional.carboidratos =
                                          null)
                                      : novaPorcao.valorNutricional.carboidratos
                                  "
                                  variant="outlined"
                                ></v-text-field>

                                <v-text-field
                                  type="number"
                                  class="margin-para-valores-nutricionais"
                                  label="Açucares totais"
                                  v-model="
                                    novaPorcao.valorNutricional.acucaresTotais
                                  "
                                  @input="
                                    !novaPorcao.valorNutricional.acucaresTotais
                                      ? (novaPorcao.valorNutricional.acucaresTotais =
                                          null)
                                      : novaPorcao.valorNutricional
                                          .acucaresTotais
                                  "
                                  variant="outlined"
                                ></v-text-field>

                                <v-text-field
                                  type="number"
                                  class="margin-para-valores-nutricionais"
                                  label="Açucares adicionados"
                                  v-model="
                                    novaPorcao.valorNutricional
                                      .acucaresAdicionados
                                  "
                                  @input="
                                    !novaPorcao.valorNutricional
                                      .acucaresAdicionados
                                      ? (novaPorcao.valorNutricional.acucaresAdicionados =
                                          null)
                                      : novaPorcao.valorNutricional
                                          .acucaresAdicionados
                                  "
                                  variant="outlined"
                                ></v-text-field>

                                <v-text-field
                                  type="number"
                                  class="margin-para-valores-nutricionais"
                                  label="Proteínas"
                                  v-model="
                                    novaPorcao.valorNutricional.proteinas
                                  "
                                  variant="outlined"
                                  @input="
                                    !novaPorcao.valorNutricional.proteinas
                                      ? (novaPorcao.valorNutricional.proteinas =
                                          null)
                                      : novaPorcao.valorNutricional.proteinas
                                  "
                                ></v-text-field>
                              </div>

                              <div class="valores-nutricionais-campos">
                                <v-text-field
                                  type="number"
                                  label="Gorduras totais"
                                  v-model="
                                    novaPorcao.valorNutricional.gordurasTotais
                                  "
                                  @input="
                                    !novaPorcao.valorNutricional.gordurasTotais
                                      ? (novaPorcao.valorNutricional.gordurasTotais =
                                          null)
                                      : novaPorcao.valorNutricional
                                          .gordurasTotais
                                  "
                                  variant="outlined"
                                ></v-text-field>

                                <v-text-field
                                  type="number"
                                  class="margin-para-valores-nutricionais"
                                  label="Gorduras saturadas"
                                  v-model="
                                    novaPorcao.valorNutricional
                                      .gordurasSaturadas
                                  "
                                  @input="
                                    !novaPorcao.valorNutricional
                                      .gordurasSaturadas
                                      ? (novaPorcao.valorNutricional.gordurasSaturadas =
                                          null)
                                      : novaPorcao.valorNutricional
                                          .gordurasSaturadas
                                  "
                                  variant="outlined"
                                ></v-text-field>

                                <v-text-field
                                  type="number"
                                  class="margin-para-valores-nutricionais"
                                  label="Gorduras trans"
                                  v-model="
                                    novaPorcao.valorNutricional.gordurasTrans
                                  "
                                  @input="
                                    !novaPorcao.valorNutricional.gordurasTrans
                                      ? (novaPorcao.valorNutricional.gordurasTrans =
                                          null)
                                      : novaPorcao.valorNutricional
                                          .gordurasTrans
                                  "
                                  variant="outlined"
                                ></v-text-field>

                                <v-text-field
                                  type="number"
                                  class="margin-para-valores-nutricionais"
                                  label="Fibras alimentares"
                                  v-model="
                                    novaPorcao.valorNutricional
                                      .fibrasAlimentares
                                  "
                                  @input="
                                    !novaPorcao.valorNutricional
                                      .fibrasAlimentares
                                      ? (novaPorcao.valorNutricional.fibrasAlimentares =
                                          null)
                                      : novaPorcao.valorNutricional
                                          .fibrasAlimentares
                                  "
                                  variant="outlined"
                                ></v-text-field>

                                <v-text-field
                                  type="number"
                                  class="margin-para-valores-nutricionais"
                                  label="Sódio"
                                  v-model="novaPorcao.valorNutricional.sodio"
                                  @input="
                                    !novaPorcao.valorNutricional.sodio
                                      ? (novaPorcao.valorNutricional.sodio =
                                          null)
                                      : novaPorcao.valorNutricional.sodio
                                  "
                                  variant="outlined"
                                ></v-text-field>
                              </div>
                            </div>
                          </div>
                        </div>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                          text="voltar"
                          variant="plain"
                          @click="sairDoModalDeInformacoesNutricionais()"
                        ></v-btn>

                        <v-btn
                          color="var(--primary-color)"
                          text="Adicionar"
                          variant="tonal"
                          @click="adicionarNovaInformacaoNutricional()"
                        ></v-btn>
                      </v-card-actions>
                    </v-card>
                  </div>
                </v-dialog>
              </v-card-title>
            </div>

            <div
              v-if="modelo.porcoes && modelo.porcoes.length > 0"
              style="overflow: auto; max-height: 70vh"
            >
              <div
                style="padding: 15px; overflow: auto"
                v-for="(porcao, index) in modelo.porcoes"
                :key="index.porcao"
              >
                <div class="container-titulo-porcao">
                  <div class="titulo-porcoes">Porção {{ index + 1 }}</div>
                  <v-icon @click="excluirPorcao(porcao)" class="excluir-procao">
                    mdi-trash-can-outline
                  </v-icon>
                </div>

                <v-text-field
                  label=" Porção"
                  v-model="porcao.porcao"
                  variant="outlined"
                  type="number"
                >
                  <template #label>
                    Porção
                    <span><strong>*</strong></span>
                  </template>
                </v-text-field>

                <v-text-field
                  label="Alergênicos"
                  v-model="porcao.informacaoNutricional.alergenicos"
                  maxlength="250"
                  variant="outlined"
                ></v-text-field>

                <v-text-field
                  label="Ingredientes"
                  v-model="porcao.informacaoNutricional.ingredientes"
                  maxlength="250"
                  variant="outlined"
                ></v-text-field>

                <v-combobox
                  label="Unidade de medida"
                  :items="unidadesDeMedida"
                  item-title="descricao"
                  item-value="id"
                  v-model="porcao.unidadeMedida"
                  variant="outlined"
                >
                  <template #label>
                    Unidade de medida
                    <span><strong>*</strong></span>
                  </template>
                </v-combobox>

                <div class="valores-nutricionais">
                  <div style="padding: 15px">
                    <div class="titulo-valores-nutricionais">
                      Valores nutricionais
                    </div>

                    <div class="valores-nutricionais-campos">
                      <v-text-field
                        type="number"
                        label="Valor energético"
                        v-model="porcao.valorNutricional.valorEnergetico"
                        @input="
                          !porcao.valorNutricional.valorEnergetico
                            ? (porcao.valorNutricional.valorEnergetico = null)
                            : porcao.valorNutricional.valorEnergetico
                        "
                        variant="outlined"
                      ></v-text-field>

                      <v-text-field
                        type="number"
                        class="margin-para-valores-nutricionais"
                        label="Carboidratos"
                        v-model="porcao.valorNutricional.carboidratos"
                        @input="
                          !porcao.valorNutricional.carboidratos
                            ? (porcao.valorNutricional.carboidratos = null)
                            : porcao.valorNutricional.carboidratos
                        "
                        variant="outlined"
                      ></v-text-field>

                      <v-text-field
                        type="number"
                        class="margin-para-valores-nutricionais"
                        label="Açucares totais"
                        v-model="porcao.valorNutricional.acucaresTotais"
                        @input="
                          !porcao.valorNutricional.acucaresTotais
                            ? (porcao.valorNutricional.acucaresTotais = null)
                            : porcao.valorNutricional.acucaresTotais
                        "
                        variant="outlined"
                      ></v-text-field>

                      <v-text-field
                        type="number"
                        class="margin-para-valores-nutricionais"
                        label="Açucares adicionados"
                        v-model="porcao.valorNutricional.acucaresAdicionados"
                        @input="
                          !porcao.valorNutricional.acucaresAdicionados
                            ? (porcao.valorNutricional.acucaresAdicionados =
                                null)
                            : porcao.valorNutricional.acucaresAdicionados
                        "
                        variant="outlined"
                      ></v-text-field>

                      <v-text-field
                        type="number"
                        class="margin-para-valores-nutricionais"
                        label="Proteínas"
                        v-model="porcao.valorNutricional.proteinas"
                        variant="outlined"
                        @input="
                          !porcao.valorNutricional.proteinas
                            ? (porcao.valorNutricional.proteinas = null)
                            : porcao.valorNutricional.proteinas
                        "
                      ></v-text-field>
                    </div>

                    <div class="valores-nutricionais-campos">
                      <v-text-field
                        type="number"
                        label="Gorduras totais"
                        v-model="porcao.valorNutricional.gordurasTotais"
                        @input="
                          !porcao.valorNutricional.gordurasTotais
                            ? (porcao.valorNutricional.gordurasTotais = null)
                            : porcao.valorNutricional.gordurasTotais
                        "
                        variant="outlined"
                      ></v-text-field>

                      <v-text-field
                        type="number"
                        class="margin-para-valores-nutricionais"
                        label="Gorduras saturadas"
                        v-model="porcao.valorNutricional.gordurasSaturadas"
                        @input="
                          !porcao.valorNutricional.gordurasSaturadas
                            ? (porcao.valorNutricional.gordurasSaturadas = null)
                            : porcao.valorNutricional.gordurasSaturadas
                        "
                        variant="outlined"
                      ></v-text-field>

                      <v-text-field
                        type="number"
                        class="margin-para-valores-nutricionais"
                        label="Gorduras trans"
                        v-model="porcao.valorNutricional.gordurasTrans"
                        @input="
                          !porcao.valorNutricional.gordurasTrans
                            ? (porcao.valorNutricional.gordurasTrans = null)
                            : porcao.valorNutricional.gordurasTrans
                        "
                        variant="outlined"
                      ></v-text-field>

                      <v-text-field
                        type="number"
                        class="margin-para-valores-nutricionais"
                        label="Fibras alimentares"
                        v-model="porcao.valorNutricional.fibrasAlimentares"
                        @input="
                          !porcao.valorNutricional.fibrasAlimentares
                            ? (porcao.valorNutricional.fibrasAlimentares = null)
                            : porcao.valorNutricional.fibrasAlimentares
                        "
                        variant="outlined"
                      ></v-text-field>

                      <v-text-field
                        type="number"
                        class="margin-para-valores-nutricionais"
                        label="Sódio"
                        clearable
                        v-model="porcao.valorNutricional.sodio"
                        @input="
                          !porcao.valorNutricional.sodio
                            ? (porcao.valorNutricional.sodio = null)
                            : porcao.valorNutricional.sodio
                        "
                        variant="outlined"
                      ></v-text-field>
                    </div>
                  </div>
                </div>

                <v-divider class="divisao-informacoes-nutricionais"></v-divider>
              </div>
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script>
import comunicacaoCategorias from '@/services/categorias/comunicacao-categorias';
import comunicacaoMarcas from '@/services/marcas/comunicacao-marcas';
import comunicacaoPorcoes from '@/services/porcoes/comunicacao-porcoes';
import comunicacaoProdutos from '@/services/produtos/comunicacao-produtos';
import comunicacaoUnidadesMedidas from '@/services/unidades-medidas/comunicacao-unidade-medidas';
import { useDadosStore, useAlerta, useDadosDeOutraTela } from '@/store/index';

export default {
  name: 'ProdutosEdicao',
  data() {
    return {
      dialog: false,
      modelo: {
        porcoes: [],
      },
      categorias: [],
      unidadesDeMedida: [],
      marcas: [],
      tab: 0,
      novaPorcao: {
        informacaoNutricional: {},
        valorNutricional: {},
        produto: {},
      },
    };
  },
  methods: {
    voltar() {
      if (
        useDadosDeOutraTela().ultimoElemento &&
        useDadosDeOutraTela().ultimoElemento.rotaOriginal != 'produtos-edicao'
      ) {
        if (this.modelo.codigoProduto) {
          useDadosDeOutraTela().ultimoElemento.dadosOriginais.lancamentoProduto.produto =
            this.modelo;
        }

        const dadosOutraTela = {
          dadosOriginais: useDadosDeOutraTela().ultimoElemento.dadosOriginais,
          rotaOriginal: useDadosDeOutraTela().ultimoElemento.rotaOriginal,
          rotaCriacao: useDadosDeOutraTela().ultimoElemento.rotaCriacao,
        };

        useDadosDeOutraTela().adicionarDadosDeOutraTela(dadosOutraTela);
        this.$router.push(useDadosDeOutraTela().ultimoElemento.rotaOriginal);
      } else {
        this.$router.push('/produtos');
      }
    },

    podeGravar() {
      if (!this.modelo.codigoProduto) {
        useAlerta().exibirSnackbar(
          'O código do produto é obrigatório!',
          'orange',
        );
        return false;
      }

      if (!this.modelo.nome) {
        useAlerta().exibirSnackbar(
          'O nome do produto é obrigatório!',
          'orange',
        );
        return false;
      }

      if (!this.modelo.categoria) {
        useAlerta().exibirSnackbar('A categoria é obrigatória!', 'orange');
        return false;
      }

      if (!this.modelo.unidadeMedida) {
        useAlerta().exibirSnackbar(
          'A unidade de medida é obrigatória!',
          'orange',
        );
        return false;
      }

      if (this.modelo.porcoes != null && this.modelo.porcoes.length > 0) {
        let indicePorcoes = 0;
        for (const porcao of this.modelo.porcoes) {
          indicePorcoes++;
          if (!porcao.porcao) {
            useAlerta().exibirSnackbar(
              `É obrigatório informar a porção. Verifique a porção ${indicePorcoes} `,
              'orange',
            );
            return false;
          }

          if (!porcao.unidadeMedida) {
            useAlerta().exibirSnackbar(
              `É obrigatório informar a unidade de medida. Verifique a porção ${indicePorcoes} `,
              'orange',
            );
            return false;
          }

          if (porcao.porcao && porcao.porcao < 0) {
            useAlerta().exibirSnackbar(
              `O valor da porção deve ser maior que zero. Verifique a porção ${indicePorcoes} `,
              'orange',
            );
            return false;
          }

          if (!porcao.valorNutricional) {
            useAlerta().exibirSnackbar(
              `Informe pelo menos um valor para a tabela de valores nutricionais. Verifique a porção ${indicePorcoes} `,
              'orange',
            );
            return false;
          }

          if (
            porcao.valorNutricional &&
            (porcao.valorNutricional.valorEnergetico < 0 ||
              porcao.valorNutricional.carboidratos < 0 ||
              porcao.valorNutricional.acucaresTotais < 0 ||
              porcao.valorNutricional.acucaresAdicionados < 0 ||
              porcao.valorNutricional.proteinas < 0 ||
              porcao.valorNutricional.gordurasTotais < 0 ||
              porcao.valorNutricional.gordurasSaturadas < 0 ||
              porcao.valorNutricional.gordurasTrans < 0 ||
              porcao.valorNutricional.fibrasAlimentares < 0 ||
              porcao.valorNutricional.sodio < 0)
          ) {
            useAlerta().exibirSnackbar(
              `Valor nutricional preenchido incorretamente. Verifique a porção ${indicePorcoes} `,
              'orange',
            );
            return false;
          }

          if (!porcao.informacaoNutricional) {
            useAlerta().exibirSnackbar(
              `Informe os dados de ingredientes e/ou alergênicos. Verifique a porção ${indicePorcoes} `,
              'orange',
            );
            return false;
          }
        }
      }

      return true;
    },

    async salvar() {
      if (!this.podeGravar()) {
        return;
      }

      if (this.dados && this.dados.ehTelaAtualizacao) {
        await comunicacaoProdutos
          .atualizar(this.dados.id, this.modelo)
          .then(() => {
            useAlerta().exibirSnackbar(
              'O produto foi atualizado com sucesso!',
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
        await comunicacaoProdutos
          .criar(this.modelo)
          .then((resultado) => {
            useAlerta().exibirSnackbar(
              'O produto foi criado com sucesso!',
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

    async obterProdutos() {
      await comunicacaoProdutos.obterPorId(this.dados.id).then((response) => {
        this.modelo = null;

        this.modelo = response.data;
      });
    },

    async obterCategorias() {
      await comunicacaoCategorias.obterTodos().then((response) => {
        this.categorias = [];

        this.categorias = response.data;
      });
    },

    async obterUnidadesMedidas() {
      await comunicacaoUnidadesMedidas.obterTodos().then((response) => {
        this.unidadesDeMedida = [];

        this.unidadesDeMedida = response.data;
      });
    },

    async obterMarcas() {
      await comunicacaoMarcas.obterTodos(0).then((response) => {
        this.marcas = [];

        this.marcas = response.data;
      });
    },

    adicionarCategoria() {
      if (this.dados && this.dados.ehTelaAtualizacao) {
        useAlerta().exibirSnackbar(
          'No momento esta funcionalidade só está funcionando ao criar um novo elemento, novas atualizações serão implementadas. Aguarde!',
          'orange',
        );
        return;
      }
      const dadosOutraTela = {
        dadosOriginais: this.modelo,
        rotaOriginal: 'produtos-edicao',
        rotaCriacao: 'categorias-edicao',
      };
      useDadosDeOutraTela().adicionarDadosDeOutraTela(dadosOutraTela);

      this.$router.push('categorias-edicao');
    },

    adicionarUnidadeMedida() {
      if (this.dados && this.dados.ehTelaAtualizacao) {
        useAlerta().exibirSnackbar(
          'No momento esta funcionalidade só está funcionando ao criar um novo elemento, novas atualizações serão implementadas. Aguarde!',
          'orange',
        );
        return;
      }
      const dadosOutraTela = {
        dadosOriginais: this.modelo,
        rotaOriginal: 'produtos-edicao',
        rotaCriacao: 'unidades-medida-edicao',
      };
      useDadosDeOutraTela().adicionarDadosDeOutraTela(dadosOutraTela);

      this.$router.push('unidades-medida-edicao');
    },

    adicionarMarca() {
      if (this.dados && this.dados.ehTelaAtualizacao) {
        useAlerta().exibirSnackbar(
          'No momento esta funcionalidade só está funcionando ao criar um novo elemento, novas atualizações serão implementadas. Aguarde!',
          'orange',
        );
        return;
      }
      const dadosOutraTela = {
        dadosOriginais: this.modelo,
        rotaOriginal: 'produtos-edicao',
        rotaCriacao: 'marcas-edicao',
      };
      useDadosDeOutraTela().adicionarDadosDeOutraTela(dadosOutraTela);

      this.$router.push('marcas-edicao');
    },

    adicionarNovaInformacaoNutricional() {
      this.dialog = false;
      this.novaPorcao.produto = {
        id: this.modelo.id,
      };
      this.modelo.porcoes.push(this.novaPorcao);
      this.limparNovaPorcao();
    },

    sairDoModalDeInformacoesNutricionais() {
      this.dialog = false;
      this.limparNovaPorcao();
    },

    limparNovaPorcao() {
      this.novaPorcao = {
        informacaoNutricional: {},
        valorNutricional: {},
      };
    },

    async excluirPorcao(porcao) {
      if (porcao.id) {
        await comunicacaoPorcoes
          .excluir(porcao.id)
          .then(() => {
            useAlerta().exibirSnackbar('Porção excluída com sucesso!', 'green');

            this.modelo.porcoes = this.modelo.porcoes.filter(
              (p) => p.id != porcao.id,
            );
          })
          .catch((error) => {
            if (error.response && error.response.data) {
              useAlerta().exibirSnackbar(error.response.data.message, 'red');
            } else {
              useAlerta().exibirSnackbar(error.message, 'red');
            }
          });
      } else {
        this.modelo.porcoes = this.modelo.porcoes.filter(
          (p) => p.porcao != porcao.porcao,
        );
      }
    },
  },
  created() {
    this.obterCategorias();
    this.obterUnidadesMedidas();
    this.obterMarcas();

    if (this.dados && this.dados.ehTelaAtualizacao) {
      this.obterProdutos();
    }

    if (
      useDadosDeOutraTela().ultimoElemento &&
      useDadosDeOutraTela().ultimoElemento.rotaOriginal == 'produtos-edicao'
    ) {
      this.modelo = useDadosDeOutraTela().ultimoElemento.dadosOriginais;
      useDadosDeOutraTela().retirarDadosDeOutraTela();
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
.botao-informacao-nutricional {
  background-color: var(--primary-color) !important;
  color: white !important;
  font-weight: 900 !important;
  font-family: 'Roboto', sans-serif;
}

.informacoes-nutricionais {
  overflow: auto;
  @media (min-width: 850px) {
    width: 800px !important;
  }
  @media (max-width: 849px) {
    width: 100% !important;
  }
}

.container-titulo-porcao {
  color: var(--primary-color);
  display: flex;
  margin-bottom: 15px;
  font-size: large;
  justify-content: space-between;
}

.excluir-procao {
  cursor: pointer;
}

.valores-nutricionais {
  border-radius: 15px;
  border-style: solid;
  border-width: 2px;
  border-color: var(--primary-color);
  max-height: 250px;
  padding: 15px;
  overflow: auto;
}

.titulo-valores-nutricionais {
  text-align: left;
  color: var(--primary-color);
  font-size: large;
  margin-bottom: 15px;
}

.valores-nutricionais-campos {
  @media (min-width: 850px) {
    display: flex;
  }

  @media (max-width: 849px) {
    display: block;
  }
}

.margin-para-valores-nutricionais {
  @media (min-width: 850px) {
    margin-left: 15px;
  }

  @media (max-width: 849px) {
    margin-left: 0;
  }
}

.divisao-informacoes-nutricionais {
  border-color: var(--primary-color);
  border-width: 1px;
  border-style: dashed;
  margin-top: 15px;
}

.modal-nutricional {
  overflow: auto !important;
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
