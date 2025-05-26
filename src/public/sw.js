self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
    console.log('Service worker pushing...');

    async function chainPromise() {
        const data = await event.data.json();

        await self.registration.showNotification(data.title, {
            body: data.options.body,
        });
    }

    event.waitUntil(chainPromise());
});