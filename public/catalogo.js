// Função para carregar imagens e informações da página do servidor para o catálogo
async function carregarCatalogo() {
    console.log("Recarregando dados...");
    // Busca os dados da página atual
    const res = await fetch(`/imagens`);
    const imagens = await res.json();

    const galeria = document.getElementById("galeria");
    galeria.innerHTML = "";

    imagens.forEach(img => {
        const div = document.createElement("div");
        div.classList.add("item");
        div.innerHTML = `
            <img src="${img.imagem}">
            <p><b>${img.nome}</b></p>
            <p><b>Preço: </b>R$ ${img.preco}</p>
            <p><b>Código: </b> ${img.id}</p>
        `;
        galeria.appendChild(div);
    });
}

// Carrega os dados na primeira vez que a página é aberta
carregarCatalogo();

// Define um intervalo para recarregar os dados a cada 10 segundos (10000 milissegundos)
setInterval(carregarCatalogo, 10000);
