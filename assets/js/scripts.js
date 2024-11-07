const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total"); // Renomeado para evitar conflito
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");

let cart = [];

const menuLinks = document.querySelectorAll('.navbar a');

menuLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex";
});

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Fechar o modal com o botão
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = 'none';
});

// Adicionar item ao carrinho quando clicar no menu
menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        addToCart(name, price);
    }
});

// Função para adicionar item no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCartModal();
}

// Atualiza o carrinho
function updateCartModal() {
    let total = 0;
    let itemCount = 0;
    let fullHTML = "";

    cart.forEach(item => {
        fullHTML += `
            <div class="items-cart">
                <div class="info-item">
                    <div>
                        <p class="name-item">${item.name}</p>
                        <p>Qtd: ${item.quantity}</p>
                        <p class="price-item">R$ ${item.price.toFixed(2)}</p>
                    </div>
                    <button class="btn-close remove-btn" data-name="${item.name}">Remover</button>               
                </div>
            </div>
        `;
        total += item.price * item.quantity;
        itemCount += item.quantity;
    });

    cartItemsContainer.innerHTML = fullHTML;
    cartTotalElement.textContent = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    cartCounter.innerHTML = itemCount;
}

// Remover item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartModal();
    }
}

// Evento para capturar endereço
addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    // Pode ser usado para validação ou processamento do endereço
});

// Checkout
checkoutBtn.addEventListener("click", function () {
    const isOpen = checkOpeningHours();
    if (!isOpen) {
        alert("Restaurante fechado no momento");
        return;
    }

    if (cart.length === 0) {
        alert("Carrinho está vazio.");
        return;
    }
    if (addressInput.value === "") {
        alert("Por favor, insira um endereço.");
        return;
    }

    const cartItems = cart.map((item) => {
        return `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price.toFixed(2)}`;
    }).join(" | ");

    const cartTotalText = cartTotalElement.innerText;
    let phoneNumber = document.getElementById("msg").value;
    const address = document.getElementById("address").value;

    if (!phoneNumber || !address) {
        alert("Por favor, preencha o número de telefone e o endereço de entrega.");
        return;
    }

    // Formatação do número de telefone
    phoneNumber = phoneNumber.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (phoneNumber.length < 10 || phoneNumber.length > 11) {
        alert("Por favor, insira um número de telefone válido com DDD.");
        return;
    }

    console.log("Número de telefone formatado:", phoneNumber);

    // Constrói a mensagem e o link do WhatsApp
    const message = `Pedido:\n\nItens:\n${cartItems}\n\nTotal: ${cartTotalText}\n\nEndereço de entrega: ${address}\n\nTelefone de contato: ${phoneNumber}`;
    const encodedMessage = encodeURIComponent(message);
    console.log("Mensagem codificada:", encodedMessage);

    const whatsappLink = `https://wa.me/55${phoneNumber}?text=${encodedMessage}`;

    // Exibir o link para depuração, se necessário
    console.log("Link do WhatsApp:", whatsappLink);

    // Abrir o WhatsApp
    window.open(whatsappLink, "_blank");

    // Fechar o modal e zerar o carrinho após o pedido ser enviado
    cartModal.style.display = 'none';
    cart = [];
    updateCartModal();
    addressInput.value = "";
    document.getElementById("msg").value = "";
});

function checkOpeningHours() {
    const data = new Date();
    const hora = data.getHours();
    const diaSemana = data.getDay();

    // Fechado nas segundas-feiras
    if (diaSemana === 1) return false;

    // Aberto de terça a domingo das 18:00 às 01:00
    return hora >= 18 || (hora >= 0 && hora < 1);
}

// Atualizar status de funcionamento
const spanItem = document.querySelector("#status");
const isOpen = checkOpeningHours();
const diaSemana = new Date().getDay();

if (isOpen) {
    spanItem.classList.remove("closed");
    spanItem.classList.add("open");
    spanItem.textContent = "Aberto - Ter à Dom - 18:00 às 01:00";
} else {
    spanItem.classList.remove("open");
    spanItem.classList.add("closed");
    if (diaSemana === 1) {
        spanItem.textContent = "Fechado - Segunda-feira";
    } else {
        spanItem.textContent = "Fechado - Ter à Dom - 18:00 às 01:00";
    }
}

// Função para abrir o modal de endereço
function mostrarModalAddress() {
    const modal = document.getElementById("modal-address");
    modal.style.display = "flex";
}

document.getElementById("modal-address").addEventListener("click", function (event) {
    if (event.target === this) {
        this.style.display = 'none';
    }
});