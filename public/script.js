
let editarID = null;

// Função para carregar imagens e informações da página do servidor
async function carregar() {
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
            <button onclick="abrirModal(${img.id}, '${img.nome}')">Editar nome</button>
            <button onclick="abrirModalPreco(${img.id}, '${img.preco}')">Editar preço</button>
            <button onclick="excluir(${img.id})" style="background:red;color:white">Excluir</button>
        `;
        galeria.appendChild(div);
    });
}

carregar();



document.getElementById("formImg").onsubmit = async e => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const preco = document.getElementById("preco").value;
    const file = document.getElementById("imgInput").files[0];

    const fd = new FormData();
    fd.append("nome", nome);
    fd.append("preco", preco);
    fd.append("imagem", file);

    await fetch("/upload", { method: "POST", body: fd });
    document.getElementById("formImg").reset();

    carregar();
};

function abrirModal(id, nomeAtual) {
    editarID = id;
    document.getElementById("editNome").value = nomeAtual;
    document.getElementById("modal").style.display = "flex";
}

document.getElementById("fecharModal").onclick = () =>
    document.getElementById("modal").style.display = "none";

document.getElementById("salvarEdit").onclick = async () => {
    const novoNome = document.getElementById("editNome").value;

    await fetch("/imagem/" + editarID, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novoNome })
    });

    document.getElementById("modal").style.display = "none";
    carregar();
};

function abrirModalPreco(id, precoAtual) {
    editarID = id;
    document.getElementById("editPreco").value = precoAtual;
    document.getElementById("modalPreco").style.display = "flex";
}

document.getElementById("fecharModalPreco").onclick = () =>
    document.getElementById("modalPreco").style.display = "none";

document.getElementById("salvarEditPreco").onclick = async () => {
    const novoPreco = document.getElementById("editPreco").value;

    await fetch("/imagem/" + editarID, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preco: novoPreco })
    });

    document.getElementById("modalPreco").style.display = "none";
    carregar();
};

async function excluir(id) {
    if (!confirm("Deseja excluir?")) return;
    await fetch("/imagem/" + id, { method: "DELETE" });
    carregar();
}

