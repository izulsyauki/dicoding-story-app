import { map, tileLayer, marker, popup, latLng } from 'leaflet';
import CONFIG from '../config';

export default class Map {
    #zoom = 5;
    #map = null;

    static async getPlaceNameByCoordinate(latitude, longitude) {
        try {
            const url = new URL(`https://api.maptiler.com/geocoding/${longitude},${latitude}.json`);
            url.searchParams.set('key', CONFIG.MAP_SERVICE_API_KEY);
            url.searchParams.set('language', 'id');
            url.searchParams.set('limit', '1');

            const response = await fetch(url);
            const json = await response.json();

            const place = json.features[0].place_name.split(', ');
            return [place.at(-2), place.at(-1)].map((name) => name).join(', ');
        } catch (error) {
            console.error('getPlaceNameByCoordinate: error:', error);
            return `${latitude}, ${longitude}`;
        }
    }

    static isGeoLocationIsAvailable() {
        return 'geolocation' in navigator;
    }

    static getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!Map.isGeoLocationIsAvailable()) {
                reject(new Error('Geolocation tidak didukung oleh browser ini'));
                return;
            }

            const options = {
                enableHighAccuracy: true,
                timeout: 15000, 
                maximumAge: 30000 
            };

            const handleError = (error) => {
                let errorMessage;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Izin akses lokasi ditolak';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Informasi lokasi tidak tersedia';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Waktu permintaan lokasi habis';
                        break;
                    default:
                        errorMessage = 'Terjadi kesalahan saat mendapatkan lokasi';
                }
                reject(new Error(errorMessage));
            };

            navigator.geolocation.getCurrentPosition(resolve, handleError, options);
        });
    }

    /** Reference of using this static method: https://stackoverflow.com/questions/43431550/how-can-i-invoke-asynchronous-code-within-a-constructor **/
    static async build(selector, options = {}) {
        try {
            Map.cleanupMap(selector);

            const container = document.querySelector(selector);
            if (!container) {
                throw new Error('Map container not found');
            }

            if ('center' in options && options.center) {
                return new Map(selector, options);
            }

            const jakartaCoordinate = [-6.2, 106.816666];

            // Using Geolocation API
            if ('locate' in options && options.locate) {
                try {
                    console.log('Mencoba mendapatkan lokasi pengguna...');
                    const position = await Map.getCurrentPosition();
                    const coordinate = [position.coords.latitude, position.coords.longitude];

                    console.log('Lokasi ditemukan:', coordinate);

                    return new Map(selector, {
                        ...options,
                        center: coordinate,
                    });
                } catch (err) {
                    console.warn('Gagal mendapatkan lokasi:', err.message);
                    console.log('Menggunakan lokasi default (Jakarta)');

                    return new Map(selector, {
                        ...options,
                        center: jakartaCoordinate,
                    });
                }
            }

            return new Map(selector, {
                ...options,
                center: jakartaCoordinate,
            });
        } catch (error) {
            console.error('Error building map:', error);
            throw error;
        }
    }

    static cleanupMap(selector) {
        try {
            const container = document.querySelector(selector);
            if (container) {
                if (container._leaflet_id) {
                    container._leaflet.remove();
                }

                container._leaflet_id = null;
                container._leaflet = null;

                container.innerHTML = '';
            }
        } catch (error) {
            console.error('Error cleaning up map:', error);
        }
    }

    constructor(selector, options = {}) {
        const container = document.querySelector(selector);

        if (container._leaflet_id) {
            Map.cleanupMap(selector);
        }

        this.#zoom = options.zoom ?? this.#zoom;

        const tileOsm = tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
        });

        this.#map = map(document.querySelector(selector), {
            zoom: this.#zoom,
            scrollWheelZoom: options.scrollWheelZoom ?? false,
            layers: [tileOsm],
            ...options
        })
    }

    changeCamera(coordinate, zoomLevel = null) {
        if (!zoomLevel) {
            this.#map.setView(latLng(coordinate), this.#zoom);
            return;
        }

        this.#map.setView(latLng(coordinate), zoomLevel);
    }

    getCenter() {
        const { lat, lng } = this.#map.getCenter();
        return {
            latitude: lat,
            longitude: lng,
        };
    }

    addMarker(coordinates, markerOptions = {}, popupOptions = null) {
        if (typeof markerOptions !== 'object') {
            throw new Error('markerOptions must be an object');
        }

        const newMarker = marker(coordinates, {
            ...markerOptions,
        });

        if (popupOptions) {
            if (typeof popupOptions !== 'object') {
                throw new Error('popupOptions must be an object');
            }
            if (!('content' in popupOptions)) {
                throw new Error('popupOptions must include `content` property.');
            }
            const newPopup = popup(coordinates, popupOptions);
            newMarker.bindPopup(newPopup);
        }
        newMarker.addTo(this.#map);
        return newMarker;
    }

    addMapEventListener(eventName, callback) {
        this.#map.addEventListener(eventName, callback);
    }

    destroy() {
        if (this.#map) {
            this.#map.remove();
            this.#map = null;
        }
    }
}