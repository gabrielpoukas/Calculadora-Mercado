let itens = JSON.parse(localStorage.getItem('market_data')) || [];
let catalogoPrecos = JSON.parse(localStorage.getItem('catalogo_precos')) || {};
let apenasFaltando = false;

const listaElement = document.getElementById('lista-compras');
const displayTotal = document.getElementById('total-valor');
const itemCount = document.getElementById('item-count');

function render() {
    listaElement.innerHTML = '';
    let total = 0;

    itens.forEach((item, index) => {
        total += item.valor;

        if (apenasFaltando && item.checked) return;

        const li = document.createElement('li');
        li.className = `item-card ${item.checked ? 'checked' : ''}`;
        li.innerHTML = `
            <div style="display: flex; align-items: center;">
                <button onclick="alternarCheck(${index})" class="btn-check ${item.checked ? 'active' : ''}">
                    ${item.checked ? '✓' : ''}
                </button>
                <div>
                    <strong>${item.nome}</strong><br>
                    <span style="color:var(--accent); font-weight:700">R$ ${item.valor.toFixed(2)}</span>
                </div>
            </div>
            <button onclick="remover(${index})" style="border:none; background:#FFEBEB; padding:10px; border-radius:8px; cursor:pointer">🗑️</button>
        `;
        listaElement.appendChild(li);
    });

    displayTotal.innerText = `R$ ${total.toFixed(2)}`;
    itemCount.innerText = `${itens.length} itens`;
    localStorage.setItem('market_data', JSON.stringify(itens));
}

function alternarCheck(index) {
    itens[index].checked = !itens[index].checked;
    if (navigator.vibrate) navigator.vibrate(40);
    render();
}

document.getElementById('filter-unckecked').addEventListener('change', (e) => {
    apenasFaltando = e.target.checked;
    render();
});

document.getElementById('btn-scan').addEventListener('click', () => {
    const view = document.getElementById('interactive');
    view.style.display = 'block';
    Quagga.init({
        inputStream: { type: "LiveStream", target: view, constraints: { facingMode: "environment" } },
        decoder: { readers: ["ean_reader"] }
    }, (err) => {
        if (err) return alert("Erro ao abrir câmera");
        Quagga.start();
    });
});

Quagga.onDetected((data) => {
    const code = data.codeResult.code;
    Quagga.stop();
    document.getElementById('interactive').style.display = 'none';
    if (navigator.vibrate) navigator.vibrate(60);
    
    if (catalogoPrecos[code]) {
        document.getElementById('item-nome').value = catalogoPrecos[code].nome;
        document.getElementById('item-valor').value = catalogoPrecos[code].valor;
    } else {
        const n = prompt("Produto novo encontrado! Nome:");
        if (n) {
            document.getElementById('item-nome').value = n;
            window.lastCode = code;
        }
    }
});

document.getElementById('btn-adicionar').addEventListener('click', () => {
    const n = document.getElementById('item-nome').value.trim();
    const v = parseFloat(document.getElementById('item-valor').value);
    if (n && v) {
        itens.push({ nome: n, valor: v, checked: false });
        if (window.lastCode) {
            catalogoPrecos[window.lastCode] = { nome: n, valor: v };
            localStorage.setItem('catalogo_precos', JSON.stringify(catalogoPrecos));
            window.lastCode = null;
        }
        document.getElementById('item-nome').value = '';
        document.getElementById('item-valor').value = '';
        render();
    }
});

function remover(index) {
    if(confirm("Remover item?")) {
        itens.splice(index, 1);
        render();
    }
}

document.getElementById('theme-toggle').addEventListener('click', () => {
    const d = document.documentElement;
    const isDark = d.getAttribute('data-theme') === 'dark';
    d.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('theme-icon').innerText = isDark ? '🌙' : '☀️';
});

window.onload = render;