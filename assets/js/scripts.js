const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const spanItem = document.getElementById("date-span");

let cart = [];

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

        // Adicionar o item no carrinho
        addToCart(name, price);
    }
});

// Função para adicionar item no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        // Se o item já existe, aumenta a quantidade
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCartModal();
}

// Atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("items-cart");

        cartItemElement.innerHTML = `
            <div class="info-item">
                <div>
                    <p class="name-item">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="price-item">R$ ${item.price.toFixed(2)}</p>
                </div>
                <button class="btn-close remove-btn" data-name="${item.name}">Remover</button>               
            </div>
        `;

        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    cartCounter.innerHTML = cart.length;
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

// Evento para capturar endereço (implementação incompleta)
addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    // Pode ser usado para validação ou processamento do endereço
});

// Checkout
checkoutBtn.addEventListener("click", function () {
    // Verifica se o restaurante está aberto antes de finalizar
    const isOpen = checkOpeningHours();
    if (!isOpen) {
        alert("Restaurante fechado no momento");
        return;
    }

    if (cart.length === 0) return;
    if (addressInput.value === "") {
        alert("Por favor, insira um endereço.");
        return;
    }

    // Implementar o envio do pedido para o WhatsApp ou API desejada
    const carItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(carItems)
    const phone = "12992102803"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")
});

// Função para verificar horário de funcionamento
function checkOpeningHours() {
    const data = new Date();
    const hora = data.getHours();
    const diaSemana = data.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    // Fechado na segunda-feira (dia 1)
    if (diaSemana === 1) return false;
    return hora >= 18 && hora < 22;
}

// Atualizar status de funcionamento
const isOpen = checkOpeningHours();
const diaSemana = new Date().getDay();

if (isOpen) {
    spanItem.classList.remove("closed");
    spanItem.classList.add("open");
    spanItem.textContent = "Aberto - Ter à Dom - 18:00 às 22:00";
} else {
    spanItem.classList.remove("open");
    spanItem.classList.add("closed");
    // Mensagem específica para segunda-feira
    if (diaSemana === 1) {
        spanItem.textContent = "Fechado - Segunda-feira";
    } else {
        spanItem.textContent = "Fechado - Ter à Dom - 18:00 às 22:00";
    }
}
