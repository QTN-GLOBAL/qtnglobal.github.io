/* =========================
   ADD CART POPUP (FIXED VERSION)
========================= */

function openAddCartPopup() {

    if (!window.currentProduct) return;

    const product = window.currentProduct;

    // ⭐ CHẶN AMWAY NGAY TỪ ĐẦU
    if (product.brand === "Amway") {
        window.open("https://www.amway.com.vn", "_blank");
        return;
    }

    window.selectedProduct = product;

    const popup = document.getElementById("addCartPopup");
    if (popup) popup.style.display = "flex";

    document.getElementById("popupCartName").innerText = product.name;

    document.getElementById("popupCartImg").src =
        `images/${product.category}/${product.folder}/main.jpg`;

    let html = "";

    const temp = document.createElement("div");
    temp.innerHTML = product.specs;

    const rows = temp.querySelectorAll("tr");

    rows.forEach((row, index) => {

        const cols = row.querySelectorAll("td");

        if (cols.length >= 2) {

            const label = cols[0].innerText + " - " + cols[1].innerText;

            html += `
            <div class="addcart-row"
                 data-index="${index}">

                <div class="addcart-left">
                    <input type="checkbox" class="detail-check" checked>
                </div>

                <div class="addcart-middle">
                    ${label}
                </div>

                <div class="addcart-right">
                    <button onclick="changeQty(this,-1)">-</button>
                    <input type="number" value="1">
                    <button onclick="changeQty(this,1)">+</button>
                </div>

            </div>`;
        }
    });

    document.getElementById("cartSpecList").innerHTML = html;

    // reset checkbox
    document.querySelectorAll(".detail-check").forEach(cb => {
        cb.checked = false;
    });

    // reset qty
    document.querySelectorAll(".addcart-row input[type='number']")
        .forEach(input => input.value = 1);

    // ✅ FIX I18N - THÊM ĐOẠN NÀY
    setTimeout(() => {
        applyLanguage(localStorage.getItem("language") || "vi");
    }, 0);
}

/* =========================
   ADD TO CART (FIXED)
========================= */

function addSelectedToCart() {

    if (!window.currentProduct) return;

    const product = window.currentProduct;
    const popup = document.getElementById("addCartPopup");

    const rows = popup.querySelectorAll(".addcart-row");

    let added = false;

    rows.forEach(row => {

       const check = row.querySelector(".detail-check");

if (!check || check.checked !== true) return;
        const label = row.querySelector(".addcart-middle").innerText;

        const qty = parseInt(
            row.querySelector("input[type='number']").value
        ) || 1;

        // 🔥 FIX QUAN TRỌNG: luôn có id
       Cart.add({
            id: Date.now() + Math.random(), // id dòng giỏ hàng
            productId: product.id,          // id sản phẩm thật
            name: product.name,
            category: product.category,
            folder: product.folder,
            spec: label,
            quantity: qty,
            selected: false
        });

        added = true;
    });

    if (!added) {
    alert(t("pleaseSelectProduct"));
    return;
}

popup.style.display = "none";

alert(t("addedToCart"));

    if (typeof renderCart === "function") renderCart();
    if (typeof updateCartUI === "function") updateCartUI();
    if (typeof renderHeaderCart === "function") renderHeaderCart();
document.querySelectorAll(".detail-check").forEach(cb => cb.checked = false);
document.querySelectorAll(".addcart-row input[type='number']").forEach(i => i.value = 1);
}

/* =========================
   CLOSE POPUP
========================= */

function closeAddCart() {
    const popup = document.getElementById("addCartPopup");
    if (popup) popup.style.display = "none";
}

function confirmAddCart() {
    addSelectedToCart();
}

/* =========================
   QTY CHANGE
========================= */

function changeQty(btn, delta) {

    const input = btn.parentElement.querySelector("input");

    let val = parseInt(input.value || 1);

    val += delta;

    if (val < 1) val = 1;

    input.value = val;
}