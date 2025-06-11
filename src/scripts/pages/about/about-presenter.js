class AboutPresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async getAboutData() {
        this.#view.showLoading();
        try {
            const aboutData = {
                title: 'Story Share App',
                description: 'Story Share adalah platform berbagi cerita modern yang dirancang untuk menghubungkan orang melalui pengalaman mereka. Aplikasi ini memungkinkan pengguna untuk berbagi momen berharga dalam bentuk gambar dan deskripsi, serta menambahkan lokasi untuk memberikan konteks yang lebih kaya. Dengan antarmuka yang intuitif dan fitur yang kuat, Story Share menjadi tempat ideal untuk mendokumentasikan dan berbagi perjalanan hidup Anda.',
                features: [
                    'Berbagi cerita dengan gambar berkualitas tinggi',
                    'Menambahkan lokasi geografis ke setiap cerita',
                    'Menjelajahi cerita dari pengguna lain di peta interaktif',
                    'Autentikasi pengguna yang aman dan mudah',
                    'Antarmuka responsif untuk pengalaman optimal di semua perangkat'
                ],
                version: '1.2.0',
                developer: 'Izulsyauki Imani',
                lembaga: 'Dicoding Indonesia'
            };

            this.#view.displayAboutData(aboutData);
        } catch (error) {
            console.error('getAboutData: error:', error);
            this.#view.showError(error.message);
        } finally {
            this.#view.hideLoading();
        }
    }
}

export default AboutPresenter;