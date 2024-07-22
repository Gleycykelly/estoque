<template>
  <v-app style="height: 100vh; margin: 0 auto">
    <Menu v-if="notIsLoginPage" />
    <router-view />
    <Alertas />
  </v-app>
</template>

<script>
import Alertas from './components/Alertas.vue';
import Menu from './components/Menu.vue';
import { useAuthStore } from '@/store/index';

export default {
  name: 'app',
  components: {
    Menu,
    Alertas,
  },
  data() {
    return {
      menuAberto: false,
    };
  },
  methods: {
    naoEstaAutenticado() {
      const authStore = useAuthStore();
      const token = authStore.getToken();
      if (!token) {
        this.$router.push('/login');
      }
    },
  },
  created() {
    this.naoEstaAutenticado();
  },
  computed: {
    notIsLoginPage() {
      return this.$route.name !== 'login';
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 5px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.fill-height {
  margin-top: -64px !important;
}
</style>
