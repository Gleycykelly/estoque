<template>
  <v-navigation-drawer v-model="menuAberto" clipped theme="dark" :width="300">
    <v-list dense nav color="#AA00FF" class="menu-opcoes">
      <v-list-subheader>Menu</v-list-subheader>

      <v-divider></v-divider>

      <v-list-item prepend-icon="mdi-home" :to="{ name: 'home' }">
        Dashboard
      </v-list-item>

      <v-divider></v-divider>

      <v-list-group value="Cadastros" no-action>
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            title="Cadastros"
            prepend-icon="mdi-folder-plus"
            :class="{ 'show-icon': menuFechado }"
          ></v-list-item>
        </template>

        <v-list-item :to="{ name: 'categorias' }">Categorias</v-list-item>
        <v-list-item :to="{ name: 'fornecedores' }">Fornecedores</v-list-item>
        <v-list-item :to="{ name: 'marcas' }">Marcas</v-list-item>
        <v-list-item :to="{ name: 'produtos' }">Produtos</v-list-item>
        <v-list-item :to="{ name: 'unidadesMedida' }">
          Unidades de medida
        </v-list-item>
      </v-list-group>
      <v-list-group value="Movimentações" no-action>
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            title="Movimentações"
            prepend-icon="mdi-swap-horizontal-bold"
            :class="{ 'show-icon': menuFechado }"
          ></v-list-item>
        </template>

        <v-list-item :to="{ name: 'movimentacoes' }">Entrada/Saída</v-list-item>
      </v-list-group>
      <v-list-group value="Administrativo" no-action>
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            title="Administrativo"
            prepend-icon="mdi-cogs"
          ></v-list-item>
        </template>

        <v-list-item :to="{ name: 'depositos' }" v-if="ehAdministrador">
          Depósitos
        </v-list-item>
        <v-list-item :to="{ name: 'operadores' }" v-if="ehAdministrador">
          Operadores
        </v-list-item>
        <v-list-item :to="{ name: 'perfil' }">Perfil</v-list-item>
      </v-list-group>

      <v-list-item prepend-icon="mdi-logout" @click="sair()">Sair</v-list-item>
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
import api from '@/services/api';
import { useAuthStore } from '@/store/index';
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Menu',
  data() {
    return {
      ehAdministrador: false,
      menuAberto: true,
    };
  },
  methods: {
    obterToken() {
      const authStore = useAuthStore();
      const token = authStore.getToken();

      if (!token) {
        this.$router.push('/login');
      }

      return token;
    },
    async obterUsuario() {
      api
        .post(
          `http://localhost:3000/usuarios/obter-usuario-logado`,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.obterToken()}`,
            },
          },
        )
        .then((response) => {
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
</style>
