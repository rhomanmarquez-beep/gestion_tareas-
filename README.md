#  Gestor de Tareas Web App (`ProyectoTareas_JavaScript_ApellidoNombre`)

¡Bienvenido al **Gestor de Tareas**! Esta es una aplicación web interactiva, moderna y *responsive* diseñada para administrar tareas personales e importar datos remotos mediante el consumo de una API REST pública. La aplicación hace uso del stack nativo de tecnologías web (**HTML5, CSS3, JavaScript ES6+**) e incorpora conceptos avanzados de desarrollo frontend como **Web Components** encapsulados con **Shadow DOM** y almacenamiento persistente local.

---

##  Descripción General del Proyecto

La aplicación permite centralizar y optimizar la gestión de pendientes del usuario a través de una interfaz limpia e intuitiva. Ofrece capacidades para registrar tareas locales, visualizar estados de avance (completadas/pendientes), filtrar o buscar registros específicos, editar tareas existentes e importar conjuntos de datos externos desde un servidor.

###  Características Principales

*   **Gestión Completa de Tareas (CRUD):** Creación, lectura, actualización y eliminación de tareas.
*   **Encapsulamiento con Web Components:** Implementación de un elemento personalizado `<tarea-item>` utilizando `Shadow DOM` e inserción dinámica de estilos CSS independientes.
*   **Integración con API Externa:** Conexión asíncrona (`fetch`, `async/await`) a `https://jsonplaceholder.typicode.com/todos` para la búsqueda e importación de tareas.
*   **Persistencia Local:** Guardado de información mediante la API `localStorage` del navegador en formato JSON, manteniendo el estado de la aplicación tras recargar la página.
*   **Filtrado y Buscador en Tiempo Real:** Filtro rápido por texto en títulos/descripciones y por estado de la tarea (Todas, Pendientes, Completadas).
*   **Acciones Masivas:** Botón para marcar todas las tareas como completadas e opción para vaciar la lista completa previa confirmación del usuario.
*   **Inmutable para Importadas:** Las tareas importadas desde la API cuentan con una distinción visual (badge) y restringen la edición, permitiendo únicamente su eliminación.

---

##  Diseño y Wireframes (UI/UX)

La arquitectura visual de la aplicación se estructuró a partir de wireframes conceptuales orientados a garantizar una **Experiencia de Usuario (UX)** clara, directa y libre de distracciones.

### Esquema Conceptual de Pantallas

1.  **Vista Principal (`pricipal.html`):**
    *   **Encabezado:** Título representativo de la aplicación.
    *   **Barra de Acciones Globales:** Botones de *Nueva Tarea*, *Importar de la API*, *Marcar todas completas* y *Vaciar todo*.
    *   **Barra de Filtros:** Buscador por palabra clave (`<input type="text">`) y selector de estado (`<select>`).
    *   **Contenedor Principal:** Lista dinámica donde se inyectan los Custom Elements `<tarea-item>`.

2.  **Modales Interactivos:**
    *   **Modal Formulario de Tarea (`#modalTarea`):** Capa emergente con formulario para ingreso/edición de datos (título y descripción opcional).
    *   **Modal de Importación API (`#modalImportar`):** Interfaz con buscador interno que lista tareas provenientes de JSONPlaceholder con checkboxes de selección múltiple.

---

##  Estructura del Proyecto

El repositorio está organizado con la siguiente estructura de archivos:

```text
ProyectoTareas_JavaScript_ApellidoNombre/
│
├── inicio-pagina.html   # Landpage inicial de presentación del servicio
├── registro.html        # Pantalla de registro de usuario
├── login.html           # Pantalla de inicio de sesión
├── pricipal.html        # Panel / Aplicación principal de gestión de tareas
├── estilo.css           # Hoja de estilos global, temas de UI y modales
├── trabajo.js           # Lógica JavaScript, Web Component, API y LocalStorage
└── README.md            # Documentación general del proyecto
```

---

##  Descripción de la Lógica Implementada

### 1. Web Components y Shadow DOM (`trabajo.js`)
Se definió la clase `TareaItem` extendida de `HTMLElement` registrada mediante `customElements.define('tarea-item', TareaItem)`.
*   **Encapsulamiento:** Utiliza `this.attachShadow({ mode: 'open' })` para encapsular tanto la estructura HTML interna como sus reglas CSS de diseño.
*   **Atributos y Reactividad:** Recibe datos dinámicamente mediante atributos HTML (`data-id`, `data-titulo`, `data-descripcion`, `data-fecha`, `data-completado`, `data-importada`).
*   **Eventos:** Captura de interacción directa dentro del Shadow DOM enviando las acciones hacia los métodos globales (`cambiarEstado`, `prepararEdicion`, `eliminarTarea`).

### 2. Estándar de Identificadores Únicos
Para evitar colisiones entre registros locales y elementos remotos, se definió el siguiente esquema de IDs:
*   **Tareas Creadas por Usuario:** Prefix `task_` unido a una marca de tiempo UNIX (`task_1700000000000`).
*   **Tareas Importadas de API:** Prefix `task_imp_` unido al ID original proveniente de la API JSONPlaceholder (`task_imp_15`).

### 3. Integración con la API Remota (`JSONPlaceholder`)
*   Se realiza una petición HTTP `GET` asíncrona mediante la API `fetch` hacia `https://jsonplaceholder.typicode.com/todos`.
*   **Manejo de Errores:** Implementación de bloque `try...catch` con validación de respuesta HTTP OK (`respuesta.ok`) y retroalimentación en la interfaz gráfica en caso de pérdida de conexión o falla del servidor.
*   Filtro interno dentro del modal de importación para previsualizar y filtrar tareas antes de guardarlas localmente.

### 4. Persistencia de Datos (`LocalStorage`)
*   Toda modificación en el estado general del arreglo de tareas (`tareas`) invoca la actualización en almacenamiento local a través de:
    ```javascript
    localStorage.setItem('MIS_TAREAS', JSON.stringify(tareas));
    ```
*   Al iniciar la aplicación, se lee y deserializa el almacenamiento previo o se inicializa con un arreglo vacío.

---

##  Instrucciones de Uso y Despliegue

### Requisitos Previos
*   Navegador web moderno compatible con ES6 y Custom Elements (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
*   No requiere la instalación de Node.js, gestores de paquetes ni herramientas de compilación externas.

### Ejecución Local

1.  **Clonar o Descargar el Repositorio:**
    ```bash
    git clone https://github.com/rhomanmarquez-beep/gestion_tareas-.git
    ```
2.  **Abrir la Aplicación:**
    *   Ingresa a la carpeta del proyecto.
    *   Haz doble clic sobre el archivo `inicio-pagina.html` o abre `pricipal.html` directamente en tu navegador.
    *   *(Opcional)* Si utilizas Visual Studio Code, puedes hacer clic derecho en `pricipal.html` y seleccionar **"Open with Live Server"**.

### Guía Rápida de Interacción

1.  **Crear Tarea:** Haz clic en **"Nueva Tarea"**, diligencia los campos del modal y presiona **Guardar**.
2.  **Importar de la API:** Haz clic en **"Importar de la API"**, selecciona una o varias tareas recibidas en el modal y haz clic en **Guardar Seleccionadas**.
3.  **Filtrar/Buscar:** Utiliza la caja de texto superior o el menú desplegable de estados (*Pendientes / Completadas*) para refinar el listado visible.
4.  **Editar Tarea:** Haz clic en el ícono de lápiz ✏️ presente únicamente en tareas creadas por el usuario.
5.  **Eliminar Tarea:** Haz clic en el ícono de caneca 🗑️ para remover la tarea de forma individual.

---

## 📋 Cumplimiento de Rúbricas y Requerimientos

| Requerimiento | Estado | Implementación |
| :--- | :---: | :--- |
| **Lista de tareas inicial** | ✅ | Muestra tareas locales y su estado (marcado/desmarcado). |
| **Filtro y Buscador** | ✅ | Buscador interactivo por texto y filtro por select (`todas`, `pendientes`, `completadas`). |
| **Formulario Modal** | ✅ | Modal reutilizable para alta y edición de registros. |
| **Atributos requeridos** | ✅ | Registro de `titulo`, `descripcion`, `fecha` y estado booleano (`completado`). |
| **Importación de API** | ✅ | Consumo de `https://jsonplaceholder.typicode.com/todos` con `async/await`. |
| **Estándar de IDs** | ✅ | Prefijos `task_` y `task_imp_` para evitar duplicidad. |
| **Restricción de Importadas**| ✅ | Tareas importadas no muestran botón de edición. |
| **Web Components & Shadow DOM**| ✅ | Componente `<tarea-item>` definido con Shadow DOM encapsulado. |
| **Persistencia Local** | ✅ | Lectura y escritura en `localStorage` mediante objetos JSON. |
| **UX & Responsive Design** | ✅ | Estilos en `estilo.css` adaptables a pantallas móviles y de escritorio. |

---

## ✒️ Autor

*   **Desarrollado por:** Camper - Rhoman Marquez y el Camper - Diego tinoco
*   **Repositorio:** `gestion_tareas-`