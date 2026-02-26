🛒 MarketCalc - Controle de Compras em Tempo Real

O MarketCalc é uma aplicação web focada em Mobile First desenvolvida para resolver um problema comum em grandes mercados (como o Atacadão): a falta de etiquetas de preço e a dificuldade de controlar o valor total da compra antes de chegar ao caixa.

O projeto une uma lista de compras inteligente, um leitor de código de barras via câmera e um somador automático de valores.
🚀 Funcionalidades

    Leitor de Código de Barras: Integração com a câmera do celular para identificar produtos via QuaggaJS.

    Banco de Dados Local: Sistema de "aprendizado" que salva o nome e o preço de produtos novos no localStorage para consultas futuras.

    Checklist Inteligente: Marque os itens conforme os coloca no carrinho físico para focar apenas no que falta.

    Filtro de Visualização: Opção para esconder itens já "bipeados" ou marcados, facilitando a navegação em listas longas.

    Modo Noturno/Claro: Interface adaptável para diferentes condições de iluminação.

    Somador em Tempo Real: Cálculo instantâneo do valor total acumulado.

🛠️ Tecnologias Utilizadas

    HTML5: Estrutura semântica para melhor acessibilidade.

    CSS3: Layout moderno utilizando Flexbox, Variables e Media Queries para total responsividade em dispositivos móveis.

    JavaScript (ES6+): Lógica de manipulação de DOM, cálculos matemáticos e persistência de dados.

    QuaggaJS: Biblioteca para processamento de imagens e detecção de códigos de barras.

    Local Storage: Armazenamento local para garantir que a lista não seja perdida ao fechar o navegador.
