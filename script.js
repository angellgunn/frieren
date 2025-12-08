const cardContainer = document.querySelector(".card-container");
const searchInput = document.querySelector('input[type="text"]');
const filterButtons = document.querySelectorAll(".filtro-btn");
let dados = [];

async function carregarDados() {
    try {
        // Define os caminhos para os arquivos de dados
        const dataFiles = [
            "data/characters.json",
            "data/concepts.json",
            "data/episodes.json",
            "data/production.json"
        ];

        // Carrega todos os arquivos de dados em paralelo
        const responses = await Promise.all(dataFiles.map(file => fetch(file)));
        const jsonData = await Promise.all(responses.map(res => res.json()));

        // Combina os dados de todos os arquivos em um único array
        dados = jsonData.flat();
        renderizarCards(dados);
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
    }
}

function iniciarBusca() {
    const termoBusca = searchInput.value.toLowerCase();
    if (termoBusca.length < 2 && termoBusca.length > 0) {
        // Opcional: evita buscas muito curtas
        return;
    }

    const dadosFiltrados = dados.filter(dado => {
        const buscaNoTitulo = dado.titulo.toLowerCase().includes(termoBusca);
        const buscaNaDescricao = dado.descricao.toLowerCase().includes(termoBusca);
        const buscaNasTags = dado.tags.some(tag => tag.toLowerCase().includes(termoBusca));
        return buscaNoTitulo || buscaNaDescricao || buscaNasTags;
    });

    renderizarCards(dadosFiltrados);
}

function renderizarCards(entradas) {
    cardContainer.innerHTML = ""; // Limpa a tela antes de renderizar

    for (let dado of entradas) {
        let article = document.createElement("article");

        const imagemHtml = dado.imagens && dado.imagens.length > 0
            ? `<img src="${dado.imagens[0].url}" alt="${dado.titulo}" class="card-imagem">`
            : '';

        const tagsHtml = dado.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        const fontesHtml = dado.fontes && dado.fontes.length > 0
            ? `<div class="fontes-container">
                ${dado.fontes.map(fonte => `<a href="${fonte.url}" target="_blank" class="btn-fonte">${fonte.nome}</a>`).join('')}
               </div>`
            : '';

        article.innerHTML = `
            ${imagemHtml}
            <div class="card-conteudo">
                <div class="card-header">
                    <h2>${dado.titulo}</h2>
                    <span class="card-tipo">${dado.tipo}</span>
                </div>
                <p>${dado.descricao}</p>
                <div class="tags-container">
                    ${tagsHtml}
                </div>
                ${fontesHtml}
            </div>
        `;
        cardContainer.appendChild(article);
    }
}

function filtrarPorTipo(evento) {
    const tipoFiltro = evento.target.dataset.tipo;

    // Adiciona/remove classe ativa para feedback visual
    filterButtons.forEach(btn => btn.classList.remove('ativo'));
    evento.target.classList.add('ativo');

    if (tipoFiltro === "todos") {
        renderizarCards(dados);
    } else {
        const dadosFiltrados = dados.filter(dado => dado.tipo === tipoFiltro);
        renderizarCards(dadosFiltrados);
    }
}

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        iniciarBusca();
    }
});

carregarDados();
filterButtons.forEach(button => button.addEventListener('click', filtrarPorTipo));
