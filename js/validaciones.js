const form = document.getElementById('turnoForm');
const status = document.getElementById('status');
const especialidadSelect = document.getElementById('especialidad');
const medicoSelect = document.getElementById('medico');
const modalidadSelect = document.getElementById('modalidad');
const plataformaGroup = document.getElementById('plataformaGroup');
const coberturaSelect = document.getElementById('cobertura');
const credencialGroup = document.getElementById('credencialGroup');
const planGroup = document.getElementById('planGroup');
const primeraVisitaCheck = document.getElementById('primeraVisita');
const comoNosConocioGroup = document.getElementById('comoNosConocioGroup');
const estudiosPreviosCheck = document.getElementById('estudiosPrevios');
const descripcionEstudiosGroup = document.getElementById('descripcionEstudiosGroup');

const medicosPorEspecialidad = {
  clinica: ['Dr. Gomez, Carlos', 'Dra. Lopez, Maria'],
  cardiologia: ['Dr. Perez, Juan', 'Dra. Torres, Ana'],
  pediatria: ['Dra. Diaz, Laura', 'Dr. Soto, Pablo'],
  ginecologia: ['Dra. Romero, Valeria', 'Dra. Castro, Elena'],
  traumatologia: ['Dr. Ramos, Sergio', 'Dr. Herrera, Diego'],
  neurologia: ['Dr. Molina, Andres', 'Dra. Vargas, Cecilia']
};

const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(?=(?:.*\d){8,})[\d+\-\s()]{8,}$/;
const credentialRegex = /^[A-Za-z0-9]{5,}$/;

function wrapFormFields() {
  document.querySelectorAll('#turnoForm fieldset input:not([type="checkbox"]), #turnoForm fieldset select, #turnoForm fieldset textarea').forEach((field) => {
    if (field.parentElement.classList.contains('field-group')) return;
    const label = field.previousElementSibling;
    if (label && label.tagName === 'LABEL') {
      const wrapper = document.createElement('div');
      wrapper.className = 'field-group';
      label.parentNode.insertBefore(wrapper, label);
      wrapper.appendChild(label);
      wrapper.appendChild(field);
    }
  });
}

function setFieldState(field, isValid, message) {
  const parent = field.closest('div') || field.parentElement;
  const errorNode = parent.querySelector('.mensaje-error') || document.createElement('div');
  errorNode.className = 'mensaje-error';
  if (message) {
    errorNode.textContent = message;
    field.classList.add('campo-error');
    field.classList.remove('campo-ok');
  } else {
    errorNode.textContent = '';
    field.classList.remove('campo-error');
    field.classList.add('campo-ok');
  }
  if (!parent.querySelector('.mensaje-error')) {
    parent.appendChild(errorNode);
  }
  if (field.type === 'checkbox') {
    field.closest('label').classList.toggle('campo-error', !!message);
    field.closest('label').classList.toggle('campo-ok', !message && field.checked);
  }
}

function clearFieldState(field) {
  field.classList.remove('campo-error', 'campo-ok');
  const parent = field.closest('div') || field.parentElement;
  const msg = parent.querySelector('.mensaje-error');
  if (msg) msg.remove();
  if (field.type === 'checkbox') {
    field.closest('label').classList.remove('campo-error', 'campo-ok');
  }
}

function validateName(field) {
  const value = field.value.trim();
  if (!value) return 'Este campo es obligatorio.';
  if (!nameRegex.test(value)) return 'Solo se permiten letras y espacios.';
  return '';
}

function validateDni(field) {
  const value = field.value.trim();
  if (!value) return 'El DNI es obligatorio.';
  if (!/^\d{7,8}$/.test(value)) return 'Debe tener entre 7 y 8 dígitos numéricos.';
  return '';
}

function validateEmail(field) {
  const value = field.value.trim();
  if (!value) return 'El correo es obligatorio.';
  if (!emailRegex.test(value)) return 'Formato de correo inválido.';
  return '';
}

function validatePhone(field) {
  const value = field.value.trim();
  if (!value) return 'El teléfono es obligatorio.';
  if (!phoneRegex.test(value)) return 'Formato de teléfono inválido.';
  return '';
}

function validateBirthDate(field) {
  const value = field.value;
  if (!value) return 'La fecha de nacimiento es obligatoria.';
  const birth = new Date(value);
  const today = new Date();
  if (birth > today) return 'La fecha de nacimiento no puede ser futura.';
  const age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  const ageAdjusted = m < 0 || (m === 0 && today.getDate() < birth.getDate()) ? age - 1 : age;
  if (ageAdjusted < 0 || ageAdjusted > 120) return 'La edad debe estar entre 0 y 120 años.';
  return '';
}

function validateSelect(field, labelText) {
  if (!field.value) return `Seleccione una ${labelText.toLowerCase()}.`;
  return '';
}

function validateAppointmentDate(field) {
  if (!field.value) return 'La fecha del turno es obligatoria.';
  const selectedDate = new Date(field.value + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 1);
  if (selectedDate < minDate) return 'Debe haber al menos 24 horas de anticipación.';
  if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) return 'Los turnos deben ser de lunes a viernes.';
  return '';
}

function validateTime(field) {
  if (!field.value) return 'La hora del turno es obligatoria.';
  const [hours, minutes] = field.value.split(':').map(Number);
  const timeValue = hours * 60 + minutes;
  const start = 8 * 60;
  const end = 20 * 60;
  if (timeValue < start || timeValue > end) return 'La hora debe estar entre 08:00 y 20:00.';
  return '';
}

function validatePlatform(field) {
  if (modalidadSelect.value === 'Videoconsulta' && !field.value) return 'Seleccione una plataforma para videoconsulta.';
  return '';
}

function validateCredential(field) {
  if (coberturaSelect.value === 'Particular') return '';
  if (!field.value.trim()) return 'El número de credencial es obligatorio para esta cobertura.';
  if (!credentialRegex.test(field.value.trim())) return 'Debe tener al menos 5 caracteres alfanuméricos.';
  return '';
}

function validatePlan(field) {
  if (coberturaSelect.value === 'Particular') return '';
  if (!field.value.trim()) return 'El plan es obligatorio para esta cobertura.';
  return '';
}

function validateReason(field) {
  if (!field.value.trim()) return 'El motivo de la consulta es obligatorio.';
  if (field.value.trim().length < 20) return 'Debe escribir al menos 20 caracteres.';
  return '';
}

function validateStudyDescription(field) {
  if (!estudiosPreviosCheck.checked) return '';
  if (!field.value.trim()) return 'La descripción de estudios es obligatoria.';
  if (field.value.trim().length < 20) return 'Debe escribir al menos 20 caracteres.';
  return '';
}

function validateHowHeard(field) {
  if (!primeraVisitaCheck.checked) return '';
  if (!field.value) return 'Seleccione cómo nos conoció.';
  return '';
}

function updateMedicos() {
  const key = especialidadSelect.value;
  medicoSelect.innerHTML = '<option value="">Seleccione un médico</option>';
  if (!key || !medicosPorEspecialidad[key]) {
    medicoSelect.disabled = true;
    return;
  }
  medicosPorEspecialidad[key].forEach((medico) => {
    const option = document.createElement('option');
    option.value = medico;
    option.textContent = medico;
    medicoSelect.appendChild(option);
  });
  medicoSelect.disabled = false;
}

function toggleConditionalFields() {
  const showPlatform = modalidadSelect.value === 'Videoconsulta';
  plataformaGroup.style.display = showPlatform ? 'block' : 'none';

  const showCoverageFields = coberturaSelect.value !== 'Particular';
  credencialGroup.style.display = showCoverageFields ? 'block' : 'none';
  planGroup.style.display = showCoverageFields ? 'block' : 'none';

  comoNosConocioGroup.style.display = primeraVisitaCheck.checked ? 'block' : 'none';
  descripcionEstudiosGroup.style.display = estudiosPreviosCheck.checked ? 'block' : 'none';
}

function validateForm() {
  const fieldsToValidate = [
    { field: document.getElementById('nombre'), validator: validateName },
    { field: document.getElementById('apellido'), validator: validateName },
    { field: document.getElementById('dni'), validator: validateDni },
    { field: document.getElementById('email'), validator: validateEmail },
    { field: document.getElementById('telefono'), validator: validatePhone },
    { field: document.getElementById('fechaNacimiento'), validator: validateBirthDate },
    { field: especialidadSelect, validator: (input) => validateSelect(input, 'Especialidad') },
    { field: medicoSelect, validator: (input) => (!medicoSelect.disabled && input.value ? '' : 'Seleccione un médico.') },
    { field: document.getElementById('tipoConsulta'), validator: (input) => validateSelect(input, 'Tipo de consulta') },
    { field: document.getElementById('fechaTurno'), validator: validateAppointmentDate },
    { field: document.getElementById('horaTurno'), validator: validateTime },
    { field: modalidadSelect, validator: (input) => validateSelect(input, 'Modalidad') },
    { field: document.getElementById('plataforma'), validator: validatePlatform },
    { field: coberturaSelect, validator: (input) => validateSelect(input, 'Cobertura') },
    { field: document.getElementById('numeroCredencial'), validator: validateCredential },
    { field: document.getElementById('plan'), validator: validatePlan },
    { field: document.getElementById('comoNosConocio'), validator: validateHowHeard },
    { field: document.getElementById('motivoConsulta'), validator: validateReason },
    { field: document.getElementById('descripcionEstudios'), validator: validateStudyDescription }
  ];

  let firstInvalid = null;
  fieldsToValidate.forEach(({ field, validator }) => {
    clearFieldState(field);
    const message = validator(field);
    if (message) {
      setFieldState(field, false, message);
      if (!firstInvalid) firstInvalid = field;
    } else {
      setFieldState(field, true, '');
    }
  });

  return { valid: !fieldsToValidate.some(({ field, validator }) => validator(field)), firstInvalid };
}

if (especialidadSelect) {
  especialidadSelect.addEventListener('change', () => {
    updateMedicos();
    clearFieldState(medicoSelect);
  });
}
if (modalidadSelect) {
  modalidadSelect.addEventListener('change', () => {
    toggleConditionalFields();
    clearFieldState(document.getElementById('plataforma'));
  });
}
if (coberturaSelect) {
  coberturaSelect.addEventListener('change', () => {
    toggleConditionalFields();
    clearFieldState(document.getElementById('numeroCredencial'));
    clearFieldState(document.getElementById('plan'));
  });
}
if (primeraVisitaCheck) {
  primeraVisitaCheck.addEventListener('change', () => {
    toggleConditionalFields();
    clearFieldState(document.getElementById('comoNosConocio'));
  });
}
if (estudiosPreviosCheck) {
  estudiosPreviosCheck.addEventListener('change', () => {
    toggleConditionalFields();
    clearFieldState(document.getElementById('descripcionEstudios'));
  });
}

['nombre', 'apellido', 'dni', 'email', 'telefono', 'fechaNacimiento', 'tipoConsulta', 'fechaTurno', 'horaTurno', 'modalidad', 'plataforma', 'cobertura', 'numeroCredencial', 'plan', 'comoNosConocio', 'motivoConsulta', 'descripcionEstudios'].forEach((id) => {
  const field = document.getElementById(id);
  if (field) {
    field.addEventListener('input', () => {
      const validator = {
        nombre: validateName,
        apellido: validateName,
        dni: validateDni,
        email: validateEmail,
        telefono: validatePhone,
        fechaNacimiento: validateBirthDate,
        tipoConsulta: (input) => validateSelect(input, 'Tipo de consulta'),
        fechaTurno: validateAppointmentDate,
        horaTurno: validateTime,
        modalidad: (input) => validateSelect(input, 'Modalidad'),
        plataforma: validatePlatform,
        cobertura: (input) => validateSelect(input, 'Cobertura'),
        numeroCredencial: validateCredential,
        plan: validatePlan,
        comoNosConocio: validateHowHeard,
        motivoConsulta: validateReason,
        descripcionEstudios: validateStudyDescription
      }[id];
      const message = validator ? validator(field) : '';
      if (message) setFieldState(field, false, message); else setFieldState(field, true, '');
    });
  }
});

wrapFormFields();

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = validateForm();
    if (!result.valid) {
      status.textContent = 'Revise los campos marcados en rojo.';
      result.firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const nombre = document.getElementById('nombre').value.trim();
    const especialidad = especialidadSelect.options[especialidadSelect.selectedIndex]?.text || '';
    const fechaTurno = document.getElementById('fechaTurno').value;
    const horaTurno = document.getElementById('horaTurno').value;
    const turno = `TURN-${String(Math.floor(Math.random() * 90000) + 10000)}`;
    status.textContent = `Turno confirmado para ${nombre} | Especialidad: ${especialidad} | Fecha: ${fechaTurno} | Hora: ${horaTurno} | ${turno}`;
    form.reset();
    updateMedicos();
    toggleConditionalFields();
  });

  form.addEventListener('reset', () => {
    setTimeout(() => {
      medicoSelect.disabled = true;
      document.querySelectorAll('.mensaje-error').forEach((node) => node.remove());
      document.querySelectorAll('.campo-error, .campo-ok').forEach((node) => node.classList.remove('campo-error', 'campo-ok'));
      status.textContent = '';
      toggleConditionalFields();
    }, 0);
  });
}

updateMedicos();
toggleConditionalFields();
