class Camera {
    #video;
    #canvas;
    #cameraSelect;
    #stream = null;

    constructor({ video, canvas, cameraSelect }) {
        this.#video = video;
        this.#canvas = canvas;
        this.#cameraSelect = cameraSelect;
    }

    async launch() {
        try {
            await this.#getCameraDevices();
            await this.#startStream();
        } catch (error) {
            console.error('Error launching camera:', error);
            throw error;
        }
    }

    async #getCameraDevices() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            // Bersihkan select
            this.#cameraSelect.innerHTML = '';

            // Tambahkan opsi untuk setiap kamera
            videoDevices.forEach((device, index) => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label || `Kamera ${index + 1}`;
                this.#cameraSelect.appendChild(option);
            });

            // Tambahkan event listener untuk perubahan kamera
            this.#cameraSelect.addEventListener('change', () => {
                this.stop();
                this.#startStream();
            });
        } catch (error) {
            console.error('Error getting camera devices:', error);
        }
    }

    async #startStream() {
        try {
            const constraints = {
                video: {
                    deviceId: this.#cameraSelect.value ? { exact: this.#cameraSelect.value } : undefined
                }
            };

            this.#stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.#video.srcObject = this.#stream;

            return new Promise((resolve) => {
                this.#video.onloadedmetadata = () => {
                    this.#video.play();
                    resolve();
                };
            });
        } catch (error) {
            console.error('Error starting camera stream:', error);
            throw error;
        }
    }

    async takePicture() {
        if (!this.#stream) {
            throw new Error('Kamera tidak aktif');
        }

        // Sesuaikan ukuran canvas dengan video
        this.#canvas.width = this.#video.videoWidth;
        this.#canvas.height = this.#video.videoHeight;

        // Ambil gambar dari video ke canvas
        const context = this.#canvas.getContext('2d');
        context.drawImage(this.#video, 0, 0, this.#canvas.width, this.#canvas.height);

        // Konversi ke base64
        return this.#canvas.toDataURL('image/png');
    }

    stop() {
        if (this.#stream) {
            this.#stream.getTracks().forEach(track => track.stop());
            this.#stream = null;
            this.#video.srcObject = null;
        }
    }
}

export default Camera;