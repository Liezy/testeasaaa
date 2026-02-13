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
        container.innerHTML = '<p class="text-white text-center">Nenhum release encontrado.</p>';
        return;
    }

    let html = '';
    releases.forEach(release => {
        // Usa o texto amigável gerado pela IA
        const userNotes = release.user_notes || 'Nenhuma descrição disponível';
        html += `
            <div class="bg-gray-300 rounded-lg p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">${escapeHtml(release.name)} <span class="inline-block bg-indigo-500 text-white px-3 py-1 rounded text-sm font-medium">${escapeHtml(release.tag)}</span></h2>
                <p class="text-gray-600 text-sm mb-4">Publicado em: ${new Date(release.published_at).toLocaleDateString('pt-BR')}</p>
                <div class="prose prose-sm text-gray-700 whitespace-pre-wrap">
                    ${escapeHtml(userNotes)}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function extractMajorVersion(tag) {
    // Extrai o número da major version de uma tag como "v2.5.3" → 2
    const match = tag.match(/v(\d+)/);
    return match ? parseInt(match[1]) : 0;
}

function hasPassedDays(days = 30) {
    // Verifica se passaram X dias desde a última notificação
    const lastNotificationDate = localStorage.getItem("lastNotificationDate");
    if (!lastNotificationDate) return false;
    
    const lastDate = new Date(parseInt(lastNotificationDate));
    const currentDate = new Date();
    const diffTime = currentDate - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= days;
}

function getReleasesSinceLastMajor(releases, lastSeenMajor) {
    // Retorna todos os releases até encontrar a última major version vista
    if (lastSeenMajor === 0) return releases; // primeira vez
    
    const newReleases = [];
    for (const release of releases) {
        const currentMajor = extractMajorVersion(release.tag);
        if (currentMajor < lastSeenMajor) {
            break; // parou na versão anterior
        }
        newReleases.push(release);
    }
    return newReleases;
}

function checkForNewRelease(releases) {
    if (releases.length === 0) return;

    const latestRelease = releases[0]; // assumindo que vem ordenado do mais novo para o mais antigo
    const currentMajor = extractMajorVersion(latestRelease.tag);
    const lastSeenMajor = localStorage.getItem("lastSeenMajorVersion");
    
    // Se for a primeira visita, só salva sem mostrar modal
    if (lastSeenMajor === null) {
        localStorage.setItem("lastSeenMajorVersion", currentMajor);
        localStorage.setItem("lastNotificationDate", new Date().getTime().toString());
        return;
    }
    
    const parsedLastSeenMajor = parseInt(lastSeenMajor);
    const isMajorVersionChanged = currentMajor !== parsedLastSeenMajor;
    const hasPassedThirtyDays = hasPassedDays(30);
    
    // Se a major version mudou OU passaram 30 dias, mostra modal
    if (isMajorVersionChanged || hasPassedThirtyDays) {
        const releasesToShow = getReleasesSinceLastMajor(releases, parsedLastSeenMajor);
        showModal(releasesToShow, currentMajor, isMajorVersionChanged);
    }
}

function showModal(releases, majorVersion, isMajorVersionChanged = true) {
    const modal = document.createElement("div");
    modal.id = "release-modal";
    modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50";
    
    // Construir o conteúdo de todos os releases
    let releasesHtml = '';
    releases.forEach(release => {
        const renderedMarkdown = marked.parse(release.body);
        const sanitizedHtml = DOMPurify.sanitize(renderedMarkdown);
        releasesHtml += `
            <div class="mb-6 pb-6 border-b border-gray-300 last:border-b-0">
                <h3 class="text-xl font-bold text-gray-800 mb-2">${escapeHtml(release.name)} <span class="inline-block bg-indigo-500 text-white px-2 py-1 rounded text-xs font-medium">${escapeHtml(release.tag)}</span></h3>
                <p class="text-gray-600 text-sm mb-3">Publicado em: ${new Date(release.published_at).toLocaleDateString('pt-BR')}</p>
                <div class="prose prose-sm text-gray-700">
                    ${sanitizedHtml}
                </div>
            </div>
        `;
    });
    
    // Mensagem dinâmica baseada no tipo de notificação
    const title = isMajorVersionChanged 
        ? `🚀 Grandes Atualizações v${majorVersion}.0.0`
        : `📦 Novidades disponíveis`;
    
    const subtitle = isMajorVersionChanged
        ? `${releases.length > 1 
            ? `Confira as ${releases.length} atualizações desde a última major version`
            : 'Confira a nova major version'}`
        : `Confira as ${releases.length} atualizações dos últimos 30 dias`;
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-2xl max-w-3xl w-full p-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">${title}</h1>
            <p class="text-gray-600 mb-6">${subtitle}</p>
            <div class="prose prose-sm text-gray-700 mb-8 max-h-96 overflow-y-auto">
                ${releasesHtml}
            </div>
            <button id="close-modal" class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 rounded-lg hover:-translate-y-1 transition">Entendi</button>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("close-modal").addEventListener("click", () => {
        if (isMajorVersionChanged) {
            localStorage.setItem("lastSeenMajorVersion", majorVersion);
        }
        localStorage.setItem("lastNotificationDate", new Date().getTime().toString());
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
