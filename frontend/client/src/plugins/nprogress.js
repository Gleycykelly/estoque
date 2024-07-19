// src/plugins/nprogress.js
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '@/assets/nprogress-custom.css'; // Importa o CSS customizado

NProgress.configure({ showSpinner: true });

const origStart = NProgress.start;
const origDone = NProgress.done;

NProgress.start = function () {
  console.log(document.body);
  document.body.classList.add('loading');
  origStart.call(this);
};

NProgress.done = function () {
  document.body.classList.remove('loading');
  origDone.call(this);
};

export default NProgress;
