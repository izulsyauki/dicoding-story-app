import Database from '../../data/database';
import { generateStoriesListErrorTemplate, generateStoryListEmptyTemplate } from '../../templates';
import { showFormattedDate } from '../../utils/index';
import BookmarkPresenter from './bookmark-presenter';

class BookmarkPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <h1>Saved Stories</h1>
        <div id="map-container" class="map-container" aria-label="Peta lokasi stories">
          <div id="map" class="map"></div>
        </div>
        <div id="stories-container" class="stories-container" aria-live="polite">
          <div id="loading-container">
            <p>Memuat stories...</p>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });

    await this.#presenter.getSavedStories();
  }

  showStories(stories) {
    const storiesHTML = stories.map((story) => `
      <article class="story-card">
        <img src="${story.photoUrl ? story.photoUrl : 'images/placeholder-image.jpg'}" alt="Foto story dari ${story.name}: ${story.description.substring(0, 50)}..." class="story-image">
        <div class="story-content">
          <h3>${story.name}</h3>
          <time class="story-date" datetime="${new Date(story.createdAt).toISOString()}">${showFormattedDate(story.createdAt)}</time>
          <p class="story-desc">${story.description}</p>
          <a href="#/detail/${story.id}" class="btn-detail">Lihat Detail</a>
        </div>
      </article>
    `).join('');

    document.getElementById('stories-container').innerHTML = storiesHTML;

    this.#initMap(stories);
  }

  async #initMap(stories) {
    try {
      if (typeof L !== 'undefined') {
        const map = L.map('map').setView([-2.5489, 118.0149], 5); // Koordinat Indonesia

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        stories.forEach(story => {
          if (story.lat && story.lon) {
            L.marker([story.lat, story.lon]).addTo(map)
              .bindPopup(`<b>${story.name}</b><br>${story.description}`)
              .openPopup();
          }
        });
      } else {
        console.error('Library peta tidak tersedia');
      }
    } catch (error) {
      console.error('Error saat menginisialisasi peta:', error);
    }
  }

  showLoginPrompt() {
    document.getElementById('stories-container').innerHTML = `
      <div class="login-prompt">
        <p>Silakan login untuk melihat stories</p>
        <a href="#/login" class="btn">Login</a>
      </div>
    `;
  }

  showEmptyStories() {
    document.getElementById('stories-container').innerHTML = generateStoryListEmptyTemplate();
  }

  showErrorMessage(message) {
    document.getElementById('stories-container').innerHTML = generateStoriesListErrorTemplate(message);
  }

  showLoading() {
    document.getElementById('loading-container').innerHTML = `
      <div class="loading-spinner"></div>
    `;
  }

  hideLoading() {
    const loadingElement = document.getElementById('loading-indicator');
    if (loadingElement) {
      loadingElement.innerHTML = '';
    }
  }
}

export default BookmarkPage;
