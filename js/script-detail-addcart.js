
/* =========================
   GET PRODUCT CAPACITIES
   MỨC CÂN / TẢI TRỌNG
========================= */

function getProductCapacities(product) {

    if (!product || !product.specs) {
        return [];
    }

    const temp = document.createElement("div");

    /*
       specs của sản phẩm là ARRAY
       nên phải ghép lại trước khi đọc HTML
    */
    temp.innerHTML = Array.isArray(product.specs)
        ? product.specs.join("")
        : product.specs;

    const tables = temp.querySelectorAll("table");

    for (const table of tables) {

        const headerRow =
            table.querySelector("tr:first-child");

        if (!headerRow) continue;

        const headers =
            Array.from(
                headerRow.querySelectorAll("th")
            ).map(th =>
                th.innerText
                    .trim()
                    .toLowerCase()
            );

        /*
           Nhận cả:
           - Mức cân
           - Tải trọng
        */
        const capacityIndex =
            headers.findIndex(header =>
                header === "mức cân" ||
                header.includes("mức cân") ||
                header === "tải trọng" ||
                header.includes("tải trọng")
            );

        if (capacityIndex === -1) {
            continue;
        }

        const capacities = [];

        const rows =
            table.querySelectorAll("tr");

        rows.forEach((row, index) => {

            /*
               Bỏ dòng tiêu đề
            */
            if (index === 0) return;

            const cells =
                row.querySelectorAll("td");

            if (!cells.length) return;

            /*
               Lưu ý:
               rowspan ở các cột khác không ảnh hưởng
               đến cột Mức cân / Tải trọng.
            */
            const cell =
                cells[capacityIndex];

            if (!cell) return;

            const value =
                cell.innerText.trim();

            if (
                value &&
                !capacities.includes(value)
            ) {

                capacities.push(value);
            }
        });

        if (capacities.length) {

            return capacities;
        }
    }

    return [];
}


/* =========================
   ADD CART POPUP
========================= */

function openAddCartPopup() {

    if (!window.currentProduct) return;

    const product =
        window.currentProduct;

    /*
       CHẶN AMWAY
    */
    if (product.brand === "Amway") {

        window.open(
            "https://www.amway.com.vn",
            "_blank"
        );

        return;
    }

    window.selectedProduct =
        product;

    const popup =
        document.getElementById(
            "addCartPopup"
        );

    if (popup) {

        popup.style.display =
            "flex";
    }

    const name =
        document.getElementById(
            "popupCartName"
        );

    if (name) {

        name.innerText =
            product.name;
    }

    const img =
        document.getElementById(
            "popupCartImg"
        );

    if (img) {

        img.src =
            `images/${product.category}/${product.folder}/main.jpg`;
    }


    /*
       LẤY DANH SÁCH MỨC CÂN / TẢI TRỌNG
    */
    const capacities =
        getProductCapacities(product);

    let html = "";


    /*
       =========================
       NHIỀU MỨC
       =========================
    */

    if (capacities.length > 1) {

        html = `
        <div class="addcart-row">

            <div class="addcart-middle">

                <label>
                    Mức cân / Tải trọng
                </label>

                <select
                    class="cart-capacity-select"
                >

                    ${capacities.map(
                        capacity => `
                        <option value="${capacity}">
                            ${capacity}
                        </option>
                    `
                    ).join("")}

                </select>

            </div>

            <div class="addcart-right">

                <button
                    onclick="changeQty(this,-1)"
                >
                    -
                </button>

                <input
                    type="number"
                    value="1"
                    min="1"
                >

                <button
                    onclick="changeQty(this,1)"
                >
                    +
                </button>

            </div>

        </div>
        `;

    }

    /*
       =========================
       CHỈ MỘT MỨC
       =========================
    */

    else {

        const capacity =
            capacities.length === 1
                ? capacities[0]
                : "";

        html = `
        <div class="addcart-row">

            <div class="addcart-middle">

                ${
                    capacity
                        ? `
                        <span
                            class="single-capacity"
                        >
                            ${capacity}
                        </span>
                        `
                        : ""
                }

            </div>

            <div class="addcart-right">

                <button
                    onclick="changeQty(this,-1)"
                >
                    -
                </button>

                <input
                    type="number"
                    value="1"
                    min="1"
                >

                <button
                    onclick="changeQty(this,1)"
                >
                    +
                </button>

            </div>

        </div>
        `;
    }


    /*
       ĐƯA HTML VÀO POPUP
    */
    const list =
        document.getElementById(
            "cartSpecList"
        );

    if (list) {

        list.innerHTML =
            html;
    }


    /*
       I18N
    */
    setTimeout(() => {

        applyLanguage(
            localStorage.getItem(
                "language"
            ) || "vi"
        );

    }, 0);
}


/* =========================
   ADD TO CART
========================= */

function addSelectedToCart() {

    if (!window.currentProduct) {
        return;
    }

    const product =
        window.currentProduct;

    const popup =
        document.getElementById(
            "addCartPopup"
        );

    if (!popup) {
        return;
    }

    const row =
        popup.querySelector(
            ".addcart-row"
        );

    if (!row) {
        return;
    }


    /*
       SỐ LƯỢNG
    */
    const qtyInput =
        row.querySelector(
            "input[type='number']"
        );

    let quantity =
        parseInt(
            qtyInput?.value || 1
        );

    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
    }


    /*
       MỨC CÂN / TẢI TRỌNG
    */
    let capacity = "";

    const select =
        row.querySelector(
            ".cart-capacity-select"
        );

    /*
       NHIỀU MỨC
    */
    if (select) {

        capacity =
            select.value.trim();

    }

    /*
       MỘT MỨC
    */
    else {

        const single =
            row.querySelector(
                ".single-capacity"
            );

        if (single) {

            capacity =
                single.innerText.trim();
        }
    }


    /*
       THÊM VÀO GIỎ
    */
    Cart.add({

        id:
            Date.now() +
            Math.random(),

        productId:
            product.id,

        name:
            product.name,

        category:
            product.category,

        folder:
            product.folder,

        /*
           Lưu riêng mức cân /
           tải trọng
        */
        spec:
            capacity,

        quantity:
            quantity,

        selected:
            false
    });


    /*
       ĐÓNG POPUP
    */
    popup.style.display =
        "none";


    /*
       THÔNG BÁO
    */
    alert(
        t("addedToCart")
    );


    /*
       CẬP NHẬT GIỎ
    */
    if (
        typeof renderCart ===
        "function"
    ) {

        renderCart();
    }

    if (
        typeof updateCartUI ===
        "function"
    ) {

        updateCartUI();
    }

    if (
        typeof renderHeaderCart ===
        "function"
    ) {

        renderHeaderCart();
    }
}


/* =========================
   CLOSE ADD CART
========================= */

function closeAddCart() {

    const popup =
        document.getElementById(
            "addCartPopup"
        );

    if (popup) {

        popup.style.display =
            "none";
    }
}


/* =========================
   CONFIRM ADD CART
========================= */

function confirmAddCart() {

    addSelectedToCart();
}


/* =========================
   QTY CHANGE
========================= */

function changeQty(btn, delta) {

    const input =
        btn.parentElement.querySelector(
            "input"
        );

    if (!input) return;

    let val =
        parseInt(
            input.value || 1
        );

    if (isNaN(val)) {
        val = 1;
    }

    val += delta;

    if (val < 1) {
        val = 1;
    }

    input.value = val;
}

