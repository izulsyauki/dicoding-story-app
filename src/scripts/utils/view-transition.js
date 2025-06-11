/**
 * Utilitas untuk menangani View Transition API
 */

const ViewTransition = {
  /**
   * Menerapkan transisi halaman dengan View Transition API
   * @param {Function} updateCallback - Fungsi yang akan dijalankan saat transisi
   */
  apply: async (updateCallback) => {
    // Periksa apakah browser mendukung View Transition API
    if (!document.startViewTransition) {
      // Jika tidak mendukung, jalankan callback langsung
      updateCallback();
      return;
    }

    try {
      // Jalankan transisi dengan View Transition API
      const transition = document.startViewTransition(() => {
        // Jalankan callback untuk memperbarui DOM
        updateCallback();
      });

      // Tunggu hingga transisi selesai
      await transition.finished;
    } catch (error) {
      console.error('Error saat menerapkan transisi:', error);

      updateCallback();
    }
  }
};

export default ViewTransition;