const products = [
  { id: 1, name: "Latte", price: 3.50, icon: "Images/latte.png" },
  { id: 2, name: "Cappuccino", price: 3.40, icon: "Images/cappuccino.png" },
  { id: 3, name: "Americano", price: 2.90, icon: "Images/americano.png" },
  { id: 4, name: "Croissant", price: 2.60, icon: "Images/croissant.png" }
];

const sizePrices = { Small: 0, Medium: 0.5, Large: 1.0 };
const syrupPrices = { None: 0, Vanilla: 0.4, Caramel: 0.4, Hazelnut: 0.4 };

function calculatePrice(basePrice, size, syrup) {
  return basePrice + sizePrices[size] + syrupPrices[syrup];
}

function renderMenu() {
  if (!menuItemsDiv) return;

  menuItemsDiv.innerHTML = "";

  for (let product of products) {
    const card = document.createElement("div");
    card.className = "card";

    const isDrink = product.name !== "Croissant";

    card.innerHTML = `
      <h3 class="menuTitle">
        <span>${product.name}</span>
      </h3>
      <img class="menuIcon" src="${product.icon}" alt="${product.name} icon">
      <p>€${product.price.toFixed(2)}</p>

      ${isDrink ? `
        <label>
          Size:
          <select class="sizeSelect">
            <option value="Small">Small</option>
            <option value="Medium" selected>Medium</option>
            <option value="Large">Large</option>
          </select>
        </label>

        <label>
          Syrup:
          <select class="syrupSelect">
            <option value="None" selected>None</option>
            <option value="Vanilla">Vanilla</option>
            <option value="Caramel">Caramel</option>
            <option value="Hazelnut">Hazelnut</option>
          </select>
        </label>
      ` : ""}

      <button class="addBtn">Add</button>
    `;

    const addBtn = card.querySelector(".addBtn");

    addBtn.addEventListener("click", function () {

      let size = "Small";
      let syrup = "None";
      let finalPrice = product.price;

      if (isDrink) {
        const sizeSelect = card.querySelector(".sizeSelect");
        const syrupSelect = card.querySelector(".syrupSelect");

        size = sizeSelect.value;
        syrup = syrupSelect.value;

        finalPrice = calculatePrice(product.price, size, syrup);
      }

      addToCart({
        id: product.id,
        name: product.name,
        size: size,
        syrup: syrup,
        price: finalPrice
      });
    });

    menuItemsDiv.appendChild(card);
  }
}

function getCart() {
  const saved = localStorage.getItem("cart");
  return saved ? JSON.parse(saved) : [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

const menuItemsDiv = document.getElementById("menuItems");

const cartItemsDiv = document.getElementById("cartItems");
const cartCountSpan = document.getElementById("cartCount");
const cartTotalSpan = document.getElementById("cartTotal");
const clearBtn = document.getElementById("clearBtn");

const checkoutForm = document.getElementById("checkoutForm");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const messageP = document.getElementById("message");
const checkoutTotalSpan = document.getElementById("checkoutTotal");

function updateNavCartCount() {
  const cart = getCart();
  const countEls = document.querySelectorAll(".cartCount");
  countEls.forEach(el => el.textContent = cart.length);
}

function addToCart(item) {
  const cart = getCart();
  cart.push(item);
  saveCart(cart);

  updateNavCartCount();
  renderCart();
  renderCheckoutTotal();

  alert(item.name + " added to cart!");
}

function renderCart() {
  if (!cartItemsDiv || !cartCountSpan || !cartTotalSpan) return;

  const cart = getCart();
  cartItemsDiv.innerHTML = "";

  let total = 0;

  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price;

    const itemDiv = document.createElement("div");
    itemDiv.innerHTML = `
  ${cart[i].name}
  ${cart[i].size && cart[i].syrup ? `(${cart[i].size}, ${cart[i].syrup})` : ""}
  - €${cart[i].price.toFixed(2)}
  <button onclick="removeFromCart(${i})">Remove</button>
`;
    cartItemsDiv.appendChild(itemDiv);
  }

  cartCountSpan.textContent = cart.length;
  cartTotalSpan.textContent = total.toFixed(2);
}

function renderCheckoutTotal() {
  if (!checkoutTotalSpan) return;

  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  checkoutTotalSpan.textContent = total.toFixed(2);
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);

  updateNavCartCount();
  renderCart();
  renderCheckoutTotal();
}

if (clearBtn) {
  clearBtn.addEventListener("click", function () {
    saveCart([]);
    updateNavCartCount();
    renderCart();
    renderCheckoutTotal();
  });
}

if (checkoutForm) {
  checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const cart = getCart();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    if (cart.length === 0) {
      messageP.textContent = "Your cart is empty. Add something first!";
      return;
    }

    if (name === "") {
      messageP.textContent = "Please enter your name.";
      return;
    }

    if (!email.includes("@")) {
      messageP.textContent = "Please enter a valid email.";
      return;
    }

    messageP.textContent = `Thanks, ${name}! Your order total is €${total.toFixed(2)}.`;

    saveCart([]);
    updateNavCartCount();
    renderCart();
    renderCheckoutTotal();
    checkoutForm.reset();
  });
}

updateNavCartCount();
renderMenu();
renderCart();
renderCheckoutTotal();