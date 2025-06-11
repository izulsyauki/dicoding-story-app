import { getAccessToken } from "../../utils/auth";

class BookmarkPresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async getSavedStories() {
        this.#view.showLoading();
        try {
            const accessToken = getAccessToken();
            if (!accessToken) {
                this.#view.showLoginPrompt();
                return;
            }

            const stories = await this.#model.getAllStories();

            if (!stories || stories.length === 0) {
                this.#view.showEmptyStories();
                return;
            }

            this.#view.showStories(stories);
        } catch (error) {
            console.error('getSavedStories: error:', error);
            this.#view.showErrorMessage(error.message);
        } finally {
            this.#view.hideLoading();
        }
    }
}

export default BookmarkPresenter;