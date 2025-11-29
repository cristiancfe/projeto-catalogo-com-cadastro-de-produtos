
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let clients = [];

function sendEventToClients() {
    console.log("Notificando clientes sobre atualização...");
    clients.forEach(client => {
        client.res.write('data: update\n\n');
    });
}

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = {
        id: clientId,
        res,
    };

    clients.push(newClient);
    console.log(`${clientId} - Conexão aberta`);

    req.on('close', () => {
        console.log(`${clientId} - Conexão fechada`);
        clients = clients.filter(client => client.id !== clientId);
    });
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

function readJSON() {
    if (!fs.existsSync("dados.json")) {
        fs.writeFileSync("dados.json", JSON.stringify({ imagens: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync("dados.json"));
}

function saveJSON(data) {
    fs.writeFileSync("dados.json", JSON.stringify(data, null, 2));
}

app.post("/upload", upload.single("imagem"), (req, res) => {
    if (!req.file) return res.status(400).json({ erro: "Nenhuma imagem enviada" });

    const base64 = req.file.buffer.toString("base64");
    const json = readJSON();

    const nova = {
        id: Date.now(),
        nome: req.body.nome || "Sem nome",
        preco: req.body.preco || "0",
        data: new Date().toLocaleString("pt-BR"),
        tipo: req.file.mimetype,
        imagem: `data:${req.file.mimetype};base64,${base64}`
    };

    json.imagens.push(nova);
    saveJSON(json);
    sendEventToClients();

    res.json({ mensagem: "Imagem salva!", imagem: nova });
});

app.get("/imagens", (req, res) => {
    const json = readJSON();
    res.json(json.imagens);
});

app.put("/imagem/:id", (req, res) => {
    const id = Number(req.params.id);
    const { nome: novoNome, preco: novoPreco } = req.body;

    const json = readJSON();
    const img = json.imagens.find(i => i.id === id);

    if (!img) return res.status(404).json({ erro: "Imagem não encontrada" });

    if (novoNome) {
        img.nome = novoNome;
    }

    if (novoPreco) {
        img.preco = novoPreco;
    }
    
    saveJSON(json);
    sendEventToClients();

    res.json({ mensagem: "Imagem atualizada com sucesso!" });
});

app.delete("/imagem/:id", (req, res) => {
    const id = Number(req.params.id);
    const json = readJSON();

    json.imagens = json.imagens.filter(i => i.id !== id);
    saveJSON(json);
    sendEventToClients();

    res.json({ mensagem: "Imagem removida!" });
});

app.listen(5500, () => console.log("Rodando em http://localhost:5500"));
