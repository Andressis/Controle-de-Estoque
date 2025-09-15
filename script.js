// Função para alternar entre as abas
function showTab(tabName) {
    // Ocultar todas as abas
    var contents = document.getElementsByClassName('tab-content');
    for (var i = 0; i < contents.length; i++) {
        contents[i].classList.remove('active');
    }
    
    // Remover classe active de todos os botões
    var buttons = document.getElementsByClassName('tab-button');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    
    // Mostrar aba selecionada
    document.getElementById(tabName).classList.add('active');
    
    // Ativar botão correspondente
    event.target.classList.add('active');
}

// Função de busca (pode ser expandida conforme necessário)
function searchProducts() {
    var input = document.querySelector('.search-box');
    var filter = input.value.toLowerCase();
    var table = document.querySelector('#produtos .simple-table tbody');
    var rows = table.getElementsByTagName('tr');
    
    for (var i = 0; i < rows.length; i++) {
        var productName = rows[i].getElementsByTagName('td')[1];
        if (productName) {
            var txtValue = productName.textContent || productName.innerText;
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}

// Adicionar evento de busca quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    var searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.addEventListener('keyup', searchProducts);
    }
    
    // Adicionar eventos para os formulários (previne envio padrão)
    var forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Formulário enviado! (Em um sistema real, os dados seriam processados aqui)');
        });
    });
});

// Função para atualizar estatísticas (exemplo)
function updateStats() {
    // Esta função pode ser expandida para calcular automaticamente
    // as estatísticas baseadas nos dados dos produtos
    console.log('Atualizando estatísticas...');
}

// Função para adicionar novo produto (exemplo de como poderia funcionar)
function addProduct(codigo, nome, categoria, quantidade, preco) {
    // Em um sistema real, isso adicionaria o produto à base de dados
    // e atualizaria a tabela dinamicamente
    console.log('Adicionando produto:', {codigo, nome, categoria, quantidade, preco});
}

// Função para registrar movimentação (exemplo)
function registerMovement(produto, tipo, quantidade) {
    // Em um sistema real, isso registraria a movimentação
    // e atualizaria o estoque do produto
    console.log('Registrando movimentação:', {produto, tipo, quantidade});
}

// Função para determinar status do produto baseado na quantidade
function getProductStatus(quantidade) {
    if (quantidade === 0) {
        return 'esgotado';
    } else if (quantidade <= 10) {
        return 'baixo';
    } else {
        return 'disponivel';
    }
}

// Função para formatar valor em Real
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Função para formatar data
function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}