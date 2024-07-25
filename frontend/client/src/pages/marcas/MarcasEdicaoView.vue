<template>
  <v-main class="fill-height">
    <v-card min-height="90vh" width="calc(100% - 100px)" style="margin: 0 auto">
      <v-toolbar flat>
        <v-toolbar-title class="text-grey">Marcas</v-toolbar-title>

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
          maxlength="100"
          variant="outlined"
        ></v-text-field>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script>
import comunicacaoMarcas from '@/services/marcas/comunicacao-marcas';
import { useDadosStore, useAlerta, useDadosDeOutraTela } from '@/store/index';
export default {
  name: 'MarcasEdicao',
  data() {
    return {
      modelo: {},
    };
  },
  methods: {
    voltar() {
      if (
        useDadosDeOutraTela().ultimoElemento &&
        useDadosDeOutraTela().ultimoElemento.rotaOriginal != 'marcas-edicao'
      ) {
        if (this.modelo && this.modelo.id) {
          useDadosDeOutraTela().ultimoElemento.dadosOriginais.marca =
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
        this.$router.push('/marcas');
      }
    },

    async salvar() {
      if (!this.modelo.descricao) {
        useAlerta().exibirSnackbar('A descrição é obrigatória!', 'orange');
        return;
      }

      if (this.dados && this.dados.ehTelaAtualizacao) {
        await comunicacaoMarcas
          .atualizar(this.dados.id, this.modelo)
          .then(() => {
            useAlerta().exibirSnackbar(
              'A marca foi atualizada com sucesso!',
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
        await comunicacaoMarcas
          .criar(this.modelo)
          .then((resultado) => {
            useAlerta().exibirSnackbar(
              'A marca foi criada com sucesso!',
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

    async obterMarcas() {
      await comunicacaoMarcas.obterPorId(this.dados.id).then((response) => {
        this.modelo = null;

        this.modelo = response.data;
      });
    },
  },
  created() {
    if (this.dados && this.dados.ehTelaAtualizacao) {
      this.obterMarcas();
    }
  },
  computed: {
    dados() {
      return useDadosStore().getDadosParaEdicao;
    },
  },
};
</script>
