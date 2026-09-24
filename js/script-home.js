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

        const aId = String(a.id ?? "");
        const bId = String(b.id ?? "");

        const aNum = Number(aId);
        const bNum = Number(bId);

        if (!isNaN(aNum) && !isNaN(bNum)) {
            return aNum - bNum;
        }

        return aId.localeCompare(bId, undefined, {
            numeric: true,
            sensitivity: "base"
        });

    });

    currentBrandPage = 1;

    renderHomeGridPage(sortedProducts);
}

/* =========================
   HOME GRID PAGINATION
   12 PRODUCTS / PAGE
========================= */

/* =========================
   RENDER HOME GRID PAGE
========================= */

function renderHomeGridPage(products) {

    const container =
        document.getElementById("homeContainer");

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
    `;

    html += pageProducts.map(p => {

        const product =
            getTranslatedProduct(p) || p;

        return `
            <div class="product-card">

                <div class="brand-overlay">
                    ${p.brand
                        ? formatBrandName(p.brand)
                        : ""}
                </div>

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
                                (p.brand || '')
                                    .trim()
                                    .toUpperCase() === 'AMWAY'
                                    ? "location.href='amway-contact.html'"
                                    : `showQuote(${p.id})`
                            }"
                        >
                            ${
                                (p.brand || '')
                                    .trim()
                                    .toUpperCase() === 'AMWAY'
                                    ? t("contactConsultationBtn")
                                    : t("quoteBtn")
                            }
                        </button>

                    </div>

                </div>

            </div>
        `;

    }).join("");

    html += `
        </div>
    `;

    /* =========================
       PAGINATION
    ========================= */

    if (totalPages > 1) {

        html += `
            <div class="brand-pagination">

                <button
                    onclick="changeBrandPage(-1)"
                    ${currentBrandPage === 1
                        ? "disabled"
                        : ""}
                >
                    ❮
                </button>
        `;

        for (
            let i = 1;
            i <= totalPages;
            i++
        ) {

            html += `
                <button
                    class="${i === currentBrandPage
                        ? "active"
                        : ""}"
                    onclick="changeBrandPage(${i})"
                >
                    ${i}
                </button>
            `;

        }

        html += `
                <button
                    onclick="changeBrandPage(-2)"
                    ${currentBrandPage === totalPages
                        ? "disabled"
                        : ""}
                >
                    ❯
                </button>

            </div>
        `;

    }

    container.innerHTML = html;
}

/* =========================
   RENDER BRAND PAGE
========================= */

function renderBrandPage(brands) {

    const container = document.getElementById("homeContainer");

    if (!container) return;

    /*
       =========================
       TẠO DANH SÁCH SẢN PHẨM
       THEO THỨ TỰ THƯƠNG HIỆU
       =========================
    */

    let allProducts = [];

    brandOrder.forEach(brandKey => {

        if (brands[brandKey]) {

            allProducts = allProducts.concat(
                brands[brandKey]
            );

        }

    });

    /*
       =========================
       TÍNH SỐ TRANG
       =========================
    */

    const totalPages = Math.ceil(
        allProducts.length / PRODUCTS_PER_PAGE
    );

    if (totalPages === 0) {

        container.innerHTML = "";

        return;

    }

    if (currentBrandPage > totalPages) {

        currentBrandPage = 1;

    }

    /*
       =========================
       LẤY 12 SẢN PHẨM CỦA TRANG
       =========================
    */

    const start =
        (currentBrandPage - 1) * PRODUCTS_PER_PAGE;

    const pageProducts =
        allProducts.slice(
            start,
            start + PRODUCTS_PER_PAGE
        );

    /*
       =========================
       NHÓM LẠI THEO THƯƠNG HIỆU
       =========================
    */

    const pageBrands = {};

    pageProducts.forEach(product => {

        if (!product.brand) return;

        const key =
            product.brand.trim().toUpperCase();

        if (!pageBrands[key]) {

            pageBrands[key] = [];

        }

        pageBrands[key].push(product);

    });

    /*
       =========================
       HIỂN THỊ GRID
       =========================
    */

    let html = "";

    brandOrder.forEach(brandKey => {

        if (!pageBrands[brandKey]) return;

        html += createBrandSection(
            brandKey,
            pageBrands[brandKey]
        );

    });

    /*
       =========================
       PHÂN TRANG
       =========================
    */

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

        for (
            let i = 1;
            i <= totalPages;
            i++
        ) {

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
   CHANGE PAGE
========================= */

function changeBrandPage(page) {

    const products = getProducts();

    const sortedProducts = [...products].sort((a, b) => {

        const aId = String(a.id ?? "");
        const bId = String(b.id ?? "");

        const aNum = Number(aId);
        const bNum = Number(bId);

        if (!isNaN(aNum) && !isNaN(bNum)) {
            return aNum - bNum;
        }

        return aId.localeCompare(bId, undefined, {
            numeric: true,
            sensitivity: "base"
        });

    });

    const totalPages = Math.ceil(
        sortedProducts.length / PRODUCTS_PER_PAGE
    );

    /* NÚT TRANG TRƯỚC */

    if (page === -1) {

        if (currentBrandPage > 1) {
            currentBrandPage--;
        }

    }

    /* NÚT TRANG SAU */

    else if (page === -2) {

        if (currentBrandPage < totalPages) {
            currentBrandPage++;
        }

    }

    /* BẤM SỐ TRANG */

    else {

        currentBrandPage = page;

    }

    renderHomeGridPage(sortedProducts);

    /* CUỘN VỀ ĐẦU DANH SÁCH */

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

    return `
    <section class="brand-section">

        <h2 class="brand-title">
            ${formatBrandName(brandKey)}
        </h2>

        <div class="product-grid">

            ${items.map(p => {

                const product =
                    getTranslatedProduct(p) || p;

                return `
                <div class="product-card">

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
                                    (p.brand || '').trim().toUpperCase() === 'AMWAY'
                                        ? "location.href='amway-contact.html'"
                                        : `showQuote(${p.id})`
                                }"
                            >
                                ${
                                    (p.brand || '').trim().toUpperCase() === 'AMWAY'
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

    </section>
    `;
}

/* =========================
   LEGACY SLIDER COMPATIBILITY
   ========================= */

function renderSingleSlider(products = [], title = "") {

    /*
     * LEGACY COMPATIBILITY
     *
     * Các luồng cũ có thể vẫn gọi
     * renderSingleSlider().
     *
     * Tuy nhiên toàn bộ trang Sản phẩm
     * phải dùng chung:
     *
     * GRID + 12 sản phẩm/trang + phân trang.
     *
     * Vì vậy hàm này KHÔNG tạo slider nữa.
     */

    renderProductList(products, title);
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

/* =========================
   CATEGORY / BRAND GRID
========================= */

let currentListProducts = [];
let currentListTitle = "";

function renderProductList(products = [], title = "") {

    /*
     * TẤT CẢ DANH MỤC / THƯƠNG HIỆU /
     * BUSINESS ĐỀU ĐI QUA ĐÂY.
     *
     * GRID + 12 SẢN PHẨM / TRANG
     */

    currentListProducts = [...products]
        .filter(p => p && p.id && p.name)
        .sort((a, b) => Number(a.id) - Number(b.id));

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

    /* Đảm bảo page luôn hợp lệ */

    page = Math.max(
        1,
        Math.min(page, totalPages)
    );

    const start =
        (page - 1) * PRODUCTS_PER_PAGE;

    const end =
        start + PRODUCTS_PER_PAGE;

    const products =
        currentListProducts.slice(
            start,
            end
        );

    container.innerHTML = `
<div class="list-header">

    <button onclick="goHomePage()">
        ${t("home")}
    </button>

    <h2>
        ${formatBrandName(currentListTitle)}
    </h2>

</div>

<div class="product-grid">

${products.map(p => {

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

        <h3>
            ${product.name}
        </h3>

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
                    (p.brand || '').trim().toUpperCase() === 'AMWAY'
                        ? 'location.href=\\'amway-contact.html\\''
                        : 'showQuote(' + p.id + ')'
                }"
            >

                ${
                    (p.brand || '').trim().toUpperCase() === 'AMWAY'
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

${
    totalPages > 1
        ? `
<div class="pagination">

    <button
        onclick="changeListPage(${page - 1})"
        ${page === 1 ? "disabled" : ""}
    >
        ❮
    </button>

    ${
        Array.from(
            { length: totalPages },
            (_, i) => i + 1
        )
        .map(i => `
            <button
                class="${i === page ? "active" : ""}"
                onclick="changeListPage(${i})"
            >
                ${i}
            </button>
        `)
        .join("")
    }

    <button
        onclick="changeListPage(${page + 1})"
        ${page === totalPages ? "disabled" : ""}
    >
        ❯
    </button>

</div>
`
        : ""
}

`;
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

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* =========================
   BUSINESS FILTER
   GRID + 12 SẢN PHẨM / TRANG
========================= */

function filterByBusiness(business) {

    const products =
        getProducts();

    const normalizedBusiness =
        (business || "")
            .trim()
            .toUpperCase();

    const filtered =
        normalizedBusiness
            ? products.filter(p =>
                (p.business || "")
                    .trim()
                    .toUpperCase() === normalizedBusiness
            )
            : products;

    renderProductList(
        filtered,
        business
    );
}

/* =========================
   SESSION NAV
========================= */

function goHomeAndFilter(key, value) {

    sessionStorage.setItem(
        key,
        value
    );

    window.location.href =
        "index.html";
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

    console.log(
        "BUSINESS CLICK:",
        business
    );

    sessionStorage.setItem(
        "filterBusiness",
        business
    );

    window.location.href =
        "index.html";
}

/* =========================
   SHOW QUOTE
========================= */

function showQuote(id) {

    const product =
        getProducts().find(
            p => p.id === id
        );

    if (!product) return;

    if (
        (product.brand || "")
            .trim()
            .toUpperCase() === "AMWAY"
    ) {

        location.href =
            "amway-contact.html?id=" + id;

        return;
    }

    alert(
        "Chức năng nhận báo giá đang được cập nhật."
    );
}

/* =========================
   LEGACY GRID COMPATIBILITY
========================= */

function renderGridWithBrand(
    products = [],
    title = ""
) {

    /*
     * DÙNG CHUNG CƠ CHẾ:
     *
     * GRID
     * +
     * 12 sản phẩm / trang
     * +
     * phân trang
     */

    renderProductList(
        products,
        title
    );
}

/* =========================
   DOM READY
========================= */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const field =
            params.get("field");

        if (field) {

            /*
             * Dùng luôn system filter
             * sẵn có của website.
             */

            sessionStorage.setItem(
                "filterBusiness",
                field
            );

            /*
             * Trigger lại flow
             * giống index.
             */

            goHomeAndBusiness(
                field
            );

            /*
             * Xoá URL để tránh lặp.
             */

            window.history.replaceState(
                {},
                "",
                "index.html"
            );
        }

    }
);