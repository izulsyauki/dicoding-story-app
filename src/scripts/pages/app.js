import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { generateSubscribeButtonTemplate, generateUnsubscribeButtonTemplate } from '../templates';
import { isServiceWorkerAvailable, setupSkipToContent } from '../utils';
import { isCurrentPushSubscriptionAvailable, subscribe, unsubscribe } from '../utils/notification-helper';

class App {
  #content;
  #skipLinkButton;

  constructor({ content, skipLinkButton }) {
    this.#content = content;
    this.#skipLinkButton = skipLinkButton;

    this.#init();
  }

  #init() {
    setupSkipToContent(this.#skipLinkButton, this.#content);
  }

  async #setupPushNotification() {
    const pushNotificationTools = document.getElementById('push-notification-tools');
    const isSubscribed = await isCurrentPushSubscriptionAvailable();

    if (isSubscribed) {
      pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate();
      document.getElementById('unsubscribe-button').addEventListener('click', () => {
        unsubscribe().finally(() => {
          this.#setupPushNotification();
        });
      });

      return;
    }

    pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();
    document.getElementById('subscribe-button').addEventListener('click', () => {
      subscribe().finally(() => {
        this.#setupPushNotification();
      });
    });

  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    if (page) {
      const pageInstance = page();
      if (pageInstance) {
        this.#content.innerHTML =
          await pageInstance.render();
        await pageInstance.afterRender();

        if (isServiceWorkerAvailable()) {
          this.#setupPushNotification();
        }
      }
    } else {
      this.#content.innerHTML = `<p>Halaman tidak ditemukan</p>`
    }
  }
}

export default App;
