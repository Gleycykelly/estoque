<template>
  <v-main class="fill-height" style="background-color: #f2f2f2; height: 100%">
    <v-card>
      <v-toolbar class="titulos" color="#AA00FF" flat dark>
        <v-toolbar-title style="text-align: start">
          <div style="margin-left: 30px">
            <div class="titulo-pagina">Dashboard</div>

            <div class="subtitulo-pagina">
              Olá, Fulano. Bem vindo(a) de volta!
            </div>
          </div>
        </v-toolbar-title>
      </v-toolbar>
    </v-card>
    <div style="padding: 25px">
      <v-row class="container-valor-total">
        <v-col cols="12" md="3" sm="12">
          <v-card class="valor-total">
            <v-card-text>
              <div class="card-valor-total">
                <div class="titulo-valor-total">
                  R$ {{ this.modelo.totalEntrada }}
                </div>
                <div class="texto-valor-total">Total de entradas</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="3" sm="12">
          <v-card class="valor-total">
            <v-card-text>
              <div class="card-valor-total">
                <div class="titulo-valor-total">
                  R$ {{ this.modelo.totalSaida }}
                </div>
                <div class="texto-valor-total">Total de saídas</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="3" sm="12">
          <v-card class="valor-total">
            <v-card-text>
              <div class="card-valor-total">
                <div class="titulo-valor-total">
                  {{ modelo.totalProdutos }}
                </div>
                <div class="texto-valor-total">Total produtos</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="3" sm="12">
          <v-card class="valor-total">
            <v-card-text>
              <div class="card-valor-total">
                <div class="titulo-valor-total">
                  {{ modelo.depositos }}
                </div>
                <div class="texto-valor-total">Total depósitos</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6" sm="12">
          <div class="produtos-proximo-vencimento">
            <h2 style="color: #bdbdbd; font-size: 18px">
              Produtos próximo do vencimento
            </h2>
            <v-data-table-virtual
              v-if="produtosVencimento && produtosVencimento.length > 0"
              class="custom-header"
              :headers="colunas"
              :items="produtosVencimento"
              item-value="nome"
              height="400"
              @load="load"
              :loading="loading"
              fixed-header
            ></v-data-table-virtual>
            <v-empty-state
              v-if="!produtosVencimento || produtosVencimento.length == 0"
              icon="mdi-magnify"
              title="Nenhum item encontrado!"
              color="#E0E0E0"
              style="color: #e0e0e0"
            ></v-empty-state>
          </div>
        </v-col>

        <v-col cols="12" md="6" sm="12">
          <div class="container-grafico-deposito">
            <h2 style="color: #bdbdbd; font-size: 18px">
              Quantidade de produtos por estoque
            </h2>
            <div v-if="podeGerarGrafico">
              <Pie :data="chartData" :options="options" />
            </div>
            <v-empty-state
              v-if="!podeGerarGrafico"
              icon="mdi-magnify"
              title="Nenhum item encontrado!"
              color="#E0E0E0"
              style="color: #e0e0e0"
            ></v-empty-state>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-main>
</template>

<script>
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);
import comunicacaoMovimentacoes from '@/services/movimentacoes/comunicacao-movimentacoes';

export default {
  name: 'home',
  components: {
    Pie,
  },
  data() {
    return {
      produtosVencimento: [],
      produtosPorEstoque: [],
      colunas: [
        { title: 'Lote', value: 'lote' },
        { title: 'Nome', value: 'nome' },
        { title: 'Total', value: 'total_produtos' },
      ],
      modelo: {
        movimentacoes: [],
      },
      chartData: {},
      podeGerarGrafico: false,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  methods: {
    async obterValoresTotais() {
      await comunicacaoMovimentacoes
        .valorTotalEntradasESaidas()
        .then((response) => {
          this.modelo = null;

          this.modelo = response.data;
        });
    },

    async obterProdutosPorEstoque() {
      await comunicacaoMovimentacoes
        .quantidadeDeProdutosPorEstoque()
        .then((response) => {
          const labels = [];
          const dados = [];
          const backgroundColor = [];
          const datasets = [];
          for (const dado of response.data) {
            labels.push(dado.deposito);
            dados.push(dado.total_produtos);
            backgroundColor.push(this.gerarCores());
          }

          datasets.push({
            backgroundColor,
            data: dados,
          });

          this.chartData = {
            labels,
            datasets,
          };

          if (labels != null && labels.length > 0) {
            this.podeGerarGrafico = true;
          }
        });
    },

    async produtosProximosDoVencimento() {
      await comunicacaoMovimentacoes
        .produtosProximosDoVencimento()
        .then((response) => {
          this.produtosVencimento = response.data;
        });
    },
    async obterUltimasMovimentacoes() {
      await comunicacaoMovimentacoes.ultimasMovimentacoes().then((response) => {
        this.modelo.movimentacoes = [];

        const dados = response.data;

        for (const dado of dados) {
          this.modelo.movimentacoes.push(dado);
        }
      });
    },

    gerarCores() {
      const rMin = 50;
      const rMax = 200;
      const gMin = 0;
      const gMax = 50;
      const bMin = 100;
      const bMax = 255;

      const r = Math.floor(Math.random() * (rMax - rMin + 1)) + rMin;
      const g = Math.floor(Math.random() * (gMax - gMin + 1)) + gMin;
      const b = Math.floor(Math.random() * (bMax - bMin + 1)) + bMin;
      const a = 1;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    },
  },
  created() {
    this.obterValoresTotais();
    this.produtosProximosDoVencimento();
    this.obterProdutosPorEstoque();
  },
};
</script>

<style scoped>
.titulos {
  justify-content: left;
  align-items: center;
}
.titulo-pagina {
  font-weight: 900;
  font-size: 25px;
  font-family: 'Roboto', sans-serif;
}

.subtitulo-pagina {
  font-weight: 400;
  font-size: 17px;
  color: #e0e0e0;
  font-family: 'Roboto', sans-serif;
}

.valor-total {
  @media (min-width: 850px) {
    width: 350px;
  }

  @media (max-width: 849px) {
    width: 100% important;
  }

  height: 150px;
  border-radius: 15px;
}

.container-valor-total {
  padding: 5px;
  margin-top: 5px;
  display: flex;
  justify-content: center;
}

.titulo-valor-total {
  color: #aa00ff;
  font-weight: 900 !important;
  font-family: 'Roboto', sans-serif;
  font-size: 40px;
}
.texto-valor-total {
  color: rgb(197 193 198);
  font-weight: 500 !important;
  font-family: 'Roboto', sans-serif;
  font-size: 17px;
}

.container-ultimas-movimentacoes {
  @media (min-width: 850px) {
    width: 400px;
  }

  @media (max-width: 849px) {
    width: 100% !important;
  }
  border-radius: 15px;
  height: 400px;
  margin-top: 15px;
}

.produtos-proximo-vencimento {
  @media (min-width: 850px) {
    width: 600px;
  }

  @media (max-width: 849px) {
    width: 100% important;
  }
  padding: 15px;
  background-color: white;
  border-radius: 15px;
  height: 500px;
  margin-left: 5%;
}

.container-grafico-deposito {
  @media (min-width: 850px) {
    width: 600px;
  }

  @media (max-width: 849px) {
    width: 100% important;
  }
  padding: 15px;
  background-color: white;
  border-radius: 15px;
  height: 500px;
}

.card-valor-total {
  display: block;
  padding: 25px;
  align-items: center;
  justify-content: center;
}
</style>
