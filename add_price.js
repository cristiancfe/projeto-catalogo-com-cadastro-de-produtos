
const fs = require('fs');

const filePath = 'dados.json';

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error("Erro ao ler o arquivo:", err);
        return;
    }

    try {
        const dados = JSON.parse(data);
        dados.imagens.forEach(img => {
            if (img.preco === undefined) {
                img.preco = "0";
            }
        });

        fs.writeFile(filePath, JSON.stringify(dados, null, 2), 'utf8', (err) => {
            if (err) {
                console.error("Erro ao escrever o arquivo:", err);
            } else {
                console.log("Arquivo atualizado com sucesso!");
            }
        });
    } catch (parseErr) {
        console.error("Erro ao fazer o parse do JSON:", parseErr);
    }
});
