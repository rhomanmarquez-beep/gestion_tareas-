class TareaItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const id = this.getAttribute('data-id');
    const titulo = this.getAttribute('data-titulo');
    const descripcion = this.getAttribute('data-descripcion') || '';
    const fecha = this.getAttribute('data-fecha') || new Date().toLocaleDateString();
    const completado = this.getAttribute('data-completado') === 'true';
    const esImportada = this.getAttribute('data-importada') === 'true';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 8px;
        }
        .tarea-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-radius: 10px;
          background-color: #ffffff;
          border: 1.5px solid #f1f5f9;
          border-left: 5px solid #0ea5e9;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        .tarea-item.completada {
          border-left-color: #10b981;
          background: #f8fafc;
          opacity: 0.65;
        }
        .tarea-item.completada span.titulo {
          text-decoration: line-through;
          color: #64748b;
        }
        .info-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        .linea-principal {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .titulo {
          font-weight: 600;
          color: #1e293b;
        }
        .descripcion {
          font-size: 0.85rem;
          color: #64748b;
          margin-left: 24px;
        }
        .badge {
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          color: white;
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: 20px;
          font-weight: 700;
        }
        .fecha {
          font-size: 0.8rem;
          color: #64748b;
        }
        .acciones {
          display: flex;
          gap: 6px;
        }
        .btn {
          cursor: pointer;
          border: none;
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 0.9rem;
        }
        .secundario { background-color: #f1f5f9; }
        .peligro { background-color: #fee2e2; color: #dc2626; }
      </style>
      
      <div class="tarea-item ${completado ? 'completada' : ''}">
        <div class="info-container">
          <div class="linea-principal">
            <input type="checkbox" class="chk-estado" ${completado ? 'checked' : ''}>
            <span class="titulo">${titulo}</span>
            <span class="fecha">(${fecha})</span>
            ${esImportada ? '<span class="badge">Importada</span>' : ''}
          </div>
          ${descripcion ? `<div class="descripcion">${descripcion}</div>` : ''}
        </div>
        <div class="acciones">
          ${!esImportada ? `<button class="btn secundario btn-editar" title="Editar">✏️</button>` : ''}
          <button class="btn peligro btn-eliminar" title="Eliminar">🗑️</button>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.chk-estado').addEventListener('change', () => {
      cambiarEstado(id);
    });

    const btnEditar = this.shadowRoot.querySelector('.btn-editar');
    if (btnEditar) {
      btnEditar.addEventListener('click', () => prepararEdicion(id));
    }

    this.shadowRoot.querySelector('.btn-eliminar').addEventListener('click', () => {
      eliminarTarea(id);
    });
  }
}

customElements.define('tarea-item', TareaItem);

// 1. ESTADO
let tareas = JSON.parse(localStorage.getItem('MIS_TAREAS')) || [];
let tareasApiGlobal = [];

// 2. ELEMENTOS DEL DOM
const listaTareas = document.getElementById('listaTareas');
const mensajeVacio = document.getElementById('mensajeVacio');
const modalTarea = document.getElementById('modalTarea');
const formTarea = document.getElementById('formTarea');
const inputTitulo = document.getElementById('inputTitulo');
const inputDescripcion = document.getElementById('inputDescripcion');
const tareaIdInput = document.getElementById('tareaId');
const modalImportar = document.getElementById('modalImportar');
const listaApi = document.getElementById('listaApi');
const buscador = document.getElementById('buscador');
const filtroEstado = document.getElementById('filtroEstado');

// 3. RENDERIZAR TAREAS
function renderizarTareas() {
  listaTareas.innerHTML = '';

  const textoBuscador = buscador.value.toLowerCase();
  const estadoFiltro = filtroEstado.value;

  const tareasFiltradas = tareas.filter(t => {
    const coincideTexto = t.titulo.toLowerCase().includes(textoBuscador) || 
                          (t.descripcion && t.descripcion.toLowerCase().includes(textoBuscador));
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
    const item = document.createElement('tarea-item');
    item.setAttribute('data-id', tarea.id);
    item.setAttribute('data-titulo', tarea.titulo);
    item.setAttribute('data-descripcion', tarea.descripcion || '');
    item.setAttribute('data-fecha', tarea.fecha || new Date().toLocaleDateString());
    item.setAttribute('data-completado', tarea.completado);
    item.setAttribute('data-importada', tarea.esImportada || false);

    listaTareas.appendChild(item);
  });

  localStorage.setItem('MIS_TAREAS', JSON.stringify(tareas));
}

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
  const descripcion = inputDescripcion ? inputDescripcion.value.trim() : '';

  if (id) {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
      tarea.titulo = titulo;
      tarea.descripcion = descripcion;
    }
  } else {
    tareas.push({
      id: 'task_' + Date.now(),
      titulo: titulo,
      descripcion: descripcion,
      fecha: new Date().toLocaleDateString(),
      completado: false,
      esImportada: false
    });
  }

  cerrarModal();
  renderizarTareas();
});

document.getElementById('btnNuevaTarea').addEventListener('click', () => {
  document.getElementById('tituloModal').innerText = 'Nueva Tarea';
  tareaIdInput.value = '';
  formTarea.reset();
  modalTarea.classList.remove('oculto');
});

function prepararEdicion(id) {
  const tarea = tareas.find(t => t.id === id);
  if (!tarea || tarea.esImportada) return; 
  
  document.getElementById('tituloModal').innerText = 'Editar Tarea';
  tareaIdInput.value = tarea.id;
  inputTitulo.value = tarea.titulo;
  if(inputDescripcion) inputDescripcion.value = tarea.descripcion || '';
  modalTarea.classList.remove('oculto');
}

function cerrarModal() { 
  modalTarea.classList.add('oculto'); 
}

document.getElementById('btnCerrarModal').addEventListener('click', cerrarModal);

buscador.addEventListener('input', renderizarTareas);
filtroEstado.addEventListener('change', renderizarTareas);

// 4. IMPORTAR DESDE API
document.getElementById('btnAbrirImportar').addEventListener('click', async () => {
  modalImportar.classList.remove('oculto');
  listaApi.innerHTML = '<p style="padding: 20px; text-align: center;">Cargando banco de tareas desde la API...</p>';

  try {
    const respuesta = await fetch('https://jsonplaceholder.typicode.com/todos');
    if (!respuesta.ok) throw new Error('Error al conectar con la API');
    
    tareasApiGlobal = await respuesta.json();
    mostrarTareasApiEnModal(tareasApiGlobal);

  } catch (error) {
    listaApi.innerHTML = '<p style="color: red; padding: 20px; text-align: center;">Ocurrió un error al cargar la API. Verifica tu conexión.</p>';
  }
});

function mostrarTareasApiEnModal(datos) {
  listaApi.innerHTML = '';
  
  const contenedorScroll = document.createElement('div');
  contenedorScroll.style.maxHeight = '300px';
  contenedorScroll.style.overflowY = 'auto';
  contenedorScroll.style.border = '1px solid #ddd';
  contenedorScroll.style.padding = '10px';
  contenedorScroll.style.borderRadius = '4px';

  const inputFiltroApi = document.createElement('input');
  inputFiltroApi.type = 'text';
  inputFiltroApi.placeholder = 'Buscar en la API...';
  inputFiltroApi.style.width = '100%';
  inputFiltroApi.style.marginBottom = '10px';
  inputFiltroApi.style.padding = '8px';
  inputFiltroApi.style.boxSizing = 'border-box';

  const renderListaInterna = (items) => {
    contenedorScroll.innerHTML = '';
    items.forEach(item => {
      const div = document.createElement('div');
      div.style.padding = '6px 0';
      div.style.borderBottom = '1px solid #eee';
      div.innerHTML = `
        <label style="cursor: pointer; display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" data-id="${item.id}" data-titulo="${item.title}">
          <span>[ID: ${item.id}] ${item.title}</span>
        </label>
      `;
      contenedorScroll.appendChild(div);
    });
  };

  inputFiltroApi.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = tareasApiGlobal.filter(t => t.title.toLowerCase().includes(texto));
    renderListaInterna(filtrados);
  });

  renderListaInterna(datos);

  listaApi.appendChild(inputFiltroApi);
  listaApi.appendChild(contenedorScroll);
}

document.getElementById('btnGuardarImportadas').addEventListener('click', () => {
  const checkboxes = listaApi.querySelectorAll('input[type="checkbox"]:checked');
  if (checkboxes.length === 0) {
    alert('Por favor selecciona al menos una tarea para importar.');
    return;
  }

  checkboxes.forEach(chk => {
    tareas.push({
      id: 'task_imp_' + chk.dataset.id,
      titulo: chk.dataset.titulo,
      descripcion: 'Importado de API externa',
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

// 5. ACCIONES GLOBALES
document.getElementById('btnMarcarTodas').addEventListener('click', () => {
  tareas.forEach(t => t.completado = true);
  renderizarTareas();
});

document.getElementById('btnVaciar').addEventListener('click', () => {
  if (confirm('¿Estás seguro de vaciar toda la lista?')) {
    tareas = [];
    renderizarTareas();
  }
});

renderizarTareas();