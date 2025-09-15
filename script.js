// Sistema de Gerenciamento de Estoque com LocalStorage
class EstoqueManager {
    constructor() {
        this.produtos = this.carregarProdutos();
        this.produtoParaExcluir = null;
        this.editandoProduto = false;
        this.init();
    }

    init() {
        this.carregarDadosIniciais();
        this.atualizarInterface();
        this.setupEventListeners();
    }

    // Carregar dados iniciais se não existirem
    carregarDadosIniciais() {
        if (this.produtos.length === 0) {
            this.produtos = [
                { id: 1, codigo: '001', nome: 'Caneta Azul', categoria: 'Material Escolar', quantidade: 5, preco: 2.50 },
                { id: 2, codigo: '002', nome: 'Caderno 100 Folhas', categoria: 'Material Escolar', quantidade: 25, preco: 12.90 },
                { id: 3, codigo: '003', nome: 'Lápis HB', categoria: 'Material Escolar', quantidade: 50, preco: 1.20 },
                { id: 4, codigo: '004', nome: 'Borracha Branca', categoria: 'Material Escolar', quantidade: 30, preco: 0.80 },
                { id: 5, codigo: '005', nome: 'Régua 30cm', categoria: 'Material Escolar', quantidade: 15, preco: 3.50 },
                { id: 6, codigo: '006', nome: 'Papel A4', categoria: 'Escritório', quantidade: 2, preco: 25.00 },
                { id: 7, codigo: '007', nome: 'Grampeador', categoria: 'Escritório', quantidade: 0, preco: 45.00 }
            ];
            this.salvarProdutos();
        }
    }

    // LocalStorage
    carregarProdutos() {
        const dados = localStorage.getItem('estoque_produtos');
        return dados ? JSON.parse(dados) : [];
    }

    salvarProdutos() {
        localStorage.setItem('estoque_produtos', JSON.stringify(this.produtos));
    }

    // Funções CRUD
    adicionarProduto(produto) {
        const novoId = this.produtos.length > 0 ? Math.max(...this.produtos.map(p => p.id)) + 1 : 1;
        produto.id = novoId;
        this.produtos.push(produto);
        this.salvarProdutos();
        this.atualizarInterface();
    }

    editarProduto(id, produtoAtualizado) {
        const index = this.produtos.findIndex(p => p.id === id);
        if (index !== -1) {
            this.produtos[index] = { ...this.produtos[index], ...produtoAtualizado };
            this.salvarProdutos();
            this.atualizarInterface();
        }
    }

    excluirProduto(id) {
        this.produtos = this.produtos.filter(p => p.id !== id);
        this.salvarProdutos();
        this.atualizarInterface();
    }

    // Interface
    atualizarInterface() {
        this.atualizarTabelaProdutos();
        this.atualizarResumo();
        this.atualizarProdutosBaixoEstoque();
        this.atualizarSelectsMovimentacao();
    }

    atualizarTabelaProdutos() {
        const tbody = document.getElementById('produtos-tbody');
        if (!tbody) return;

        tbody.innerHTML = this.produtos.map(produto => `
            <tr>
                <td>${produto.codigo}</td>
                <td>${produto.nome}</td>
                <td>${produto.categoria}</td>
                <td>${produto.quantidade}</td>
                <td>${this.formatCurrency(produto.preco)}</td>
                <td><span class="status ${this.getStatusClass(produto.quantidade)}">${this.getStatusText(produto.quantidade)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-edit" onclick="estoqueManager.iniciarEdicao(${produto.id})">Editar</button>
                        <button class="btn-action btn-delete" onclick="estoqueManager.confirmarExclusao(${produto.id})">Excluir</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    atualizarResumo() {
        const summaryCards = document.getElementById('summary-cards');
        if (!summaryCards) return;

        const stats = this.calcularEstatisticas();
        
        summaryCards.innerHTML = `
            <div class="summary-card">
                <h3>${stats.total}</h3>
                <p>Total de Produtos</p>
            </div>
            <div class="summary-card">
                <h3>${stats.baixoEstoque}</h3>
                <p>Estoque Baixo</p>
            </div>
            <div class="summary-card">
                <h3>${stats.esgotados}</h3>
                <p>Produtos Esgotados</p>
            </div>
            <div class="summary-card">
                <h3>${this.formatCurrency(stats.valorTotal)}</h3>
                <p>Valor Total</p>
            </div>
        `;

        // Atualizar alerta
        const alert = document.querySelector('.alert-warning');
        if (alert) {
            alert.innerHTML = `<strong>Atenção!</strong> Você tem ${stats.baixoEstoque} produtos com estoque baixo.`;
        }
    }

    atualizarProdutosBaixoEstoque() {
        const tbody = document.getElementById('produtos-baixo-tbody');
        if (!tbody) return;

        const produtosBaixo = this.produtos.filter(p => p.quantidade <= 10);
        
        tbody.innerHTML = produtosBaixo.map(produto => `
            <tr>
                <td>${produto.codigo}</td>
                <td>${produto.nome}</td>
                <td>${produto.quantidade}</td>
                <td><span class="status ${this.getStatusClass(produto.quantidade)}">${this.getStatusText(produto.quantidade)}</span></td>
            </tr>
        `).join('');
    }

    atualizarSelectsMovimentacao() {
        const selects = document.querySelectorAll('#movimentacao select');
        const options = this.produtos.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
        
        selects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Selecione um produto</option>' + options;
            select.value = currentValue;
        });
    }

    // Edição de produtos
    iniciarEdicao(id) {
        const produto = this.produtos.find(p => p.id === id);
        if (!produto) return;

        this.editandoProduto = true;
        
        // Preencher formulário
        document.getElementById('produto-id').value = produto.id;
        document.getElementById('codigo').value = produto.codigo;
        document.getElementById('nome').value = produto.nome;
        document.getElementById('categoria').value = produto.categoria;
        document.getElementById('quantidade').value = produto.quantidade;
        document.getElementById('preco').value = produto.preco;

        // Atualizar interface do formulário
        document.getElementById('form-title').textContent = 'Editar Produto';
        document.getElementById('btn-salvar').textContent = 'Salvar Alterações';
        document.getElementById('btn-cancelar').style.display = 'block';

        // Ir para a aba de produtos
        this.showTab('produtos');
        
        // Scroll para o formulário
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }

    cancelarEdicao() {
        this.editandoProduto = false;
        this.limparFormulario();
        
        document.getElementById('form-title').textContent = 'Adicionar Novo Produto';
        document.getElementById('btn-salvar').textContent = 'Adicionar Produto';
        document.getElementById('btn-cancelar').style.display = 'none';
    }

    // Exclusão de produtos
    confirmarExclusao(id) {
        this.produtoParaExcluir = id;
        document.getElementById('modal-confirmacao').style.display = 'block';
    }

    excluirProdutoConfirmado() {
        if (this.produtoParaExcluir) {
            this.excluirProduto(this.produtoParaExcluir);
            this.produtoParaExcluir = null;
        }
        this.fecharModal();
    }

    fecharModal() {
        document.getElementById('modal-confirmacao').style.display = 'none';
        this.produtoParaExcluir = null;
    }

    // Utilidades
    calcularEstatisticas() {
        return {
            total: this.produtos.length,
            baixoEstoque: this.produtos.filter(p => p.quantidade > 0 && p.quantidade <= 10).length,
            esgotados: this.produtos.filter(p => p.quantidade === 0).length,
            valorTotal: this.produtos.reduce((total, p) => total + (p.quantidade * p.preco), 0)
        };
    }

    getStatusClass(quantidade) {
        if (quantidade === 0) return 'esgotado';
        if (quantidade <= 10) return 'baixo';
        return 'disponivel';
    }

    getStatusText(quantidade) {
        if (quantidade === 0) return 'Esgotado';
        if (quantidade <= 10) return 'Estoque Baixo';
        return 'Disponível';
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    limparFormulario() {
        document.getElementById('produto-form').reset();
        document.getElementById('produto-id').value = '';
    }

    // Busca
    buscarProdutos(termo) {
        const tbody = document.getElementById('produtos-tbody');
        const rows = tbody.getElementsByTagName('tr');
        
        for (let i = 0; i < rows.length; i++) {
            const nome = rows[i].getElementsByTagName('td')[1];
            if (nome) {
                const texto = nome.textContent.toLowerCase();
                if (texto.includes(termo.toLowerCase())) {
                    rows[i].style.display = '';
                } else {
                    rows[i].style.display = 'none';
                }
            }
        }
    }

    // Navegação
    showTab(tabName) {
        // Ocultar todas as abas
        const contents = document.getElementsByClassName('tab-content');
        for (let i = 0; i < contents.length; i++) {
            contents[i].classList.remove('active');
        }
        
        // Remover classe active de todos os botões
        const buttons = document.getElementsByClassName('tab-button');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');
        }
        
        // Mostrar aba selecionada
        document.getElementById(tabName).classList.add('active');
        
        // Ativar botão correspondente
        const targetButton = Array.from(buttons).find(btn => 
            btn.getAttribute('onclick') === `showTab('${tabName}')`
        );
        if (targetButton) {
            targetButton.classList.add('active');
        }
    }

    setupEventListeners() {
        // Formulário de produto
        const form = document.getElementById('produto-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.salvarProduto();
            });
        }

        // Busca
        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            searchBox.addEventListener('keyup', (e) => {
                this.buscarProdutos(e.target.value);
            });
        }

        // Fechar modal ao clicar fora
        const modal = document.getElementById('modal-confirmacao');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.fecharModal();
                }
            });
        }
    }

    salvarProduto() {
        const id = document.getElementById('produto-id').value;
        const produto = {
            codigo: document.getElementById('codigo').value,
            nome: document.getElementById('nome').value,
            categoria: document.getElementById('categoria').value,
            quantidade: parseInt(document.getElementById('quantidade').value),
            preco: parseFloat(document.getElementById('preco').value)
        };

        if (this.editandoProduto && id) {
            this.editarProduto(parseInt(id), produto);
            this.cancelarEdicao();
        } else {
            this.adicionarProduto(produto);
            this.limparFormulario();
        }
    }
}

// Instância global
let estoqueManager;

// Funções globais para compatibilidade
function showTab(tabName) {
    estoqueManager.showTab(tabName);
}

function cancelarEdicao() {
    estoqueManager.cancelarEdicao();
}

function confirmarExclusao() {
    estoqueManager.excluirProdutoConfirmado();
}

function fecharModal() {
    estoqueManager.fecharModal();
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    estoqueManager = new EstoqueManager();
});
