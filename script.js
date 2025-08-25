// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDeky6vodmrC1neoxCrigEGGLvxcu81WPw",
  authDomain: "roblox-marketplace-fc59b.firebaseapp.com",
  projectId: "roblox-marketplace-fc59b",
  storageBucket: "roblox-marketplace-fc59b.firebasestorage.app",
  messagingSenderId: "1042562482941",
  appId: "1:1042562482941:web:a5a160ec9b6367444db494",
  measurementId: "G-QQ8XC8YVMK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Global variables
let cart = [];
let notifications = [];

// Tabs switching
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  tabContents.forEach(tc => tc.classList.remove('active'));
  document.getElementById(tab.dataset.tab).classList.add('active');
}));

// Add listing
document.getElementById("addAccount").addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const currency = document.getElementById("currency").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!username || !currency) {
    alert("Username and Currency are required!");
    return;
  }

  db.collection("listings").add({
    username,
    currency,
    description,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    notifications.push(`New listing added: ${username}`);
    updateNotifications();
    fetchListings();
    document.getElementById("username").value = "";
    document.getElementById("currency").value = "";
    document.getElementById("description").value = "";
  });
});

// Fetch and render listings
function fetchListings() {
  db.collection("listings").orderBy("timestamp", "desc").get().then(snapshot => {
    const grid = document.getElementById("marketplaceGrid");
    grid.innerHTML = "";
    snapshot.forEach(doc => {
      const acc = doc.data();
      const card = document.createElement("div");
      card.className = "account-item";
      card.innerHTML = `
        <div class="account-info">
          <strong>${acc.username}</strong>
          <span>${acc.description}</span>
          <span>Currency: ${acc.currency}</span>
        </div>
        <div>
          <button onclick="addToCart('${doc.id}')">Add to Cart</button>
        </div>
      `;
      grid.appendChild(card);
    });
  });
}

// Cart functionality
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartList = document.getElementById('cartList');

function addToCart(id) {
  if (cart.includes(id)) {
    alert("Already in cart");
    return;
  }
  cart.push(id);
  updateCart();
  notifications.push("Added to cart!");
  updateNotifications();
}

function updateCart() {
  document.getElementById('cartCount').textContent = cart.length;
  cartList.innerHTML = "";
  cart.forEach(id => {
    db.collection("listings").doc(id).get().then(doc => {
      const data = doc.data();
      if (data) {
        const item = document.createElement("div");
        item.className = "cart-item";
        item.innerHTML = `<span>${data.username}</span><button onclick="buyFromCart('${id}')">Buy</button>`;
        cartList.appendChild(item);
      }
    });
  });
}

function buyFromCart(id) {
  db.collection("listings").doc(id).delete().then(() => {
    cart = cart.filter(c => c !== id);
    updateCart();
    fetchListings();
    notifications.push("Purchase completed!");
    updateNotifications();
  });
}

// Notifications modal
const notifBtn = document.getElementById('notificationsBtn');
const notifModal = document.getElementById('notifModal');
const closeNotif = document.getElementById('closeNotif');
const notifList = document.getElementById('notifList');

function updateNotifications() {
  document.getElementById('notifCount').textContent = notifications.length;
  notifList.innerHTML = notifications.map(n => `<p>${n}</p>`).join('');
}

// Event
