const form = document.getElementById('turnoForm');
const status = document.getElementById('status');

if (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const especialidad = document.getElementById('especialidad').value;
    const fecha = document.getElementById('fecha').value.trim();

    if (!nombre || !email || !especialidad || !fecha) {
      status.textContent = 'Complete todos los campos obligatorios.';
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      status.textContent = 'Ingrese un email válido.';
      return;
    }

    status.textContent = `Solicitud enviada para ${nombre}. Nos contactaremos pronto.`;
    form.reset();
  });
}
