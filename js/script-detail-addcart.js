/* =========================
   GET PRODUCT CAPACITIES
   TỰ ĐỘNG ĐỌC TẢI TRỌNG
========================= */

function getProductCapacities(product) {

    if (!product || !product.specs) return [];

    const specs = Array.isArray(product.specs)
        ? product.specs.join("")
        : product.specs;

    const temp = document.createElement("div");
    temp.innerHTML = specs;

    const capacities = [];

    function addCapacity(value) {

        value = String(value || "").trim();

        if (!value) return;

        if (!capacities.includes(value)) {
            capacities.push(value);
        }
    }

    /*
     * TRƯỜNG HỢP 1:
     *
     * Bảng dạng:
     *
     * Mức cân | Bước nhảy | ...
     * 1.5kg   | 0.1g
     * 3kg     | 0.1g
     * 6kg     | 0.2g
     */

    const tables = temp.querySelectorAll("table");

    tables.forEach(table => {

        const rows = table.querySelectorAll("tr");

        if (!rows.length) return;

        const firstRow = rows[0];

        const headers = Array.from(
            firstRow.querySelectorAll("th, td")
        ).map(cell =>
            cell.innerText
                .trim()
                .toLowerCase()
        );

        const capacityIndex = headers.findIndex(header =>
            header === "mức cân" ||
            header === "tải trọng" ||
            header === "mức tải"
        );

        if (capacityIndex !== -1) {

            rows.forEach((row, rowIndex) => {

                if (rowIndex === 0) return;

                const cells = row.querySelectorAll("td, th");

                if (cells.length > capacityIndex) {

                    addCapacity(
                        cells[capacityIndex].innerText
                    );

                }

            });

        }

        /*
         * TRƯỜNG HỢP 2:
         *
         * Bảng dạng:
         *
         * Thông số | Chi tiết
         * Mức tải  | 3 tấn
         */

        rows.forEach(row => {

            const cells = row.querySelectorAll("td");

            if (cells.length < 2) return;

            const label = cells[0]
                .innerText
                .trim()
                .toLowerCase();

            if (
                label === "mức cân" ||
                label === "tải trọng" ||
                label === "mức tải"
            ) {

                addCapacity(
                    cells[1].innerText
                );

            }

        });

    });

    return capacities;
}


/* =========================
   ADD CART POPUP
========================= */

function openAddCartPopup() {

    if (!window.currentProduct) return;

    const product = window.currentProduct;

    // CHẶN AMWAY
    if (product.brand === "Amway") {
        window.open(
            "https://www.amway.com.vn",
            "_blank"
        );
        return;
    }

    window.selectedProduct = product;

    const popup =
        document.getElementById("addCartPopup");

    if (popup) {
        popup.style.display = "flex";
    }

    document.getElementById("popupCartName").innerText =
        product.name;

    document.getElementById("popupCartImg").src =
        `images/${product.category}/${product.folder}/main.jpg`;

    const capacities =
        getProductCapacities(product);

    let html = "";

    /*
     * NHIỀU TẢI TRỌNG
     * → HIỆN SELECT TẢI TRỌNG
     */

    if (capacities.length > 1) {

        html = `
        <div class="addcart-row">

            <div class="addcart-middle">
                <strong>Tải trọng:</strong>

                <select class="addcart-capacity">
                    ${capacities.map(capacity => `
                        <option value="${capacity}">
                            ${capacity}
                        </option>
                    `).join("")}
                </select>
            </div>

            <div class="addcart-right">

                <button onclick="changeQty(this,-1)">
                    -
                </button>

                <input
                    type="number"
                    value="1"
                    min="1"
                >

                <button onclick="changeQty(this,1)">
                    +
                </button>

            </div>

        </div>
        `;

    }

    /*
     * CHỈ CÓ 1 TẢI TRỌNG
     * → KHÔNG HIỆN SELECT
     * → CHỈ HIỆN SỐ LƯỢNG
     */

    else {

        html = `
        <div
            class="addcart-row"
            data-capacity="${capacities[0] || ""}"
        >

            <div class="addcart-middle">
                <strong>Số lượng:</strong>
            </div>

            <div class="addcart-right">

                <button onclick="changeQty(this,-1)">
                    -
                </button>

                <input
                    type="number"
                    value="1"
                    min="1"
                >

                <button onclick="changeQty(this,1)">
                    +
                </button>

            </div>

        </div>
        `;

    }

    document.getElementById("cartSpecList").innerHTML =
        html;

    /*
     * I18N
     */

    setTimeout(() => {

        if (typeof applyLanguage === "function") {

            applyLanguage(
                localStorage.getItem("language") || "vi"
            );

        }

    }, 0);
}


/* =========================
   ADD SELECTED TO CART
========================= */

function addSelectedToCart() {

    if (!window.currentProduct) return;

    const product = window.currentProduct;

    const popup =
        document.getElementById("addCartPopup");

    if (!popup) return;

    const row =
        popup.querySelector(".addcart-row");

    if (!row) return;

    /*
     * LẤY TẢI TRỌNG
     */

    let capacity = "";

    const select =
        row.querySelector(".addcart-capacity");

    if (select) {

        capacity = select.value;

    } else {

        /*
         * SẢN PHẨM CHỈ CÓ 1 TẢI TRỌNG
         */

        capacity =
            row.dataset.capacity || "";

    }

    /*
     * LẤY SỐ LƯỢNG
     */

    const qtyInput =
        row.querySelector(
            "input[type='number']"
        );

    const qty =
        parseInt(qtyInput?.value) || 1;

    /*
     * THÊM VÀO GIỎ
     */

    Cart.add({

        id: Date.now() + Math.random(),

        productId: product.id,

        name: product.name,

        category: product.category,

        folder: product.folder,

        /*
         * LƯU TẢI TRỌNG VÀO SPEC
         */

        spec: capacity,

        quantity: qty,

        selected: false

    });

    /*
     * ĐÓNG POPUP
     */

    popup.style.display = "none";

    /*
     * THÔNG BÁO
     */

    alert(t("addedToCart"));

    /*
     * CẬP NHẬT GIỎ
     */

    if (typeof renderCart === "function") {
        renderCart();
    }

    if (typeof updateCartUI === "function") {
        updateCartUI();
    }

    if (typeof renderHeaderCart === "function") {
        renderHeaderCart();
    }
}


/* =========================
   CLOSE ADD CART
========================= */

function closeAddCart() {

    const popup =
        document.getElementById("addCartPopup");

    if (popup) {

        popup.style.display = "none";

    }

}


/* =========================
   CONFIRM ADD CART
========================= */

function confirmAddCart() {

    addSelectedToCart();

}


/* =========================
   QUANTITY
========================= */

function changeQty(btn, delta) {

    const input =
        btn.parentElement.querySelector(
            "input[type='number']"
        );

    if (!input) return;

    let value =
        parseInt(input.value) || 1;

    value += delta;

    if (value < 1) {
        value = 1;
    }

    input.value = value;

}