// src/plugins/nprogress.js
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '@/assets/nprogress-custom.css'; // Importa o CSS customizado

NProgress.configure({ showSpinner: true });

// Adiciona a sobreposição quando NProgress começa
NProgress.start = (function (origStart) {
  return function () {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    origStart.call(this);
  };
})(NProgress.start);

// Remove a sobreposição quando NProgress termina
NProgress.done = (function (origDone) {
  return function () {
    const overlay = document.querySelector('.overlay');
    if (overlay) {
      document.body.removeChild(overlay);
    }
    origDone.call(this);
  };
})(NProgress.done);

export default NProgress;
