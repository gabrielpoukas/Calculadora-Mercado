let itens = JSON.parse(localStorage.getItem('market_data')) || [];
let precosSalvos = JSON.parse(localStorage.getItem('catalogo_precos')) || {};

const listaElement = document.getElementById('lista-compras');
const displayTotal = document.getElementById('total-valor');
const itemCount = document.getElementById('item-count');

function render() {
    listaElement.innerHTML = '';
    let total = 0;

    itens.forEach((item, index) => {
        total += item.valor;
        const li = document.createElement('li');
        li.className = 'item-card';
        li.innerHTML = `
            <div>
                <strong style="display:block">${item.nome}</strong>
                <span style="color:var(--accent); font-weight:700">R$ ${item.valor.toFixed(2)}</span>
            </div>
            <button onclick="remover(${index})" style="background:#FFEBEB; border:none; padding:10px; border-radius:8px; cursor:pointer">🗑️</button>
        `;
        listaElement.appendChild(li);
    });

    displayTotal.innerText = `R$ ${total.toFixed(2)}`;
    itemCount.innerText = `${itens.length} itens`;
    localStorage.setItem('market_data', JSON.stringify(itens));
}

document.getElementById('btn-scan').addEventListener('click', () => {
    const viewport = document.getElementById('interactive');
    viewport.style.display = 'block';
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: viewport,
            constraints: { facingMode: "environment" } 
        },
        decoder: { readers: ["ean_reader"] }
    }, function(err) {
        if (err) { console.error(err); return; }
        Quagga.start();
    });

    Quagga.onDetected((data) => {
        const codigo = data.codeResult.code;
        Quagga.stop();
        viewport.style.display = 'none';
        
        if (navigator.vibrate) navigator.vibrate(100);
        buscarProduto(codigo);
    });
});

function buscarProduto(codigo) {
    if (precosSalvos[codigo]) {
        const prod = precosSalvos[codigo];
        document.getElementById('item-nome').value = prod.nome;
        document.getElementById('item-valor').value = prod.valor;
        alert(`Produto reconhecido: ${prod.nome}`);
    } else {
        const nomeManual = prompt("Produto novo! Digite o nome:");
        if (nomeManual) {
            document.getElementById('item-nome').value = nomeManual;
            alert("Agora digite o preço no campo e clique em adicionar para eu salvar para a próxima!");
            window.ultimoCodigoLido = codigo;
        }
    }
}

document.getElementById('btn-adicionar').addEventListener('click', () => {
    const inputNome = document.getElementById('item-nome');
    const inputValor = document.getElementById('item-valor');
    const nome = inputNome.value.trim();
    const valor = parseFloat(inputValor.value);

    if (nome && !isNaN(valor)) {
        itens.push({ nome, valor });
        
        if (window.ultimoCodigoLido) {
            precosSalvos[window.ultimoCodigoLido] = { nome, valor };
            localStorage.setItem('catalogo_precos', JSON.stringify(precosSalvos));
            window.ultimoCodigoLido = null;
        }

        inputNome.value = '';
        inputValor.value = '';
        render();
    }
});

function remover(index) {
    itens.splice(index, 1);
    render();
}

document.getElementById('theme-toggle').addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    document.getElementById('theme-icon').innerText = isDark ? '🌙' : '☀️';
});

window.onload = render;