class Camera {
    #video;
    #canvas;
    #cameraSelect;
    #stream = null;

    static addNewStream(stream) {
        if (!Array.isArray(window.currentStreams)) {
            window.currentStreams = [stream];
            return;
        }
        window.currentStreams = [...window.currentStreams, stream];
    }
    static stopAllStreams() {
        if (!Array.isArray(window.currentStreams)) {
            window.currentStreams = [];
            return;
        }
        window.currentStreams.forEach((stream) => {
            if (stream.active) {
                stream.getTracks().forEach((track) => track.stop());
            }
        });
    }

    constructor({ video, canvas, cameraSelect }) {
        this.#video = video;
        this.#canvas = canvas;
        this.#cameraSelect = cameraSelect;
    }

    async launch() {
        try {
            await this.#getCameraDevices();
            await this.#startStream();

            if (this.#stream) {
                Camera.addNewStream(this.#stream);
            }
        } catch (error) {
            console.error('Error launching camera:', error);
            throw error;
        }
    }

    async #getCameraDevices() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            this.#cameraSelect.innerHTML = '';

            videoDevices.forEach((device, index) => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label || `Kamera ${index + 1}`;
                this.#cameraSelect.appendChild(option);
            });

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

        this.#canvas.width = this.#video.videoWidth;
        this.#canvas.height = this.#video.videoHeight;

        const context = this.#canvas.getContext('2d');
        context.drawImage(this.#video, 0, 0, this.#canvas.width, this.#canvas.height);

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