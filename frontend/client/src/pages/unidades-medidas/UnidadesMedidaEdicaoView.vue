<template>
  <v-main class="fill-height">
    <v-card min-height="90vh" width="calc(100% - 100px)" style="margin: 0 auto">
      <v-toolbar flat>
        <v-toolbar-title class="text-grey">Unidades de medida</v-toolbar-title>

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
          label="Sigla"
          v-model="modelo.sigla"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          label="Descrição"
          v-model="modelo.descricao"
          variant="outlined"
        ></v-text-field>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script>
import comunicacaoUnidadesMedidas from '@/services/unidades-medidas/comunicacao-unidade-medidas';
import { useDadosStore, useAlerta, useDadosDeOutraTela } from '@/store/index';

export default {
  name: 'UnidadesMedidasEdicao',
  data() {
    return {
      modelo: {},
    };
  },
  methods: {
    voltar() {
      if (this.dadosOutraTela && this.dadosOutraTela.indoParaCriacao) {
        if (this.modelo && this.modelo.id) {
          this.dadosOutraTela.dadosOriginais.unidadeMedida = this.modelo;
        }

        const dadosOutraTela = {
          dadosOriginais: this.dadosOutraTela.dadosOriginais,
          rotaOriginal: this.dadosOutraTela.rotaOriginal,
          rotaCriacao: this.dadosOutraTela.rotaCriacao,
          indoParaCriacao: false,
        };

        useDadosDeOutraTela().salvarDadosDeOutraTela(dadosOutraTela);
        this.$router.push(this.dadosOutraTela.rotaOriginal);
      } else {
        this.$router.push('/unidadesMedida');
      }
    },

    async salvar() {
      if (!this.modelo.sigla) {
        useAlerta().exibirSnackbar('A sigla é obrigatória!', 'orange');
        return;
      }

      if (this.modelo.sigla && this.modelo.sigla.length > 4) {
        useAlerta().exibirSnackbar(
          'A sigla pode ter no máximo 4 caracteres!',
          'orange',
        );
        return;
      }

      if (!this.modelo.descricao) {
        useAlerta().exibirSnackbar('A descrição é obrigatória!', 'orange');
        return;
      }

      if (this.dados && this.dados.ehTelaAtualizacao) {
        await comunicacaoUnidadesMedidas
          .atualizar(this.dados.id, this.modelo)
          .then(() => {
            useAlerta().exibirSnackbar(
              'A unidade de medida atualizada com sucesso!',
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
        await comunicacaoUnidadesMedidas
          .criar(this.modelo)
          .then((resultado) => {
            useAlerta().exibirSnackbar(
              'A unidade de medida foi criada com sucesso!',
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

    async obterUnidadesMedida() {
      await comunicacaoUnidadesMedidas
        .obterPorId(this.dados.id)
        .then((response) => {
          this.modelo = null;

          this.modelo = response.data;
        });
    },
  },
  created() {
    if (this.dados && this.dados.ehTelaAtualizacao) {
      this.obterUnidadesMedida();
    }
  },
  computed: {
    dados() {
      return useDadosStore().getDadosParaEdicao;
    },

    dadosOutraTela() {
      return useDadosDeOutraTela().getDadosDeOutraTela;
    },
  },
};
</script>
