<template>
  <v-main class="fill-height">
    <v-card min-height="90vh" width="calc(100% - 100px)" style="margin: 0 auto">
      <v-toolbar flat>
        <v-toolbar-title class="text-grey">Categorias</v-toolbar-title>

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
        ></v-text-field>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script>
import comunicacaoCategorias from '@/services/categorias/comunicacao-categorias';
import { useDadosStore, useAlerta, useDadosDeOutraTela } from '@/store/index';
export default {
  name: 'CategoriaEdicao',
  data() {
    return {
      modelo: {},
    };
  },
  methods: {
    voltar() {
      if (
        useDadosDeOutraTela().ultimoElemento &&
        useDadosDeOutraTela().ultimoElemento.rotaOriginal != 'categorias-edicao'
      ) {
        if (this.modelo && this.modelo.id) {
          useDadosDeOutraTela().ultimoElemento.dadosOriginais.categoria =
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
        this.$router.push('/categorias');
      }
    },

    async salvar() {
      if (!this.modelo.descricao) {
        useAlerta().exibirSnackbar('A descrição é obrigatória!', 'orange');
        return;
      }

      if (this.dados && this.dados.ehTelaAtualizacao) {
        await comunicacaoCategorias
          .atualizar(this.dados.id, this.modelo)
          .then(() => {
            useAlerta().exibirSnackbar(
              'A categoria foi atualizada com sucesso!',
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
        await comunicacaoCategorias
          .criar(this.modelo)
          .then((resultado) => {
            useAlerta().exibirSnackbar(
              'A categoria foi criada com sucesso!',
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

    async obterCategoria() {
      await comunicacaoCategorias.obterPorId(this.dados.id).then((response) => {
        this.modelo = null;

        this.modelo = response.data;
      });
    },
  },
  created() {
    if (this.dados && this.dados.ehTelaAtualizacao) {
      this.obterCategoria();
    }
  },
  computed: {
    dados() {
      return useDadosStore().getDadosParaEdicao;
    },
  },
};
</script>
