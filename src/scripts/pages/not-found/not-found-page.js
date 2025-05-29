class NotFoundPage {
    async render() {
        return `
      <section class="container">
        <div class="not-found-container">
          <img src="images/not-found-image.png" alt="Halaman tidak ditemukan" class="not-found-image">
          <h2>Halaman Tidak Ditemukan</h2>
          <p>Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dihapus.</p>
          <a href="#/" class="btn">Kembali ke Beranda</a>
        </div>
      </section>
    `;
    }

    async afterRender() {
    }
}

export default NotFoundPage;