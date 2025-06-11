import {
  generateRemoveStoryButtonTemplate,
  generateSaveStoryButtonTemplate,
} from '../../templates';
import API from '../../data/api';
import { parseActivePathname } from '../../routes/url-parser';
import { showFormattedDate } from '../../utils';
import DetailPresenter from './detail-presenter';
import Map from '../../utils/map';
import Database from '../../data/database';

class DetailPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <h1>Detail Story</h1>
        <div id="story-detail" class="story-detail">
          <!-- Detail story akan ditampilkan di sini -->
        </div>
        <div id="story-detail-loading-container"></div>
        <div class="navigation">
          <a href="#/" class="btn-back">Kembali ke Beranda</a>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const { id } = parseActivePathname();

    if (!id) {
      this.populateStoryDetailError('ID story tidak ditemukan');
      return;
    }

    this.#presenter = new DetailPresenter(id, {
      view: this,
      apiModel: API,
      dbModel: Database,
    });

    this.#presenter.showStoryDetail();
  }

  populateStoryDetail(message, story) {
    console.log("Menampilkan detail story", story);

    document.getElementById('story-detail').innerHTML = `
      <div class="story-detail-card">
        <img src="${story.photoUrl}" alt="Foto story dari ${story.name}: ${story.description.substring(0, 50)}..." class="story-detail-image">
        <div class="story-detail-content">
          <h2 class="story-detail-title">${story.name}</h2>
          <p class="story-detail-date">${showFormattedDate(story.createdAt)}</p>
          <div class="story-detail-desc">${story.description}</div>
          ${story.lat && story.lon ? `
            <div class="story-location">
              <h3 class="story-location-title">Lokasi</h3>
              <p id="location-name" class="story-location-name"><span class="loading-text">Mencari nama lokasi...</span></p>
              <p class="story-location-coordinates">Latitude ${story.lat}, Longitude ${story.lon}</p>
              <div id="map" class="story-map" aria-label="Peta lokasi story"></div>
            </div>
          ` : ''}
          <div class="story-detail-body-actions-container">
            <h2>Aksi</h2>
            <div class="story-detail-actions-buttons">
              <div id="save-actions-container"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (story.lat && story.lon) {
      this.#initMap(story.lat, story.lon);
      this.#getLocationName(story.lat, story.lon);
    }
  }

  async #getLocationName(lat, lon) {
    try {
      const locationName = await Map.getPlaceNameByCoordinate(lat, lon);
      document.getElementById('location-name').innerHTML = `
        <i class="location-icon"></i>
        <span>${locationName}</span>
      `;
    } catch (error) {
      console.error('Terjadi kesalahan saat mendapatkan nama lokasi:', error);
      document.getElementById('location-name').innerHTML = `
        <i class="location-icon"></i>
        <span>Lokasi tidak diketahui</span>
      `;
    }
  }

  async #initMap(lat, lon) {
    try {
      if (typeof L !== 'undefined') {
        const map = L.map('map', {
          scrollWheelZoom: true,
          zoom: 13,
          center: [lat, lon]
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const locationName = await Map.getPlaceNameByCoordinate(lat, lon);

        L.marker([lat, lon]).addTo(map)
          .bindPopup(`<strong>${locationName}</strong><br>Latitude: ${lat}, Longitude: ${lon}`)
          .openPopup();
      } else {
        console.error('Library peta tidak tersedia.');
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat menginisialisasi peta:', error);
    }
  }

  populateStoryDetailError(message) {
    document.getElementById('story-detail').innerHTML = `
      <div class="error-container">
        <p>Error: ${message}</p>
      </div>
    `;
  }

  showStoryDetailLoading() {
    document.getElementById('story-detail-loading-container').innerHTML = `
      <div class="loading-spinner"></div>
    `;
  }

  hideStoryDetailLoading() {
    document.getElementById('story-detail-loading-container').innerHTML = '';
  }

  renderSaveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateSaveStoryButtonTemplate();

    document.getElementById('story-detail-save').addEventListener('click', async () => {
      await this.#presenter.saveStory();
      await this.#presenter.showSaveButton();
    });
  }

  saveToBookmarkSuccessfully(message) {
    console.log(message);
  }

  saveToBookmarkFailed(message) {
    alert(message);
  }

  renderRemoveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateRemoveStoryButtonTemplate();

    document.getElementById('story-detail-remove').addEventListener('click', async () => {
      await this.#presenter.removeStory();
      await this.#presenter.showSaveButton();
    });
  }

  removeFromBookmarkSuccessfully(message) {
    console.log(message);
  }

  removeFromBookmarkFailed(message) {
    alert(message);
  }
}

export default DetailPage;