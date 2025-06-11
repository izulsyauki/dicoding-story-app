import API from '../../data/api';
import AddPresenter from './add-presenter';
import { getAccessToken } from '../../utils/auth';
import Map from '../../utils/map';
import Camera from '../../utils/camera';
import { convertBase64ToBlob } from '../../utils';

class AddPage {
  #presenter;
  #form;
  #photoPreview = null;
  #map = null;
  #camera = null;
  #isCameraOpen = false;
  #takenPhoto = null;

  async render() {
    return `
      <section class="container">
        <h1>Tambah Story Baru</h1>
        <div class="form-container">
          <form id="addStoryForm" enctype="multipart/form-data">
            <div class="form-group">
              <label for="description">Deskripsi</label>
              <textarea id="description" name="description" required></textarea>
            </div>
            <div class="form-group">
              <label for="photo">Foto (max 1MB)</label>
              <div class="photo-options">
                <input type="file" id="photo" name="photo" accept="image/*">
                <button type="button" id="openCameraBtn">Buka Kamera</button>
              </div>
              <div id="camera-container" class="camera-container">
                <video id="camera-video" class="camera-video">
                  Video stream tidak tersedia.
                </video>
                <canvas id="camera-canvas" class="camera-canvas"></canvas>
                <div class="camera-tools">
                  <select id="camera-select"></select>
                  <button id="takePictureBtn" class="btn" type="button">
                    Ambil Gambar
                  </button>
                  <button id="closeCameraBtn" class="btn" type="button">
                    Tutup Kamera
                  </button>
                </div>
              </div>
              <div id="imagePreview" class="image-preview"></div>
              <small id="photo-info" class="photo-info">Pilih foto dari perangkat atau ambil gambar dengan kamera</small>
            </div>
            <div class="form-group">
              <label>Lokasi</label>
              <div class="location-map-container">
                <div id="map" style="height: 300px; width: 100%; margin-bottom: 10px;"></div>
                <div id="map-loading-container"></div>
              </div>
              <div class="location-inputs">
                <div>
                  <label for="lat">Latitude</label>
                  <input type="number" id="lat" name="lat" step="any" disabled>
                </div>
                <div>
                  <label for="lon">Longitude</label>
                  <input type="number" id="lon" name="lon" step="any" disabled>
                </div>
              </div>
              <div id="location-message"></div>
            </div>
            <div class="form-group">
              <div id="submit-button-container">
                <button type="submit">Tambah Story</button>
              </div>
              <div id="addStoryMessage"</div>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new AddPresenter({
      view: this,
      model: API,
    });

    const accessToken = getAccessToken();
    if (!accessToken) {
      this.#showLoginPrompt();
      return;
    }

    this.#setupForm();
    this.#setupCamera();
    await this.#presenter.showAddStoryMap();
  }

  #setupForm() {
    this.#form = document.getElementById('addStoryForm');
    const photoInput = document.getElementById('photo');

    photoInput.addEventListener('change', (event) => {
      this.#handlePhotoChange(event);
    });

    this.#form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!this.#validateForm()) {
        return;
      }

      const description = document.getElementById('description').value;
      const photo = this.#takenPhoto || photoInput.files[0];
      const lat = document.getElementById('lat').value || null;
      const lon = document.getElementById('lon').value || null;

      await this.#presenter.addStory({
        description,
        photo,
        lat,
        lon,
      });
    });
  }

  #setupCamera() {
    const openCameraBtn = document.getElementById('openCameraBtn');
    const closeCameraBtn = document.getElementById('closeCameraBtn');
    const takePictureBtn = document.getElementById('takePictureBtn');
    const cameraContainer = document.getElementById('camera-container');

    cameraContainer.style.display = 'none';

    openCameraBtn.addEventListener('click', async () => {
      cameraContainer.style.display = 'block';
      this.#isCameraOpen = true;

      if (!this.#camera) {
        this.#camera = new Camera({
          video: document.getElementById('camera-video'),
          cameraSelect: document.getElementById('camera-select'),
          canvas: document.getElementById('camera-canvas'),
        });
      }

      await this.#camera.launch();
    });

    closeCameraBtn.addEventListener('click', () => {
      this.#closeCamera();
    });

    takePictureBtn.addEventListener('click', async () => {
      const imageBase64 = await this.#camera.takePicture();
      this.#takenPhoto = await convertBase64ToBlob(imageBase64, 'image/png');

      document.getElementById('imagePreview').innerHTML = `<img src="${imageBase64}" alt="Preview">`;

      document.getElementById('photo-info').textContent = 'Gambar dari kamera telah dipilih';

      document.getElementById('photo').removeAttribute('required');

      this.#closeCamera();
    });
  }

  #handlePhotoChange(event) {
    const file = event.target.files[0];
    const imagePreview = document.getElementById('imagePreview');
    const photoInfo = document.getElementById('photo-info');

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        this.#photoPreview = e.target.result;
        this.#takenPhoto = null;
        photoInfo.textContent = `File dipilih: ${file.name}`;
      };

      reader.readAsDataURL(file);
    } else {
      imagePreview.innerHTML = '';
      this.#photoPreview = null;
      photoInfo.textContent = 'Pilih foto dari perangkat atau ambil gambar dengan kamera';
    }
  }

  #validateForm() {
    const photo = document.getElementById('photo').files[0];

    if (!photo && !this.#takenPhoto) {
      this.showSubmitError('Silakan pilih foto atau ambil gambar dengan kamera');
      return false;
    }

    if (photo && photo.size > 1024 * 1024) {
      this.showSubmitError('Ukuran foto maksimal 1MB');
      return false;
    }

    return true;
  }

  #closeCamera() {
    if (this.#camera && this.#isCameraOpen) {
      this.#camera.stop();
      document.getElementById('camera-container').style.display = 'none';
      this.#isCameraOpen = false;
    }
  }

  #showLoginPrompt() {
    const formContainer = document.querySelector('.form-container');
    formContainer.innerHTML = `
      <div class="login-prompt">
        <p>Silakan login untuk menambahkan story</p>
        <a href="#/login" class="btn">Login</a>
      </div>
    `;
  }

  updateLocationFields(latitude, longitude) {
    document.getElementById('lat').value = latitude;
    document.getElementById('lon').value = longitude;
  }

  showLocationLoading() {
    document.getElementById('map-loading-container').innerHTML = `
      <div class="loading-spinner">Memuat peta...</div>
    `;
  }

  hideLocationLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showLocationError(message) {
    document.getElementById('location-message').textContent = `Error: ${message}`;
  }

  showSubmitLoading() {
    document.getElementById('submit-button-container').innerHTML = `
      <button type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Mengunggah...
      </button>
    `;
  }

  hideSubmitLoading() {
    document.getElementById('submit-button-container').innerHTML = `
      <button type="submit">Tambah Story</button>
    `;
  }

  showSubmitError(message) {
    document.getElementById('addStoryMessage').textContent = message;
  }

  showSubmitSuccess(message) {
    document.getElementById('addStoryMessage').textContent = 'Story berhasil ditambahkan! Mengalihkan...';
    this.#form.reset();
    document.getElementById('imagePreview').innerHTML = '';

    this.#closeCamera();

    setTimeout(() => {
      window.location.hash = '#/';
    }, 1500);
  }

  async initialMap() {
    try {
      Map.cleanupMap('#map');

      this.#map = await Map.build('#map', {
        zoom: 15,
        locate: true,
        scrollWheelZoom: true,
      });

      const centerCoordinate = this.#map.getCenter();

      this.updateLocationFields(centerCoordinate.latitude, centerCoordinate.longitude);

      const draggableMarker = this.#map.addMarker(
        [centerCoordinate.latitude, centerCoordinate.longitude],
        { draggable: true },
      );

      draggableMarker.addEventListener('move', (event) => {
        const coordinate = event.target.getLatLng();
        this.updateLocationFields(coordinate.lat, coordinate.lng);
      });

      this.#map.addMapEventListener('click', (event) => {
        draggableMarker.setLatLng(event.latlng);

        event.sourceTarget.flyTo(event.latlng);
      });
    } catch (error) {
      console.error('Terjadi kesalahan saat menginisialisasi peta:', error);
      this.showLocationError(error.message);
    }
  }

  showMapLoading() {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      mapContainer.innerHTML = '<div class="loading-indicator">Memuat peta...</div>';
    }
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  destroy() {
    if (this.#map) {
      this.#map.destroy();
      this.#map = null;
    }
  }
}

export default AddPage;