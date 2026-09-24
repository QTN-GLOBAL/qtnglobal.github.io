/* =========================
   HOME PAGE (CLEAN CORE)
   - NO SLIDER LOGIC HERE
   - ONLY DATA + RENDER + FILTER
========================= */

let allProductsCache = [];

/* =========================
   BRAND ORDER
========================= */

const brandOrder = [
    "EXCELL",
    "OHAUS",
    "YAOHUA",
    "VIBRA",
    "JADEVER",
     "ONEKO",
     "FAITHFUL",
     "Shinko",
     "OKS",
     "HZ",
     "FUJI",
     "AMWAY"
];

/* =========================
   BRAND PAGINATION
========================= */

const BRANDS_PER_PAGE = 4;
const PRODUCTS_PER_PAGE = 12;

let currentBrandPage = 1;
let currentListProducts = [];
let currentListTitle = "";

/* =========================
   RENDER GRID (GENERIC)
========================= */

function renderProducts(productList = []) {

    const grid = document.getElementById("productGrid");
    if (!grid) return;

    grid.innerHTML = productList
        .filter(p => p && p.id && p.name)
        .map(p => {

            const product = getTranslatedProduct(p) || p;

            return `
<div class="product-card">
    <img src="images/${p.category}/${p.folder}/main.jpg">

    <div class="product-info">

        <h3>${product.name}</h3>

        <div class="product-buttons">

            <a class="detail-btn"
   href="${p.brand === 'Amway'
       ? 'amway.html'
       : 'chitiet.html'}?id=${p.id}">
                ${t("detailBtn")}
            </a>

            <button class="quote-btn"
        onclick="${(p.brand || '').trim().toUpperCase() === 'AMWAY'
            ? 'location.href=\'amway-contact.html\''
            : 'showQuote(' + p.id + ')'}">

    ${(p.brand || '').trim().toUpperCase() === 'AMWAY'
        ? 'Liên hệ tư vấn'
        : t("quoteBtn")}

</button>

        </div>

    </div>
</div>`;
        })
        .join("");
}

/* =========================
   FILTER
========================= */

function filterProducts(category) {

    const products = getProducts();

    const filtered = category
        ? products.filter(p => p.category === category)
        : products;

    renderProductList(filtered, category);
}

function filterByBrand(brand) {

    const products = getProducts();

    const filtered = brand
        ? products.filter(p =>
            p.brand?.trim().toUpperCase() === brand.toUpperCase()
        )
        : products;

    renderProductList(filtered, brand);
}

/* =========================
   HOME RENDER BY BRAND
========================= */

function renderHomeByBrand(productList = null) {

    const products = productList || getProducts();

    const sortedProducts = [...products].sort((a, b) => {

        const aId = Number(a.id);
        const bId = Number(b.id);

        if (!isNaN(aId) && !isNaN(bId)) {
            return aId - bId;
        }

        return String(a.id ?? "").localeCompare(
            String(b.id ?? ""),
            undefined,
            {
                numeric: true,
                sensitivity: "base"
            }
        );
    });

    currentBrandPage = 1;

    renderHomeGridPage(sortedProducts);
}

/* =========================
   HOME PRODUCT GRID
   12 PRODUCTS / PAGE
========================= */

function renderHomeGridPage(products = []) {

    const container = document.getElementById("homeContainer");

    if (!container) return;

    const totalPages = Math.ceil(
        products.length / PRODUCTS_PER_PAGE
    );

    if (currentBrandPage > totalPages) {
        currentBrandPage = 1;
    }

    const start =
        (currentBrandPage - 1) * PRODUCTS_PER_PAGE;

    const pageProducts =
        products.slice(
            start,
            start + PRODUCTS_PER_PAGE
        );

    let html = `
        <div class="product-grid">
            ${pageProducts.map(p => {

                const product =
                    getTranslatedProduct(p) || p;

                const brand =
                    (p.brand || "").trim();

                return `
                <div class="product-card">

                    ${brand ? `
                    <div class="brand-overlay">
                        ${formatBrandName(brand)}
                    </div>
                    ` : ""}

                    <img
                        src="images/${p.category}/${p.folder}/main.jpg"
                        alt="${product.name}"
                    >

                    <div class="product-info">

                        <h3>${product.name}</h3>

                        <div class="product-buttons">

                            <a
                                class="detail-btn"
                                href="${p.brand === 'Amway'
                                    ? 'amway.html'
                                    : 'chitiet.html'}?id=${p.id}"
                            >
                                ${t("detailBtn")}
                            </a>

                            <button
                                class="quote-btn"
                                onclick="${
                                    (p.brand || "")
                                        .trim()
                                        .toUpperCase() === "AMWAY"
                                        ? "location.href='amway-contact.html'"
                                        : `showQuote(${p.id})`
                                }"
                            >
                                ${
                                    (p.brand || "")
                                        .trim()
                                        .toUpperCase() === "AMWAY"
                                        ? t("contactConsultationBtn")
                                        : t("quoteBtn")
                                }
                            </button>

                        </div>

                    </div>

                </div>
                `;
            }).join("")}
        </div>
    `;

    if (totalPages > 1) {

        html += `
        <div class="brand-pagination">

            <button
                onclick="changeBrandPage(-1)"
                ${currentBrandPage === 1 ? "disabled" : ""}
            >
                ❮
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {

            html += `
            <button
                class="${i === currentBrandPage ? "active" : ""}"
                onclick="changeBrandPage(${i})"
            >
                ${i}
            </button>
            `;

        }

        html += `
            <button
                onclick="changeBrandPage(-2)"
                ${currentBrandPage === totalPages ? "disabled" : ""}
            >
                ❯
            </button>

        </div>
        `;
    }

    container.innerHTML = html;
}

/* =========================
   CHANGE HOME GRID PAGE
========================= */

function changeBrandPage(page) {

    const products = getProducts();

    const sortedProducts = [...products].sort((a, b) => {

        const aId = Number(a.id);
        const bId = Number(b.id);

        if (!isNaN(aId) && !isNaN(bId)) {
            return aId - bId;
        }

        return String(a.id ?? "").localeCompare(
            String(b.id ?? ""),
            undefined,
            {
                numeric: true,
                sensitivity: "base"
            }
        );
    });

    const totalPages = Math.ceil(
        sortedProducts.length / PRODUCTS_PER_PAGE
    );

    if (page === -1) {

        if (currentBrandPage > 1) {
            currentBrandPage--;
        }

    } else if (page === -2) {

        if (currentBrandPage < totalPages) {
            currentBrandPage++;
        }

    } else {

        currentBrandPage =
            Math.max(
                1,
                Math.min(page, totalPages)
            );
    }

    renderHomeGridPage(sortedProducts);

    const container =
        document.getElementById("homeContainer");

    if (container) {

        window.scrollTo({
            top: container.offsetTop - 20,
            behavior: "smooth"
        });
    }
}

/* =========================
   BRAND SECTION (ONLY HTML)
========================= */

function createBrandSection(brandKey, items) {

    /*
     * Compatibility only.
     * Main product listing no longer uses brand sections/sliders.
     */
    return "";
}

function renderSingleSlider(products, title) {

    /*
     * Compatibility for old callers.
     * Product categories/brands/business must use the
     * common GRID + 12 products/page renderer.
     */
    renderProductList(products || [], title || "");
}

/* =========================
   BRAND SLIDER CONTROL
   (LOGIC MOVED OUT)
========================= */

function goHomePage() {

    sessionStorage.removeItem("searchKeyword");
    sessionStorage.removeItem("filterCategory");
    sessionStorage.removeItem("filterBrand");
    sessionStorage.removeItem("filterBusiness");

    renderHomeByBrand();

    initHeroSlider();
}

/* =========================
   PRODUCT LIST PAGE
========================= */

function renderProductList(products = [], title = "") {

    currentListProducts = [...products]
        .filter(p => p && p.id && p.name)
        .sort((a, b) => {

            const aId = Number(a.id);
            const bId = Number(b.id);

            if (!isNaN(aId) && !isNaN(bId)) {
                return aId - bId;
            }

            return String(a.id ?? "").localeCompare(
                String(b.id ?? ""),
                undefined,
                {
                    numeric: true,
                    sensitivity: "base"
                }
            );
        });

    currentListTitle = title;

    renderListPage(1);
}

function renderListPage(page = 1) {

    const container =
        document.getElementById("homeContainer");

    if (!container) return;

    const totalPages = Math.ceil(
        currentListProducts.length / PRODUCTS_PER_PAGE
    );

    if (totalPages === 0) {

        container.innerHTML = `
            <div class="list-header">

                <button onclick="goHomePage()">
                    ${t("home")}
                </button>

                <h2>
                    ${formatBrandName(currentListTitle)}
                </h2>

            </div>

            <div class="product-grid"></div>
        `;

        return;
    }

    page = Math.max(
        1,
        Math.min(page, totalPages)
    );

    const start =
        (page - 1) * PRODUCTS_PER_PAGE;

    const pageProducts =
        currentListProducts.slice(
            start,
            start + PRODUCTS_PER_PAGE
        );

    let html = `
        <div class="list-header">

            <button onclick="goHomePage()">
                ${t("home")}
            </button>

            <h2>
                ${formatBrandName(currentListTitle)}
            </h2>

        </div>

        <div class="product-grid">

            ${pageProducts.map(p => {

                const product =
                    getTranslatedProduct(p) || p;

                const brand =
                    (p.brand || "").trim();

                return `
                <div class="product-card">

                    ${brand ? `
                    <div class="brand-overlay">
                        ${formatBrandName(brand)}
                    </div>
                    ` : ""}

                    <img
                        src="images/${p.category}/${p.folder}/main.jpg"
                        alt="${product.name}"
                    >

                    <div class="product-info">

                        <h3>${product.name}</h3>

                        <div class="product-buttons">

                            <a
                                class="detail-btn"
                                href="${p.brand === 'Amway'
                                    ? 'amway.html'
                                    : 'chitiet.html'}?id=${p.id}"
                            >
                                ${t("detailBtn")}
                            </a>

                            <button
                                class="quote-btn"
                                onclick="${
                                    (p.brand || "")
                                        .trim()
                                        .toUpperCase() === "AMWAY"
                                        ? "location.href='amway-contact.html'"
                                        : `showQuote(${p.id})`
                                }"
                            >
                                ${
                                    (p.brand || "")
                                        .trim()
                                        .toUpperCase() === "AMWAY"
                                        ? t("contactConsultationBtn")
                                        : t("quoteBtn")
                                }
                            </button>

                        </div>

                    </div>

                </div>
                `;
            }).join("")}

        </div>
    `;

    if (totalPages > 1) {

        html += `
        <div class="pagination">

            <button
                onclick="changeListPage(${page - 1})"
                ${page === 1 ? "disabled" : ""}
            >
                ❮
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {

            html += `
            <button
                class="${i === page ? "active" : ""}"
                onclick="changeListPage(${i})"
            >
                ${i}
            </button>
            `;

        }

        html += `
            <button
                onclick="changeListPage(${page + 1})"
                ${page === totalPages ? "disabled" : ""}
            >
                ❯
            </button>

        </div>
        `;
    }

    container.innerHTML = html;
}

function changeListPage(page) {

    const totalPages = Math.ceil(
        currentListProducts.length / PRODUCTS_PER_PAGE
    );

    if (
        page < 1 ||
        page > totalPages
    ) {
        return;
    }

    renderListPage(page);

    const container =
        document.getElementById("homeContainer");

    if (container) {

        window.scrollTo({
            top: container.offsetTop - 20,
            behavior: "smooth"
        });
    }
}

/* =========================
   SESSION NAV
========================= */

function goHomeAndFilter(key, value) {
    sessionStorage.setItem(key, value);
    window.location.href = "index.html";
}

function goHomeAndCategory(category) {

    sessionStorage.setItem(
        "filterCategory",
        category
    );

    window.location.href =
        "index.html";
}

function goHomeAndBrand(brand) {

    sessionStorage.setItem(
        "filterBrand",
        brand
    );

    window.location.href =
        "index.html";
}

function goHomeAndBusiness(business) {

    console.log("BUSINESS CLICK:", business);

    sessionStorage.setItem("filterBusiness", business);

    window.location.href = "index.html";
}


/* =========================
   SHOW QUOTE
========================= */

function showQuote(id) {

    const product = getProducts().find(p => p.id === id);

    if (!product) return;

    if ((product.brand || "").trim().toUpperCase() === "AMWAY") {

        location.href = "amway-contact.html?id=" + id;

        return;
    }

    alert("Chức năng nhận báo giá đang được cập nhật.");

}

function renderGridWithBrand(products = [], title = "") {

    /*
     * Compatibility for old callers.
     * Use the same common GRID + 12/page renderer.
     */
    renderProductList(products, title);
}

window.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const field = params.get("field");

    if (field) {

        // dùng luôn system filter sẵn có của bạn
        sessionStorage.setItem("filterBusiness", field);

        // trigger lại flow giống index
        goHomeAndBusiness(field);

        // xoá URL để tránh lặp
        window.history.replaceState({}, "", "index.html");
    }

});