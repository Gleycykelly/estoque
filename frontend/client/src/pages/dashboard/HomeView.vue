<template>
  <div class="fill-height">
    <v-card>
      <v-toolbar class="titulos" color="#AA00FF" flat dark>
        <v-toolbar-title style="text-align: start">
          <div style="margin-left: 30px">
            <div class="titulo-pagina">Dashboard</div>

            <div class="subtitulo-pagina">
              Olá, {{ nomeUsuarioLogado }} . Bem vindo(a) de volta!
            </div>
          </div>
        </v-toolbar-title>
      </v-toolbar>
    </v-card>
    <div style="background-color: #f2f2f2; min-height: 100vh">
      <div class="grid-container">
        <div class="grid-item">
          <v-card class="valor-total">
            <v-card-text class="card-valor-total">
              <div class="titulo-valor-total">
                R$ {{ this.modelo.totalEntrada }}
              </div>
              <div class="texto-valor-total">Total de entradas</div>
            </v-card-text>
          </v-card>
        </div>

        <div class="grid-item">
          <v-card class="valor-total">
            <v-card-text class="card-valor-total">
              <div class="titulo-valor-total">
                R$ {{ this.modelo.totalSaida }}
              </div>
              <div class="texto-valor-total">Total de saídas</div>
            </v-card-text>
          </v-card>
        </div>

        <div class="grid-item">
          <v-card class="valor-total">
            <v-card-text class="card-valor-total">
              <div class="titulo-valor-total">
                {{ modelo.totalProdutos }}
              </div>
              <div class="texto-valor-total">Total produtos</div>
            </v-card-text>
          </v-card>
        </div>

        <div class="grid-item">
          <v-card class="valor-total">
            <v-card-text class="card-valor-total">
              <div class="titulo-valor-total">
                {{ modelo.quantidadeDepositos }}
              </div>
              <div class="texto-valor-total">Total depósitos</div>
            </v-card-text>
          </v-card>
        </div>
      </div>

      <div class="grid-container-graficos">
        <div class="grid-item">
          <v-card class="produtos-proximo-vencimento">
            <v-card-text>
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
                fixed-header
              ></v-data-table-virtual>
              <v-empty-state
                v-if="!produtosVencimento || produtosVencimento.length == 0"
                icon="mdi-magnify"
                title="Nenhum item encontrado!"
                color="#E0E0E0"
                style="color: #e0e0e0"
              ></v-empty-state>
            </v-card-text>
          </v-card>
        </div>

        <div class="grid-item">
          <v-card class="container-grafico-deposito">
            <v-card-text>
              <h2 style="color: #bdbdbd; font-size: 18px">
                Quantidade de produtos por estoque
              </h2>
              <div class="pie-grafico" v-if="podeGerarGrafico">
                <Pie :data="chartData" :options="options" />
              </div>
              <v-empty-state
                v-if="!podeGerarGrafico"
                icon="mdi-magnify"
                title="Nenhum item encontrado!"
                color="#E0E0E0"
                style="color: #e0e0e0"
              ></v-empty-state>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);
import comunicacaoMovimentacoes from '@/services/movimentacoes/comunicacao-movimentacoes';
import comunicacaoUsuarios from '@/services/usuarios/comunicacao-usuarios';

export default {
  name: 'HomeView',
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
      nomeUsuarioLogado: null,
    };
  },
  methods: {
    async obterDadosUsuarioLogado() {
      await comunicacaoUsuarios.obterUsuarioLogado().then((response) => {
        this.nomeUsuarioLogado = response.data.nome;
      });
    },
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
    this.obterDadosUsuarioLogado();
    this.obterValoresTotais();
    this.produtosProximosDoVencimento();
    this.obterProdutosPorEstoque();
  },
};
</script>

<style scoped>
.grid-container {
  max-width: 95%;
  margin: 0 auto;
  gap: 30px;
  padding: 25px 0;

  @media (min-width: 1300px) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 1300px) {
    display: block;
  }
}

.grid-item {
  display: flex;
  justify-content: center;
  @media (max-width: 1300px) {
    margin-bottom: 25px;
  }
}

.grid-container-graficos {
  max-width: 95%;
  margin: 0 auto;
  gap: 25px;
  padding: 25px 0;
  @media (min-width: 1300px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 1300px) {
    display: block;
  }
}

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
  width: 100%;
  height: 150px;
  border-radius: 15px;
}

.card-valor-total {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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

.produtos-proximo-vencimento {
  width: 100%;
  padding: 15px;
  border-radius: 15px;
  height: 500px;
}

.container-grafico-deposito {
  width: 100%;
  padding: 15px;
  border-radius: 15px;
  height: 500px;
}

.pie-grafico {
  padding: 70px;
}
</style>
