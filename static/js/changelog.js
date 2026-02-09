// Função para buscar releases da API
async function fetchReleases() {
    try {
        const response = await fetch('/api/releases/');
        const releases = await response.json();
        displayReleases(releases);
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
        html += `
            <div class="release-card">
                <h2>${release.name} <span class="tag">${release.tag}</span></h2>
                <p class="date">Publicado em: ${new Date(release.published_at).toLocaleDateString('pt-BR')}</p>
                <div class="body">
                    ${release.body}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Carregar releases ao iniciar a página
document.addEventListener('DOMContentLoaded', fetchReleases);
