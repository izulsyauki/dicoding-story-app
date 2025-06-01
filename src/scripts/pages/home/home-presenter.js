import { getAccessToken } from "../../utils/auth";

class HomePresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async getAllStories() {
        this.#view.showLoading();
        try {
            const accessToken = getAccessToken();
            if (!accessToken) {
                this.#view.showLoginPrompt();
                return;
            }

            const response = await this.#model.getAllStories();

            if (response.error) {
                console.error('getAllStories: response:', response);
                this.#view.showErrorMessage(response.message);
                return;
            }

            if (response.listStory.length === 0) {
                this.#view.showEmptyStories();
                return;
            }

            this.#view.showStories(response.listStory);
        } catch (error) {
            console.error('getAllStories: error:', error);
            this.#view.showErrorMessage(error.message);
        } finally {
            this.#view.hideLoading();
        }
    }
}

export default HomePresenter;