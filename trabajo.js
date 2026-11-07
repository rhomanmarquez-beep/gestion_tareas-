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

