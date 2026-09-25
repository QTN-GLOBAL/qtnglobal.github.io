/* =========================
   ⭐ THÊM MỚI
   KIỂM TRA SẢN PHẨM CÓ 1 TẢI TRỌNG
========================= */

function getSingleCapacity(product) {

    if (!product || !product.specs) return "";

    const temp = document.createElement("div");

    temp.innerHTML = Array.isArray(product.specs)
        ? product.specs.join("")
        : product.specs;

    const capacities = [];

    const rows = temp.querySelectorAll("tr");

    rows.forEach(row => {

        const cols = row.querySelectorAll("td");

        if (cols.length < 2) return;

        const label = cols[0]
            .innerText
            .trim()
            .toLowerCase();

        if (
            label === "mức cân" ||
            label === "tải trọng" ||
            label === "mức tải"
        ) {

            const value = cols[1]
                .innerText
                .trim();

            if (value && !capacities.includes(value)) {
                capacities.push(value);
            }
        }
    });

    /*
     * Nếu bảng có dạng:
     *
     * Mức cân / Tải trọng
     * 1.5 tấn
     * 3 tấn
     * 5 tấn
     *
     * thì tìm thêm từ hàng tiêu đề.
     */

    const tables = temp.querySelectorAll("table");

    tables.forEach(table => {

        const tableRows = table.querySelectorAll("tr");

        if (!tableRows.length) return;

        const firstRow = tableRows[0];

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
            header === "mức tải" ||
            header === "mức cân / tải trọng"
        );

        if (capacityIndex === -1) return;

        tableRows.forEach((row, index) => {

            if (index === 0) return;

            const cells = row.querySelectorAll("td, th");

            if (cells.length > capacityIndex) {

                const value =
                    cells[capacityIndex]
                        .innerText
                        .trim();

                if (
                    value &&
                    !capacities.includes(value)
                ) {
                    capacities.push(value);
                }
            }
        });
    });

    /*
     * Chỉ trả về khi THỰC SỰ có đúng 1 tải trọng.
     *
     * Nếu có 2, 5, 6... tải trọng
     * → trả về rỗng
     * → code cũ tiếp tục chạy nguyên trạng.
     */

    if (capacities.length === 1) {
        return capacities[0];
    }

    return "";
}


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


    /* =================================================
       ⭐ THÊM MỚI
       NẾU CHỈ CÓ 1 TẢI TRỌNG
       → CHỈ HIỆN SỐ LƯỢNG
    ================================================= */

    const singleCapacity = getSingleCapacity(product);

    if (singleCapacity) {

        html = `
        <div class="addcart-row"
             data-index="single"
             data-single-capacity="${singleCapacity}">

            <div class="addcart-left">
                <input type="checkbox"
                       class="detail-check"
                       checked
                       style="display:none">
            </div>

            <div class="addcart-middle">
            </div>

            <div class="addcart-right">
                <button onclick="changeQty(this,-1)">-</button>
                <input type="number" value="1">
                <button onclick="changeQty(this,1)">+</button>
            </div>

        </div>`;

    } else {


        /* =============================================
           CODE CŨ
           GIỮ NGUYÊN TOÀN BỘ
        ============================================= */

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

    }


    document.getElementById("cartSpecList").innerHTML = html;

    // reset checkbox
    document.querySelectorAll(".detail-check").forEach(cb => {
        cb.checked = false;
    });

    // ⭐ THÊM MỚI
    // Với sản phẩm chỉ có 1 tải trọng,
    // checkbox bị ẩn nhưng phải luôn được chọn.
    if (singleCapacity) {

        document.querySelectorAll(
            ".addcart-row[data-index='single'] .detail-check"
        ).forEach(cb => {
            cb.checked = true;
        });

    }

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


        /* =========================================
           ⭐ THÊM MỚI
           NẾU LÀ SẢN PHẨM CHỈ CÓ 1 TẢI TRỌNG
           → LẤY TẢI TRỌNG TỪ DATA
        ========================================= */

        let label;

        if (row.dataset.singleCapacity) {

            label = row.dataset.singleCapacity;

        } else {

            /*
             * CODE CŨ
             * GIỮ NGUYÊN
             */

            label = row.querySelector(".addcart-middle").innerText;

        }


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