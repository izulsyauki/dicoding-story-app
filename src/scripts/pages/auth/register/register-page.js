import API from '../../../data/api';
import RegisterPresenter from './register-presenter';

class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <div class="form-container">
          <h1 class="form-title">Daftar Akun</h1>
          
          <form id="register-form">
            <div class="form-group">
              <label for="name-input">Nama Lengkap</label>
              <input id="name-input" type="text" name="name" placeholder="Masukkan nama lengkap Anda" required>
            </div>
            
            <div class="form-group">
              <label for="email-input">Email</label>
              <input id="email-input" type="email" name="email" placeholder="Contoh: nama@email.com" required>
            </div>
            
            <div class="form-group">
              <label for="password-input">Password</label>
              <input id="password-input" type="password" name="password" placeholder="Masukkan password baru" minlength="8" required>
            </div>
            
            <div class="form-group">
              <div id="submit-button-container">
                <button class="btn-primary" type="submit">Daftar Akun</button>
              </div>
            </div>
            
            <div class="form-group text-center">
              <p>Sudah punya akun? <a href="#/login">Masuk</a></p>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: API,
    });

    this.#setupForm();
  }

  #setupForm() {
    document.getElementById('register-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        name: document.getElementById('name-input').value,
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value,
      };

      await this.#presenter.getRegistered(data);
    });
  }

  registeredSuccessfully(message) {
    console.log(message);
    // Redirect
    location.hash = '/login';
  }

  registeredFailed(message) {
    alert(message);
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
     <button class="btn-primary" type="submit" disabled>
        <span class="loading-spinner"></span>
        Daftar Akun
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn-primary" type="submit">Daftar Akun</button>
    `;
  }
}

export default RegisterPage;