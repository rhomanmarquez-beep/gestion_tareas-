// 1. ESTADO: Cargar tareas guardadas o iniciar con un arreglo vacío
let tareas = JSON.parse(localStorage.getItem('MIS_TAREAS')) || [];
// 2. ELEMENTOS DEL DOM
const listaTareas = document.getElementById('listaTareas');
const mensajeVacio = document.getElementById('mensajeVacio');
const modalTarea = document.getElementById('modalTarea');
const formTarea = document.getElementById('formTarea');
const inputTitulo = document.getElementById('inputTitulo');
const tareaIdInput = document.getElementById('tareaId');
const modalImportar = document.getElementById('modalImportar');
const listaApi = document.getElementById('listaApi');
const buscador = document.getElementById('buscador');
const filtroEstado = document.getElementById('filtroEstado');

//  3. MOSTRAR TAREAS EN PANTALLA Y GUARDAR
function renderizarTareas() {
  listaTareas.innerHTML = '';

  if (tareas.length === 0) {
    mensajeVacio.style.display = 'block';
  } else {
    mensajeVacio.style.display = 'none';
  }

  tareas.forEach(tarea => {
    const li = document.createElement('li');
    li.className = `tarea-item ${tarea.completado ? 'completada' : ''}`;
    
    li.innerHTML = `
      <div>
        <input type="checkbox" ${tarea.completado ? 'checked' : ''} onclick="cambiarEstado('${tarea.id}')">
        <span>${tarea.titulo}</span>
        ${tarea.esImportada ? '<span class="badge">Importada</span>' : ''}
      </div>
      <div>
        ${!tarea.esImportada ? `<button class="btn secundario" onclick="prepararEdicion('${tarea.id}')">editar</button>` : ''}
        <button class="btn peligro" onclick="eliminarTarea('${tarea.id}')">eliminar</button>
      </div>
    `;
    listaTareas.appendChild(li);
  });

  // Guardar cambios en el navegador
  localStorage.setItem('MIS_TAREAS', JSON.stringify(tareas));
}

renderizarTareas();


function cambiarEstado(id) {
  const tarea = tareas.find(t => t.id === id);
  if (tarea) tarea.completado = !tarea.completado;
  renderizarTareas();
}


function eliminarTarea(id) {
  tareas = tareas.filter(t => t.id !== id);
  renderizarTareas();
}

formTarea.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = tareaIdInput.value;
  const titulo = inputTitulo.value.trim();

  if (id) {
    // Si tiene ID, estamos editando
    const tarea = tareas.find(t => t.id === id);
    if (tarea) tarea.titulo = titulo;
  } else {
    // Si no tiene ID, creamos una nueva
    tareas.push({
      id: 'task_' + Date.now(),
      titulo: titulo,
      fecha: new Date().toLocaleDateString(),
      completado: false,
      esImportada: false
    });
  }

  cerrarModal();
  renderizarTareas();
});

// Botón para abrir modal de nueva tarea
document.getElementById('btnNuevaTarea').addEventListener('click', () => {
  document.getElementById('tituloModal').innerText = 'Nueva Tarea';
  tareaIdInput.value = '';
  formTarea.reset();
  modalTarea.classList.remove('oculto');
});

// Preparar modal para editar
function prepararEdicion(id) {
  const tarea = tareas.find(t => t.id === id);
  if (!tarea || tarea.esImportada) return; 
  
  document.getElementById('tituloModal').innerText = 'Editar Tarea';
  tareaIdInput.value = tarea.id;
  inputTitulo.value = tarea.titulo;
  modalTarea.classList.remove('oculto');
}

function cerrarModal() { 
  modalTarea.classList.add('oculto'); 
}

document.getElementById('btnCerrarModal').addEventListener('click', cerrarModal);