<template>
  <v-navigation-drawer v-model="menuAberto" clipped theme="dark" :width="325">
    <v-list dense nav color="#AA00FF" class="menu-opcoes">
      <v-list-subheader>Menu</v-list-subheader>

      <v-divider></v-divider>

      <v-list-item
        class="titulo-item"
        prepend-icon="mdi-home"
        :to="{ name: 'home' }"
      >
        Dashboard
      </v-list-item>

      <v-divider></v-divider>

      <v-list-group value="Cadastros" no-action>
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-folder-plus"
            :class="{ 'show-icon': menuFechado }"
          >
            <div class="titulo">Cadastros</div>
          </v-list-item>
        </template>

        <v-list-item class="sub-titulo" :to="{ name: 'categorias' }">
          Categorias
        </v-list-item>
        <v-list-item class="sub-titulo" :to="{ name: 'fornecedores' }">
          Fornecedores
        </v-list-item>
        <v-list-item class="sub-titulo" :to="{ name: 'marcas' }">
          Marcas
        </v-list-item>
        <v-list-item class="sub-titulo" :to="{ name: 'produtos' }">
          Produtos
        </v-list-item>
        <v-list-item class="sub-titulo" :to="{ name: 'unidadesMedida' }">
          Unidades de medida
        </v-list-item>
      </v-list-group>
      <v-list-group value="Movimentações" no-action>
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-swap-horizontal-bold"
            :class="{ 'show-icon': menuFechado }"
          >
            <div class="titulo">Movimentações</div>
          </v-list-item>
        </template>

        <v-list-item class="sub-titulo" :to="{ name: 'movimentacoes' }">
          Entrada/Saída
        </v-list-item>
      </v-list-group>

      <v-list-group value="Relatórios" no-action>
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-file-document"
            :class="{ 'show-icon': menuFechado }"
          >
            <div class="titulo">Relatórios</div>
          </v-list-item>
        </template>

        <v-list-item class="sub-titulo" :to="{ name: 'emissao-produtos' }">
          Produtos
        </v-list-item>
        <v-list-item class="sub-titulo" :to="{ name: 'emissao-movimentacoes' }">
          Movimentações
        </v-list-item>
      </v-list-group>

      <v-list-group value="Administrativo" no-action>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-cogs">
            <div class="titulo">Administrativo</div>
          </v-list-item>
        </template>

        <v-list-item
          class="sub-titulo"
          :to="{ name: 'depositos' }"
          v-if="ehAdministrador"
        >
          Depósitos
        </v-list-item>
        <v-list-item
          class="sub-titulo"
          :to="{ name: 'operadores' }"
          v-if="ehAdministrador"
        >
          Operadores
        </v-list-item>
        <v-list-item class="sub-titulo" :to="{ name: 'perfil' }">
          Perfil
        </v-list-item>
      </v-list-group>

      <v-list-item
        class="titulo-item"
        prepend-icon="mdi-logout"
        @click="sair()"
      >
        Sair
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-main>
    <v-toolbar color="#AA00FF" dark extended flat>
      <v-app-bar-nav-icon
        @click="menuAberto = !menuAberto"
      ></v-app-bar-nav-icon>
    </v-toolbar>
  </v-main>
</template>

<script>
import comunicacaoUsuarios from '@/services/usuarios/comunicacao-usuarios';
import { useAuthStore } from '@/store/index';
export default {
  name: 'Menu',
  props: {
    ehDashboard: Boolean,
  },
  data() {
    return {
      ehAdministrador: false,
      menuAberto: true,
    };
  },
  methods: {
    async obterUsuario() {
      await comunicacaoUsuarios.obterUsuarioLogado().then((response) => {
        this.ehAdministrador =
          response.data.permissaoUsuario === 'Administrador';
      });
    },

    sair() {
      const authStore = useAuthStore();
      const token = authStore.clearToken();

      if (!token) {
        this.$router.push('/login');
      }
    },
  },
  created() {
    this.obterUsuario();
  },
};
</script>

<style>
.menu-opcoes {
  text-align: left !important;
}

.titulo {
  font-size: 16px !important;
  font-weight: 900;
}
</style>
