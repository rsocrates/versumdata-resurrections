/**
 * script.js
 * Carga la lista de videos y PDFs desde videos.json y los inserta en el DOM
 * como iframes de YouTube y enlaces a PDF respectivamente.
 */

const VIDEOS_URL = 'videos.json';
const container = document.getElementById('videos-container');
const pdfContainer = document.getElementById('pdfs-container');

/**
 * Construye un elemento iframe de YouTube a partir de un video object.
 * @param {Object} video - Objeto con { id, titulo, descripcion, url }
 * @returns {HTMLDivElement} Tarjeta de video lista para insertar.
 */
function createVideoCard(video) {
  const card = document.createElement('div');
  card.className = 'video-card';

  const title = document.createElement('h3');
  title.className = 'video-card__title';
  title.textContent = video.titulo || `Vídeo ${video.id}`;

  const desc = document.createElement('p');
  desc.className = 'video-card__desc';
  desc.textContent = video.descripcion || '';

  const wrap = document.createElement('div');
  wrap.className = 'video-card__img-wrap';

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`;
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('title', video.titulo || 'Video de YouTube');

  // Icono de reproducción de YouTube (Font Awesome brands)
  const playIcon = document.createElement('i');
  playIcon.className = 'fa-brands fa-youtube video-card__play-icon';
  wrap.appendChild(playIcon);

  wrap.appendChild(iframe);
  card.appendChild(wrap);
  card.appendChild(title);
  card.appendChild(desc);

  // Abrir el video en YouTube en nueva pestaña al clicar la tarjeta
  card.addEventListener('click', () => {
    window.open(video.url, '_blank', 'noopener,noreferrer');
  });

  return card;
}

/**
 * Construye un elemento de enlace a PDF a partir de un objeto PDF.
 * @param {Object} pdf - Objeto con { titulo, descripcion, archivo }
 * @returns {HTMLDivElement} Tarjeta de PDF lista para insertar.
 */
function createPdfCard(pdf) {
  const card = document.createElement('div');
  card.className = 'pdf-card';

  const title = document.createElement('h3');
  title.className = 'pdf-card__title';
  title.textContent = pdf.titulo || `PDF ${pdf.id || 'sin-id'}`;

  const desc = document.createElement('p');
  desc.className = 'pdf-card__desc';
  desc.textContent = pdf.descripcion || '';

  const fileLink = document.createElement('a');
  fileLink.className = 'pdf-card__file';
  fileLink.href = pdf.archivo || '';
  fileLink.target = '_blank';
  fileLink.rel = 'noopener noreferrer';
  fileLink.textContent = 'Descargar PDF';

  const icon = document.createElement('i');
  icon.className = 'fa fa-file-pdf';
  fileLink.prepend(icon);

  card.appendChild(title);
  card.appendChild(desc);
  card.appendChild(fileLink);

  // Abrir el PDF en nueva pestaña al clicar la tarjeta
  card.addEventListener('click', (e) => {
    // Evitar que el clic en el enlace se interprete como clic de la tarjeta
    if (e.target.closest('a.pdf-card__file')) {
      return;
    }
    window.open(pdf.archivo, '_blank', 'noopener,noreferrer');
  });

  return card;
}

/**
 * Carga videos.json y renderiza videos y PDFs.
 */
async function loadContent() {
  try {
    const response = await fetch(VIDEOS_URL);
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }
    const data = await response.json();

    // Renderizar videos
    const videos = data.videos || [];
    if (videos.length === 0) {
      container.innerHTML = '<p class="section-title" style="color:#b0a89e;">No hay videos disponibles.</p>';
    } else {
      videos.forEach((video) => {
        container.appendChild(createVideoCard(video));
      });
    }

    // Renderizar PDFs
    const pdfs = data.pdfs || [];
    if (pdfs.length === 0) {
      pdfContainer.innerHTML = '<p class="section-title" style="color:#b0a89e;">No hay presentaciones en PDF disponibles.</p>';
    } else {
      pdfs.forEach((pdf) => {
        pdfContainer.appendChild(createPdfCard(pdf));
      });
    }
  } catch (error) {
    console.error('No se pudieron cargar los contenidos:', error);
    container.innerHTML = '<p class="section-title" style="color:#b0a89e;">No se pudieron cargar los videos. Revisa que videos.json esté en la misma carpeta.</p>';
    pdfContainer.innerHTML = '<p class="section-title" style="color:#b0a89e;">No se pudieron cargar los PDFs. Revisa que videos.json esté en la misma carpeta.</p>';
  }
}

// Iniciar la carga cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadContent);
