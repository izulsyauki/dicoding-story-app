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
                return;
            }

            this.#view.showSubmitSuccess(response.message);
        } catch (error) {
            console.error('addStory: error:', error);
            this.#view.showSubmitError(error.message);
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
        } finally {
            this.#view.hideMapLoading();
        }
    }
}

export default AddPresenter;