import { requestNotificationPermission, showNotification } from "../../utils/notification-helper";

class AddPresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#model = model;
        this.#view = view;
    }

    async getLocation() {
        this.#view.showLocationLoading();
        try {
            if (navigator.geolocation) {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    });
                });

                console.log('Lokasi ditemukan:', [position.coords.latitude, position.coords.longitude]);
                this.#view.updateLocationFields(position.coords.latitude, position.coords.longitude);
                this.#view.showLocationSuccess();
            } else {
                this.#view.showLocationError('Geolocation tidak didukung oleh browser ini');
            }
        } catch (error) {
            console.error('getLocation: error:', error);
            this.#view.showLocationError(error.message);
        } finally {
            this.#view.hideLocationLoading();
        }
    }

    async addStory({ description, photo, lat, lon }) {
        this.#view.showSubmitLoading();
        try {
            const data = {
                description,
                photo,
                lat,
                lon
            };

            const response = await this.#model.addStory(data);

            if (!response.ok) {
                console.error('addStory: response:', response);
                this.#view.showSubmitError(response.message);

                await requestNotificationPermission();
                showNotification({
                    title: 'Gagal Menambahkan Story',
                    body: response.message,
                    icon: '/images/icons/icon-192x192.png',
                });
                return;
            }

            this.#view.showSubmitSuccess(response.message);

            await requestNotificationPermission();
            showNotification('Story Berhasil Dibuat', {
                body: `Anda telah membuat story baru dengan deskripsi: "${data.description}"`,
                icon: '/images/icons/icon-192x192.png',
            });

        } catch (error) {
            console.error('addStory: error:', error);
            this.#view.showSubmitError(error.message);

            await requestNotificationPermission();
            showNotification('Error', {
                body: 'Terjadi kesalahan saat menambahkan story',
                icon: '/images/icons/icon-x144.png'
            });
        } finally {
            this.#view.hideSubmitLoading();
        }
    }

    async showAddStoryMap() {
        this.#view.showMapLoading();
        try {
            await this.#view.initialMap();
        } catch (error) {
            console.error('showAddStoryMap: error:', error);
            this.#view.showSubmitError(error.message);

            await requestNotificationPermission();
            showNotification('Error', {
                body: 'Terjadi kesalahan saat menambahkan story',
                icon: '/images/icons/icon-x144.png'
            });
        } finally {
            this.#view.hideMapLoading();
        }
    }
}

export default AddPresenter;