import AboutPresenter from './about-presenter';

class AboutPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
          <h1>Tentang Kami</h1>
        <article id="about-content" class="about-content">
          <div id="loading-container" aria-live="polite">
            <div class="loading-spinner"></div>
          </div>
        </article>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new AboutPresenter({
      view: this,
      model: null,
    });

    await this.#presenter.getAboutData();
  }

  displayAboutData(aboutData) {
    const aboutContent = document.getElementById('about-content');

    const featuresHTML = aboutData.features.map(feature =>
      `<li>${feature}</li>`
    ).join('');

    aboutContent.innerHTML = `
      <article class="about-card">
        <header>
          <h2>${aboutData.title}</h2>
        </header>
        <section>
          <p class="about-description">${aboutData.description}</p>
        </section>
        
        <section class="about-features">
          <h3>Fitur Utama</h3>
          <ul>${featuresHTML}</ul>
        </section>
        
        <footer class="about-footer">
          <p>Versi: ${aboutData.version}</p>
          <div class="about-dev">
            <p>Dikembangkan oleh: ${aboutData.developer}</p>
            <p>Powered by: ${aboutData.lembaga}</p>
          </div>
        </footer>
      </article>
    `;
  }

  showLoading() {
    const loadingContainer = document.getElementById('loading-container');
    if (loadingContainer) {
      loadingContainer.innerHTML = `
        <div class="loading-spinner"></div>
      `;
    }
  }

  hideLoading() {
    const loadingContainer = document.getElementById('loading-container');
    if (loadingContainer) {
      loadingContainer.innerHTML = '';
    }
  }

  showError(message) {
    const aboutContent = document.getElementById('about-content');
    if (aboutContent) {
      aboutContent.innerHTML = `
        <div class="error-container">
          <p>Error: ${message}</p>
        </div>
      `;
    }
  }
}

export default AboutPage;
