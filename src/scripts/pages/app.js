import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { generateSubscribeButtonTemplate, generateUnsubscribeButtonTemplate } from '../templates';
import { isServiceWorkerAvailable, setupSkipToContent } from '../utils';
import { isCurrentPushSubscriptionAvailable, subscribe, unsubscribe } from '../utils/notification-helper';

class App {
  #content;
  #skipLinkButton;
  #currentPage = null;

  constructor({ content, skipLinkButton }) {
    this.#content = content;
    this.#skipLinkButton = skipLinkButton;

    this.#init();
  }

  #init() {
    setupSkipToContent(this.#skipLinkButton, this.#content);
  }

  async #setupPushNotification() {
    try {
      const pushNotificationTools = document.getElementById('push-notification-tools');
      if (!pushNotificationTools) return;

      const isSubscribed = await isCurrentPushSubscriptionAvailable();

      if (isSubscribed) {
        pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate();
        const unsubscribeButton = document.getElementById('unsubscribe-button');
        if (unsubscribeButton) {
          unsubscribeButton.addEventListener('click', () => {
            unsubscribe().finally(() => {
              this.#setupPushNotification();
            });
          });
        }
        return;
      }

      pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();
      const subscribeButton = document.getElementById('subscribe-button');
      if (subscribeButton) {
        subscribeButton.addEventListener('click', () => {
          subscribe().finally(() => {
            this.#setupPushNotification();
          });
        });
      }
    } catch (error) {
      console.error('Error setting up push notification:', error);
    }
  }

  async renderPage() {
    try {
      const url = getActiveRoute();
      const page = routes[url];

      if (this.#currentPage && typeof this.#currentPage.destroy === 'function') {
        this.#currentPage.destroy();
      }

      const pageInstance = page ? page() : routes.notFound();
      this.#currentPage = pageInstance;

      if (!pageInstance) return;

      const renderContent = async () => {
        this.#content.innerHTML = await pageInstance.render();

        if (pageInstance.afterRender) {
          await pageInstance.afterRender();
        }

        if (isServiceWorkerAvailable()) {
          await this.#setupPushNotification();
        }
      };

      if (document.startViewTransition) {
        await document.startViewTransition(renderContent).finished;
      } else {
        await renderContent();
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      this.#content.innerHTML = `
        <div class="container">
          <h2>Terjadi Kesalahan</h2>
          <p>${error.message}</p>
        </div>
      `;
    }
  }
}

export default App;
