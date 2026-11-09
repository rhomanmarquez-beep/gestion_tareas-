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

// Actualizamos la función de renderizado para soportar filtros y búsqueda
function renderizarTareas() {
  listaTareas.innerHTML = '';
  
  const textoBuscador = buscador.value.toLowerCase();
  const estadoFiltro = filtroEstado.value;

  // Filtrar tareas por texto y estado
  const tareasFiltradas = tareas.filter(t => {
    const coincideTexto = t.titulo.toLowerCase().includes(textoBuscador);
    const coincideEstado = 
      estadoFiltro === 'todas' ? true :
      estadoFiltro === 'completadas' ? t.completado :
      !t.completado;
    return coincideTexto && coincideEstado;
  });

  if (tareasFiltradas.length === 0) {
    mensajeVacio.style.display = 'block';
  } else {
    mensajeVacio.style.display = 'none';
  }

  tareasFiltradas.forEach(tarea => {
    const li = document.createElement('li');
    li.className = `tarea-item ${tarea.completado ? 'completada' : ''}`;
    
    li.innerHTML = `
      <div>
        <input type="checkbox" ${tarea.completado ? 'checked' : ''} onclick="cambiarEstado('${tarea.id}')">
        <span>${tarea.titulo}</span>
        ${tarea.esImportada ? '<span class="badge">Importada</span>' : ''}
      </div>
      <div>
        ${!tarea.esImportada ? `<button class="btn secundario" onclick="prepararEdicion('${tarea.id}')">✏️</button>` : ''}
        <button class="btn peligro" onclick="eliminarTarea('${tarea.id}')">🗑️</button>
      </div>
    `;
    listaTareas.appendChild(li);
  });

  localStorage.setItem('MIS_TAREAS', JSON.stringify(tareas));
}

buscador.addEventListener('input', renderizarTareas);
filtroEstado.addEventListener('change', renderizarTareas);

//  IMPORTAR DESDE LA API
document.getElementById('btnAbrirImportar').addEventListener('click', async () => {
  modalImportar.classList.remove('oculto');
  listaApi.innerHTML = 'Cargando tareas de Internet...';

  try {
    const respuesta = await fetch('https://jsonplaceholder.typicode.com/todos');
    const datos = await respuesta.json();
    
    listaApi.innerHTML = '';
    datos.forEach(item => {
      const div = document.createElement('div');
      div.innerHTML = `
        <label>
          <input type="checkbox" data-id="${item.id}" data-titulo="${item.title}">
          ${item.title}
        </label>
      `;
      listaApi.appendChild(div);
    });
  } catch (error) {
    listaApi.innerHTML = 'Ocurrió un error al cargar la API.';
  }
});

document.getElementById('btnGuardarImportadas').addEventListener('click', () => {
  const checkboxes = listaApi.querySelectorAll('input[type="checkbox"]:checked');
  checkboxes.forEach(chk => {
    tareas.push({
      id: 'task_imp_' + chk.dataset.id,
      titulo: chk.dataset.titulo,
      fecha: new Date().toLocaleDateString(),
      completado: false,
      esImportada: true 
    });
  });
  modalImportar.classList.add('oculto');
  renderizarTareas();
});

document.getElementById('btnCerrarImportar').addEventListener('click', () => {
  modalImportar.classList.add('oculto');
});