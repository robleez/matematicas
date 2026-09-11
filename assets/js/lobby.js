document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.getElementById("lista-guias");
    const buscador = document.getElementById("buscar-guias");
    const filtros = document.getElementById("filtros-categorias");
    const resultadoInfo = document.getElementById("resultado-info");


    if (!contenedor) return;


    if (typeof GUIAS === "undefined") {

        contenedor.innerHTML = `
            <div class="estado-vacio">
                No se pudo cargar el catálogo de guías.
            </div>
        `;

        return;
    }


    let categoriaActiva = "Todos";
    let textoBusqueda = "";


    // =========================
    // NORMALIZAR TEXTO
    // =========================

    function normalizar(texto) {

        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    }


    // =========================
    // CATEGORÍAS AUTOMÁTICAS
    // =========================

    const categorias = [
        "Todos",
        ...new Set(
            GUIAS
                .map(guia => guia.categoria)
                .filter(Boolean)
        )
    ];


    function crearFiltros() {

        filtros.innerHTML = "";


        categorias.forEach(categoria => {

            const boton = document.createElement("button");

            boton.type = "button";

            boton.className =
                "filtro-btn" +
                (categoria === categoriaActiva ? " activo" : "");

            boton.textContent = categoria;


            boton.addEventListener("click", () => {

                categoriaActiva = categoria;

                crearFiltros();

                renderizarGuias();

            });


            filtros.appendChild(boton);

        });

    }


    // =========================
    // CREAR TARJETA
    // =========================

    function crearTarjeta(guia) {

        const tarjeta = document.createElement("article");

        tarjeta.className = "guia-card";


        const temas = (guia.temas || [])
            .map(tema => `<span>${tema}</span>`)
            .join("");


        let previews = "";


        if (guia.previews && guia.previews.length > 0) {

            previews = `
                <div class="preview-grid">

                    ${guia.previews.slice(0, 3).map((imagen, index) => `
                        <div class="preview-item">

                            <img
                                src="${imagen}"
                                alt="Ejemplo ${index + 1} de ${guia.titulo}"
                                loading="lazy"
                            >

                        </div>
                    `).join("")}

                </div>
            `;

        } else {

            previews = `
                <div class="preview-vacio">

                    📘

                    <span>
                        Vista previa próximamente
                    </span>

                </div>
            `;

        }


        tarjeta.innerHTML = `

            ${previews}


            <div class="guia-info">

                ${
                    guia.nuevo
                    ? '<div class="badge-nuevo">NUEVO</div>'
                    : ''
                }


                <p class="categoria">
                    ${guia.categoria || "General"}
                </p>


                <h2>
                    ${guia.titulo}
                </h2>


                <p class="subtitulo">
                    ${guia.subtitulo || ""}
                </p>


                <div class="temas">
                    ${temas}
                </div>


                <div class="guia-footer">

                    <span>
                        ${guia.problemas || 0} problemas
                    </span>


                    <a
                        href="${guia.archivo}"
                        class="btn-estudiar"
                    >
                        Estudiar →
                    </a>

                </div>

            </div>
        `;


        return tarjeta;

    }


    // =========================
    // FILTRAR Y MOSTRAR
    // =========================

    function renderizarGuias() {

        contenedor.innerHTML = "";


        const busqueda = normalizar(textoBusqueda);


        const resultado = GUIAS.filter(guia => {


            // Categoría

            const coincideCategoria =
                categoriaActiva === "Todos" ||
                guia.categoria === categoriaActiva;


            // Texto completo que podrá buscarse

            const contenido = normalizar([
                guia.titulo,
                guia.subtitulo,
                guia.categoria,
                ...(guia.temas || [])
            ].join(" "));


            const coincideBusqueda =
                busqueda === "" ||
                contenido.includes(busqueda);


            return coincideCategoria && coincideBusqueda;

        });


        resultado.forEach(guia => {

            contenedor.appendChild(
                crearTarjeta(guia)
            );

        });


        // Información de resultados

        if (resultado.length === 1) {

            resultadoInfo.textContent =
                "1 guía encontrada";

        } else {

            resultadoInfo.textContent =
                `${resultado.length} guías encontradas`;

        }


        // Sin resultados

        if (resultado.length === 0) {

            contenedor.innerHTML = `

                <div class="estado-vacio">

                    <div class="estado-vacio-icono">
                        🔎
                    </div>

                    <strong>
                        No encontré ninguna guía
                    </strong>

                    <span>
                        Prueba con otra palabra o categoría.
                    </span>

                </div>
            `;

        }

    }


    // =========================
    // BUSCADOR
    // =========================

    buscador?.addEventListener("input", event => {

        textoBusqueda = event.target.value;

        renderizarGuias();

    });


    // =========================
    // INICIAR
    // =========================

    crearFiltros();

    renderizarGuias();

});
