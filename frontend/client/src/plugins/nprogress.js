import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '@/assets/nprogress-custom.css';

NProgress.configure({ showSpinner: true });

const origStart = NProgress.start;
const origDone = NProgress.done;

NProgress.start = function () {
  document.body.classList.add('loading');
  origStart.call(this);
};

NProgress.done = function () {
  document.body.classList.remove('loading');
  origDone.call(this);
};

export default NProgress;
