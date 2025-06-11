import { convertBase64ToUint8Array } from ".";
import CONFIG from "../config";
import API from "../data/api";

export function isNotificationAvailable() {
    return 'Notification' in window;
}

export function isNotificationGranted() {
    return Notification.permission === 'granted';
}

export async function requestNotificationPermission() {
    if (!isNotificationAvailable()) {
        console.error('Notification API unsupported.');
        return false;
    }

    if (isNotificationGranted()) {
        return true;
    }

    const status = await Notification.requestPermission();

    if (status === 'denied') {
        alert('Izin notifikasi ditolak.');
        return false;
    }

    if (status === 'default') {
        alert('Izin notifikasi ditutup atau diabaikan.');
        return false;
    }

    return true;
}

export function showNotification(title, options = {}) {
    if (!isNotificationAvailable()) {
        console.error('Notification API unsupported.');
        return;
    }

    const defaultOptions = {
        body: '',
        icon: '/images/icons/icon-192x192.png',
        badge: '/images/icons/icon-192x192.png',
        vibrate: [100, 50, 100],
        requireInteraction: false,
    }

    return new Notification(title, { ...defaultOptions, ...options });
}

export async function getPushSubscription() {
    const registration = await navigator.serviceWorker.getRegistration();
    return await registration.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
    return !!(await getPushSubscription());
}

export function generateSubscribeOptions() {
    return {
        userVisibleOnly: true,
        applicationServerKey: convertBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
    };
}

export async function subscribe() {
    if (!(await requestNotificationPermission())) {
        return;
    }

    if (await isCurrentPushSubscriptionAvailable()) {
        alert('Sudah berlangganan push notification.');
        return;
    }

    console.log('Mulai berlangganan push notification...');

    const failureSubscribeMessage = 'Langganan push notification gagal diaktifkan.';
    const successSubscribeMessage = 'Langganan push notification berhasil diaktifkan.';

    let pushSubscription;

    try {
        const registration = await navigator.serviceWorker.getRegistration();
        pushSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());

        const { endpoint, keys } = pushSubscription.toJSON();
        const response = await API.subscribePushNotification({ endpoint, keys });

        if (!response.ok) {
            console.error('subscribe: response:', response);
            alert(failureSubscribeMessage);

            // Undo subscribe to push notification
            await pushSubscription.unsubscribe();

            return;
        }

        console.log({ endpoint, keys });

        alert(successSubscribeMessage);
    } catch (error) {
        console.error('subscribe: error:', error);
        alert(failureSubscribeMessage);

        // Undo subscribe to push notification
        await pushSubscription.unsubscribe();
    }
}

export async function unsubscribe() {
    const failureUnsubscribeMessage = 'Langganan push notification gagal dinonaktifkan.';
    const successUnsubscribeMessage = 'Langganan push notification berhasil dinonaktifkan.';

    try {
        const pushSubscription = await getPushSubscription();
        if (!pushSubscription) {
            alert('Tidak bisa memutus langganan push notification karena belum berlangganan sebelumnya.');
            return;
        }

        const { endpoint, keys } = pushSubscription.toJSON();
        const response = await API.unsubscribePushNotification({ endpoint });

        if (!response.ok) {
            alert(failureUnsubscribeMessage);
            console.error('unsubscribe: response:', response);
            return;
        }

        const unsubscribed = await pushSubscription.unsubscribe();

        if (!unsubscribed) {
            alert(failureUnsubscribeMessage);
            await subscribePushNotification({ endpoint, keys });
            return;
        }

        alert(successUnsubscribeMessage);
    } catch (error) {
        alert(failureUnsubscribeMessage);
        console.error('unsubscribe: error:', error);
    }
}