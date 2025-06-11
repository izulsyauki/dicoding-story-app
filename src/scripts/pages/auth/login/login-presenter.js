class LoginPresenter {
    #view = null;
    #model = null;
    #authModel = null;

    constructor({ view, model, authModel }) {
        this.#view = view;
        this.#model = model;
        this.#authModel = authModel;
    }

    async getLogin({ email, password }) {
        this.#view.showSubmitLoadingButton();
        try {
            const response = await this.#model.login({ email, password });

            if (!response.ok) {
                console.error('getLogin: response:', response);
                this.#view.loginFailed(response.message);
                return;
            }

            if (!response.loginResult || !response.loginResult.token) {
                console.error('getLogin: error: Token tidak ditemukan dalam respons', response);
                this.#view.loginFailed('Token tidak ditemukan dalam respons');
                return;
            }

            this.#authModel.putAccessToken(response.loginResult.token);

            this.#view.loginSuccessfully(response.message, response.loginResult);
        } catch (error) {
            console.error('getLogin: error:', error);
            this.#view.loginFailed(error.message);
        } finally {
            this.#view.hideSubmitLoadingButton();
        }
    }
}

export default LoginPresenter;