class DetailPresenter {
    #storyId;
    #view;
    #apiModel;

    constructor(storyId, { view, apiModel }) {
        this.#storyId = storyId;
        this.#view = view;
        this.#apiModel = apiModel;
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
        } catch (error) {
            console.error("showStoryDetail: error:", error);
            this.#view.populateStoryDetailError(error.message);
        } finally {
            this.#view.hideStoryDetailLoading();
        }
    }
}

export default DetailPresenter;