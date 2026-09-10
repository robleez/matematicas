document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.getElementById("lista-guias");

    if (!contenedor) return;

    if (typeof GUIAS === "undefined") {
        contenedor.innerHTML = "<p>No se pudo cargar el catálogo.</p>";
        return;
    }

    GUIAS.forEach((guia) => {

        const tarjeta = document.createElement("article");
        tarjeta.className = "guia-card";

        const temas = guia.temas
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
                    <span>Vista previa próximamente</span>
                </div>
            `;
        }

        tarjeta.innerHTML = `

            ${previews}

            <div class="guia-info">

                ${guia.nuevo
                    ? '<div class="badge-nuevo">NUEVO</div>'
                    : ''
                }

                <p class="categoria">
                    ${guia.categoria}
                </p>

                <h2>
                    ${guia.titulo}
                </h2>

                <p class="subtitulo">
                    ${guia.subtitulo}
                </p>

                <div class="temas">
                    ${temas}
                </div>

                <div class="guia-footer">

                    <span>
                        ${guia.problemas} problemas
                    </span>

                    <a href="${guia.archivo}" class="btn-estudiar">
                        Estudiar →
                    </a>

                </div>

            </div>
        `;

        contenedor.appendChild(tarjeta);

    });

});
