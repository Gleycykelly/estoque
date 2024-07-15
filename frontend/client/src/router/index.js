import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../pages/HomeView.vue';
import LoginView from '../pages/LoginView.vue';
import ProdutosView from '../pages/produtos/ProdutosView.vue';
import ProdutosEdicaoView from '../pages/produtos/ProdutosEdicaoView.vue';
import MarcasView from '../pages/marcas/MarcasView.vue';
import MarcasEdicaoView from '../pages/marcas/MarcasEdicaoView.vue';
import UnidadesMedidaView from '../pages/unidades-medidas/UnidadesMedidaView.vue';
import UnidadesMedidaEdicaoView from '../pages/unidades-medidas/UnidadesMedidaEdicaoView.vue';
import MovimentacoesView from '../pages/movimentacoes/MovimentacoesView.vue';
import MovimentacoesEdicaoView from '../pages/movimentacoes/MovimentacoesEdicaoView.vue';
import PerfilView from '../pages/perfil/PerfilView.vue';
import DepositosView from '../pages/depositos/DepositosView.vue';
import DepositoEdicaoView from '../pages/depositos/DepositoEdicaoView.vue';
import OperadoresView from '../pages/operadores/OperadoresView.vue';
import OperadoresEdicaoView from '../pages/operadores/OperadoresEdicaoView.vue';
import CategoriasView from '../pages/categorias/CategoriasView.vue';
import CategoriasEdicaoView from '../pages/categorias/CategoriasEdicaoView.vue';
import FornecedoresView from '../pages/fornecedores/FornecedoresView.vue';
import FornecedoresEdicaoView from '../pages/fornecedores/FornecedoresEdicaoView.vue';
import ProdutosPorEstoque from '../pages/relatorios/ProdutosPorEstoque.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/produtos',
    name: 'produtos',
    component: ProdutosView,
  },

  {
    path: '/produtos-edicao',
    name: 'produtos-edicao',
    component: ProdutosEdicaoView,
  },
  {
    path: '/fornecedores',
    name: 'fornecedores',
    component: FornecedoresView,
  },
  {
    path: '/fornecedores-edicao',
    name: 'fornecedores-edicao',
    component: FornecedoresEdicaoView,
  },
  {
    path: '/marcas',
    name: 'marcas',
    component: MarcasView,
  },
  {
    path: '/marcas-edicao',
    name: 'marcas-edicao',
    component: MarcasEdicaoView,
  },
  {
    path: '/unidadesMedida',
    name: 'unidadesMedida',
    component: UnidadesMedidaView,
  },
  {
    path: '/unidades-medida-edicao',
    name: 'unidades-medida-edicao',
    component: UnidadesMedidaEdicaoView,
  },
  {
    path: '/movimentacoes',
    name: 'movimentacoes',
    component: MovimentacoesView,
  },
  {
    path: '/movimentacoes-edicao',
    name: 'movimentacoes-edicao',
    component: MovimentacoesEdicaoView,
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: PerfilView,
  },
  {
    path: '/depositos',
    name: 'depositos',
    component: DepositosView,
  },
  {
    path: '/depositos-edicao',
    name: 'depositos-edicao',
    component: DepositoEdicaoView,
  },
  {
    path: '/operadores',
    name: 'operadores',
    component: OperadoresView,
  },
  {
    path: '/operadores-edicao',
    name: 'operadores-edicao',
    component: OperadoresEdicaoView,
  },
  {
    path: '/categorias',
    name: 'categorias',
    component: CategoriasView,
  },
  {
    path: '/categorias-edicao',
    name: 'categorias-edicao',
    component: CategoriasEdicaoView,
  },
  {
    path: '/produtos-por-estoque',
    name: 'produtos-por-estoque',
    component: ProdutosPorEstoque,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
