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
  'Clínica General': ['Dra. Laura Silva', 'Dr. Martín Ruiz'],
  'Cardiología': ['Dr. Federico Vega', 'Dra. Valeria Mendez'],
  'Pediatría': ['Dra. Sofía Torres', 'Dr. Nicolás Peña'],
  'Ginecología': ['Dra. Camila Ortega', 'Dr. Agustín Ríos'],
  'Traumatología': ['Dr. Emiliano Castro', 'Dra. Paula Benítez'],
  'Neurología': ['Dr. Leandro Funes', 'Dra. Ana Villalba']
};

function updateMedicos() {
  const especialidad = especialidadSelect.value;
  medicoSelect.innerHTML = '<option value="">Seleccione un médico</option>';
  if (!especialidad || !medicosPorEspecialidad[especialidad]) {
    medicoSelect.disabled = true;
    return;
  }
  medicosPorEspecialidad[especialidad].forEach((medico) => {
    const option = document.createElement('option');
    option.value = medico;
    option.textContent = medico;
    medicoSelect.appendChild(option);
  });
  medicoSelect.disabled = false;
}

function toggleConditionalFields() {
  const modalidad = modalidadSelect.value;
  plataformaGroup.style.display = modalidad === 'Videoconsulta' ? 'block' : 'none';

  const cobertura = coberturaSelect.value;
  const coberturaEsParticular = cobertura === 'Particular';
  credencialGroup.style.display = coberturaEsParticular ? 'none' : 'block';
  planGroup.style.display = coberturaEsParticular ? 'none' : 'block';

  comoNosConocioGroup.style.display = primeraVisitaCheck.checked ? 'block' : 'none';
  descripcionEstudiosGroup.style.display = estudiosPreviosCheck.checked ? 'block' : 'none';
}

if (especialidadSelect) {
  especialidadSelect.addEventListener('change', updateMedicos);
}
if (modalidadSelect) {
  modalidadSelect.addEventListener('change', toggleConditionalFields);
}
if (coberturaSelect) {
  coberturaSelect.addEventListener('change', toggleConditionalFields);
}
if (primeraVisitaCheck) {
  primeraVisitaCheck.addEventListener('change', toggleConditionalFields);
}
if (estudiosPreviosCheck) {
  estudiosPreviosCheck.addEventListener('change', toggleConditionalFields);
}

if (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const especialidad = especialidadSelect.value;
    const medico = medicoSelect.value;
    const fechaTurno = document.getElementById('fechaTurno').value;

    if (!nombre || !apellido || !email || !especialidad || !medico || !fechaTurno) {
      status.textContent = 'Complete los campos obligatorios del formulario.';
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      status.textContent = 'Ingrese un correo electrónico válido.';
      return;
    }

    status.textContent = `Solicitud enviada para ${nombre} ${apellido}. Nos contactaremos pronto.`;
    form.reset();
    updateMedicos();
    toggleConditionalFields();
  });

  form.addEventListener('reset', function () {
    setTimeout(() => {
      medicoSelect.disabled = true;
      toggleConditionalFields();
    }, 0);
  });
}

updateMedicos();
toggleConditionalFields();
