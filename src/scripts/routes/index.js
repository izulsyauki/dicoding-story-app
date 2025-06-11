import ViewTransition from '../utils/view-transition';
import routes from './routes';
import { getActiveRoute } from './url-parser';

class Router {
  constructor() {
    this._content = document.getElementById('main-content');
  }

  async renderPage() {
    try {
      const url = getActiveRoute();
      const page = routes[url];

      const pageInstance = page ? page() : routes.notFound();
      
      if (!pageInstance) return;

      await ViewTransition.apply(async () => {
        this._content.innerHTML = await pageInstance.render();

        if (pageInstance.afterRender) {
          await pageInstance.afterRender();
        }
      });
    } catch (error) {
      console.error('Error saat merender halaman:', error);
      this._content.innerHTML = `<div class="container"><h2>Terjadi Kesalahan</h2><p>${error.message}</p></div>`;
    }
  }
}

export default Router;