import { showFormattedDate } from './utils';

export function generateLoaderTemplate() {
  return `
    <div class="loader"></div>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}

export function generateStoryListEmptyTemplate() {
  return `
    <div id="story-list-empty" class="story-list-empty">
      <h2>Tidak ada cerita yang tersedia</h2>
      <p>Saat ini, tidak ada cerita menarik yang dapat ditampilkan.</p>
    </div>
  `;
}

export function generateStoriesListErrorTemplate(message) {
  return `
    <div id="story-list-error" class="story-list-error">
      <h2>Terjadi kesalahan pengambilan daftar cerita</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateReportDetailErrorTemplate(message) {
  return `
    <div id="story-detail-error" class="story-detail__error">
      <h2>Terjadi kesalahan pengambilan detail laporan</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" class="btn">
      Subscribe <i class="fas fa-bell"></i>
    </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" class="btn unsubscribe-button">
      Unsubscribe <i class="fas fa-bell-slash"></i>
    </button>
  `;
}

export function generateSaveStoryButtonTemplate() {
  return `
    <button id="story-detail-save" class="btn btn-transparent">
      Simpan cerita <i class="far fa-bookmark"></i>
    </button>
  `;
}

export function generateRemoveStoryButtonTemplate() {
  return `
    <button id="story-detail-remove" class="btn btn-transparent">
      Buang cerita <i class="fas fa-bookmark"></i>
    </button>
  `;
}
