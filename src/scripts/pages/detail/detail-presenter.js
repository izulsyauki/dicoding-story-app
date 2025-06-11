class DetailPresenter {
    #storyId;
    #view;
    #apiModel;
    #dbModel;

    constructor(storyId, { view, apiModel, dbModel }) {
        this.#storyId = storyId;
        this.#view = view;
        this.#apiModel = apiModel;
        this.#dbModel = dbModel;
    }

    async showStoryDetail() {
        this.#view.showStoryDetailLoading();
        try {
            const response = await this.#apiModel.getStoryDetail(this.#storyId);

            if (response.error) {
                console.error('showStoryDetail: response:', response);
                this.#view.populateStoryDetailError(response.message);
                return;
            }

            const { story } = response;
            this.#view.populateStoryDetail(response.message, story);
            await this.showSaveButton();
        } catch (error) {
            console.error("showStoryDetail: error:", error);
            this.#view.populateStoryDetailError(error.message);
        } finally {
            this.#view.hideStoryDetailLoading();
        }
    }


    async saveStory() {
        try {
            const response = await this.#apiModel.getStoryDetail(this.#storyId);

            if (response.error) {
                console.error('saveReport: response:', response);
                throw new Error(response.message);
            }

            await this.#dbModel.putStory(response.story);

            this.#view.saveToBookmarkSuccessfully('Success to save to bookmark');
        } catch (error) {
            console.error('saveReport: error:', error);
            this.#view.saveToBookmarkFailed(error.message);
        }
    }

    async removeStory() {
        try {
            await this.#dbModel.removeStory(this.#storyId);

            this.#view.removeFromBookmarkSuccessfully('Success to remove from bookmark');
        } catch (error) {
            console.error('removeReport: error:', error);
            this.#view.removeFromBookmarkFailed(error.message);
        }
    }

    async showSaveButton() {
        if (await this.#isStorySaved()) {
            this.#view.renderRemoveButton();
            return;
        }

        this.#view.renderSaveButton();
    }

    async #isStorySaved() {
        return !!(await this.#dbModel.getStoryById(this.#storyId));
    }
}

export default DetailPresenter;