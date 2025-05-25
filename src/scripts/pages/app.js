import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { setupSkipToContent } from '../utils';

class App {
  #content;
  #skipLinkButton;

  constructor({ content, skipLinkButton }) {
    this.#content = content;
    this.#skipLinkButton = skipLinkButton;

    this.#init();
  }

  #init() {
    setupSkipToContent(this.#skipLinkButton, this.#content);
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    if (page) {
      const pageInstance = page();
      if (pageInstance) {
        this.#content.innerHTML =
          await pageInstance.render();
        await pageInstance.afterRender();
      }
    } else {
      this.#content.innerHTML = `<p>Halaman tidak ditemukan</p>`
    }
  }
}

export default App;
