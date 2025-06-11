import '../styles/styles.css';
import Router from './routes/index';
import initializeDrawer from './utils/drawer.js';
import App from './pages/app';
import Camera from './utils/camera.js';

document.addEventListener('DOMContentLoaded', async () => {
  initializeDrawer();

  const router = new Router();
  router.renderPage();
  window.addEventListener('hashchange', () => {
    router.renderPage();
  });

  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
    skipLinkButton: document.querySelector('.skip-link'),
    navigationDrawerContent: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();

    Camera.stopAllStreams();
  });
});
