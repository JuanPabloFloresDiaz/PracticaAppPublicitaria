import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

/**
 * Muestra una alerta modal con SweetAlert2.
 * @param {Object} options - Configuración de la alerta.
 * @param {boolean} options.status - Estado de la alerta (true para éxito, false para error).
 * @param {string} options.message - Mensaje a mostrar en la alerta.
 */
export const showAlert = ({ status, message }) => {
  Swal.fire({
    title: status ? '¡Éxito!' : 'Oops...',
    text: message,
    icon: status ? 'success' : 'error',
    confirmButtonColor: status ? '#4CAF50' : '#F44336',
    background: '#ffffff',
    color: '#333333',
    customClass: {
      popup: 'rounded-xl shadow-lg border border-gray-200',
    },
  });
};

/**
 * Muestra una notificación tipo toast con SweetAlert2.
 * @param {Object} options - Configuración del toast.
 * @param {string} options.icon - Icono de la notificación ('success', 'error', 'warning', 'info').
 * @param {string} options.title - Título del toast.
 * @param {number} [options.timer=3500] - Duración del toast en milisegundos.
 */
export const fireToast = ({ icon, title, timer = 3500 }) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    background: '#ffffff',
    color: '#333333',
    customClass: {
      popup: 'rounded-xl shadow-md border border-gray-200',
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
  
  Toast.fire({ icon, title });
};
