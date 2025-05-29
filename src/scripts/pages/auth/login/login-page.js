import API from '../../../data/api';
import LoginPresenter from './login-presenter';
import * as Auth from '../../../utils/auth';

class LoginPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <div class="form-container">
          <h1 class="form-title">Masuk Akun</h1>
          
          <form id="login-form">
            <div class="form-group">
              <label for="email-input">Email</label>
              <input id="email-input" type="email" name="email" placeholder="Contoh: nama@email.com" required>
            </div>
            
            <div class="form-group">
              <label for="password-input">Password</label>
              <input id="password-input" type="password" name="password" placeholder="Masukkan password Anda" required>
            </div>
            
            <div class="form-group">
              <div id="submit-button-container">
                <button class="btn-primary" type="submit">Masuk</button>
              </div>
            </div>
            
            <div class="form-group text-center">
              <p>Belum punya akun? <a href="#/register">Daftar</a></p>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: API,
      authModel: Auth,
    });

    this.#setupForm();
  }

  #setupForm() {
    document.getElementById('login-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value,
      };

      await this.#presenter.getLogin(data);
    });
  }

  loginSuccessfully(message) {
    console.log(message);
    // Redirect
    location.hash = '/';
  }

  loginFailed(message) {
    alert(message);
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn-primary" type="submit" disabled>
        <span class="loading-spinner"></span>
        Masuk
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn-primary" type="submit">Masuk</button>
    `;
  }
}

export default LoginPage;