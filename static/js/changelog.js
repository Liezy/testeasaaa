// Função para buscar releases da API
async function fetchReleases() {
    try {
        const response = await fetch('/list');
        const releases = await response.json();
        displayReleases(releases);
        checkForNewRelease(releases);
    } catch (error) {
        console.error('Erro ao buscar releases:', error);
        document.getElementById('releases-container').innerHTML = 
            '<p style="color: red;">Erro ao carregar releases</p>';
    }
}

// Função para exibir releases na página
function displayReleases(releases) {
    const container = document.getElementById('releases-container');
    
    if (releases.length === 0) {
        container.innerHTML = '<p>Nenhum release encontrado.</p>';
        return;
    }

    let html = '';
    releases.forEach(release => {
        const renderedMarkdown = marked.parse(release.body);
        const sanitizedHtml = DOMPurify.sanitize(renderedMarkdown);
        html += `
            <div class="release-card">
                <h2>${escapeHtml(release.name)} <span class="tag">${escapeHtml(release.tag)}</span></h2>
                <p class="date">Publicado em: ${new Date(release.published_at).toLocaleDateString('pt-BR')}</p>
                <div class="body">
                    ${sanitizedHtml}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function checkForNewRelease(releases) {
    if (releases.length === 0) return;

    const latestRelease = releases[0]; // assumindo que vem ordenado do mais novo para o mais antigo
    const lastSeen = localStorage.getItem("lastSeenRelease");

    if (lastSeen !== latestRelease.tag) {
        showModal(latestRelease);
    }
}

function showModal(release) {
    const modal = document.createElement("div");
    modal.id = "release-modal";
    const renderedMarkdown = marked.parse(release.body);
    const sanitizedHtml = DOMPurify.sanitize(renderedMarkdown);
    modal.innerHTML = `
        <div class="modal-content">
            <h1>🚀 Nova Atualização ${escapeHtml(release.name)}</h1>
            <p><strong>Publicado em:</strong> ${new Date(release.published_at).toLocaleDateString('pt-BR')}</p>
            <div class="modal-body">
                ${sanitizedHtml}
            </div>
            <button id="close-modal">Entendi</button>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("close-modal").addEventListener("click", () => {
        localStorage.setItem("lastSeenRelease", release.tag);
        modal.remove();
    });
}

// Função utilitária para escapar HTML e evitar XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Carregar releases ao iniciar a página
document.addEventListener('DOMContentLoaded', fetchReleases);
