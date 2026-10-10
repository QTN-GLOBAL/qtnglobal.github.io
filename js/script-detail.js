/* =====================================================
   QTN GLOBAL
   PRODUCT DETAIL SCRIPT
   VERSION 1.1

   PART 1:
   LOAD PRODUCT
   HIỂN THỊ:
   - Tên sản phẩm
   - Hãng
   - Xuất xứ
   - Mô tả trong TAB MÔ TẢ
===================================================== */


// =====================================================
// 1. LẤY ID SẢN PHẨM TỪ URL
// =====================================================

const detailId =
Number(
    new URLSearchParams(location.search).get("id")
);


// =====================================================
// 2. TÌM SẢN PHẨM TRONG products.js
// =====================================================

const rawProduct =
products.find(p => p.id === detailId);


const product =
rawProduct
?
(getTranslatedProduct(rawProduct) || rawProduct)
:
null;


// lưu sản phẩm hiện tại
window.currentProduct = product;


// =====================================================
// 3. HIỂN THỊ THÔNG TIN SẢN PHẨM
// =====================================================

if(product){


    // TÊN

    const name =
    document.getElementById("productName");


    if(name){

        name.innerText =
        product.name;

    }


    // HÃNG

    const brand =
    document.getElementById("productBrand");


    if(brand){

        brand.innerText =
        product.brand || "";

    }


    // XUẤT XỨ

    const origin =
    document.getElementById("productOrigin");


    if(origin){

        origin.innerText =
        product.origin || "";

    }


    // =================================================
    // MÔ TẢ
    // HIỂN THỊ TRONG TAB MÔ TẢ
    // =================================================

    const tabDescription =
    document.getElementById(
        "productTabDescription"
    );


    if(tabDescription){

        const sectionDescription =
            product.sections?.description ||
            product.description ||
            "";


        tabDescription.innerHTML =
            sectionDescription;

    }

}


/* =====================================================
   PART 2:
   PRODUCT IMAGE SLIDER

   Chức năng:
   - Ảnh chính
   - Thumbnail
   - Click đổi ảnh
===================================================== */


if(product){


    const imageList = [];


    for(let i = 1; i <= 5; i++){


        imageList.push(

            `images/${product.category}/${product.folder}/${i}.jpg`

        );


    }


    // HIỂN THỊ ẢNH CHÍNH

    const mainImage =
    document.getElementById("mainImage");


    if(mainImage){

        mainImage.src =
        imageList[0];

    }


    // TẠO THUMBNAIL

    const thumbList =
    document.getElementById("thumbList");


    if(thumbList){


        let html = "";


        imageList.forEach((img,index)=>{


            html += `

            <img 
                src="${img}"
                data-index="${index}"
                onclick="changeDetailImage(${index})"
                onerror="this.style.display='none'"
            >

            `;


        });


        thumbList.innerHTML =
        html;


    }


    // ĐỔI ẢNH KHI CLICK

    window.changeDetailImage =
    function(index){


        if(mainImage){

            mainImage.src =
            imageList[index];

        }


        document
        .querySelectorAll("#thumbList img")
        .forEach(img=>{

            img.classList.remove("active");

        });


        const active =
        document.querySelector(
            '#thumbList img[data-index="' + index + '"]'
        );


        if(active){

            active.classList.add("active");

        }


    };


    // ACTIVE ẢNH ĐẦU TIÊN

    setTimeout(()=>{


        const first =
        document.querySelector("#thumbList img");


        if(first){

            first.classList.add("active");

        }


    },100);


}


/* =====================================================
   PART 2.1:
   AUTO IMAGE SLIDER

   Chức năng:
   - Tự động đổi ảnh
   - Chạy vòng lặp
   - Không ảnh hưởng thumbnail
===================================================== */


if(product){


    let autoIndex = 0;


    setInterval(()=>{


        const thumbs =
        document.querySelectorAll("#thumbList img");


        if(thumbs.length <= 1){

            return;

        }


        autoIndex++;


        if(autoIndex >= thumbs.length){

            autoIndex = 0;

        }


        if(window.changeDetailImage){

            window.changeDetailImage(autoIndex);

        }


    },4000);


}


/* =====================================================
   PART 3:
   RELATED PRODUCT CONVEYOR SLIDER

   Chức năng:
   - Sản phẩm cùng loại
   - Chạy liên tục phải -> trái
   - Hover dừng
===================================================== */


function renderRelatedProducts(){


    if(!rawProduct) return;


    const related = products.filter(p =>

        p.category === rawProduct.category &&
        p.id !== rawProduct.id

    );


    window.relatedProducts =
    related;


    const track =
    document.getElementById("relatedProducts");


    if(!track) return;


    let html = "";


    related.forEach(p=>{


        const item =
        getTranslatedProduct(p) || p;


        html += `

        <div class="related-card"
             onclick="location.href='chitiet.html?id=${p.id}'">


            <img src="images/${p.category}/${p.folder}/main.jpg">


            <p>
                ${item.name}
            </p>


        </div>

        `;


    });


    // nhân đôi để chạy vô hạn

    track.innerHTML =
    html + html;


    startRelatedSlider();


}
window.renderRelatedProducts = renderRelatedProducts;


function startRelatedSlider(){


    const track =
    document.getElementById("relatedProducts");


    if(!track) return;


    let position = 0;


    let speed = 0.5;


    let running = true;


    function move(){


        if(running){


            position -= speed;


            const half =
            track.scrollWidth / 2;


            if(Math.abs(position) >= half){

                position = 0;

            }


            track.style.transform =
            `translateX(${position}px)`;

        }


        requestAnimationFrame(move);

    }


    move();


    const windowBox =
    document.querySelector(".related-slider-window");


    if(windowBox){


        windowBox.addEventListener(
            "mouseenter",
            ()=>{

                running=false;

            }
        );


        windowBox.addEventListener(
            "mouseleave",
            ()=>{

                running=true;

            }
        );


    }


}


// chạy sau khi load sản phẩm

setTimeout(()=>{

    renderRelatedProducts();

},500);


/* =====================================================
   PART 4:
   SPECIFICATION TABLE
===================================================== */


function renderSpecification(){


    if(
        !product ||
        !Array.isArray(product.specs)
    ){

        return;

    }


    let tableHTML = "";

    let textArray = [];


    product.specs.forEach(spec => {


        if(
            typeof spec === "string" &&
            spec.includes("<table")
        ){

            tableHTML = spec;

        }else{


            if(
                spec !== null &&
                spec !== undefined &&
                String(spec).trim() !== ""
            ){

                textArray.push(
                    "✓ " + String(spec).trim()
                );

            }

        }

    });


    const temp =
    document.createElement("div");


    temp.innerHTML =
    tableHTML;


    const oldTable =
    temp.querySelector("table");


    if(!oldTable){

        return;

    }


    const firstRow =
    oldTable.querySelector("tr");


    let columnCount = 2;


    if(firstRow){

        const cells =
        firstRow.querySelectorAll("th, td");


        if(cells.length > 0){

            columnCount =
            cells.length;

        }

    }


    let tableRows = "";


    oldTable
    .querySelectorAll("tr")
    .forEach(row => {


        tableRows += `

        <tr>

            ${row.innerHTML}

        </tr>

        `;

    });


    let finalTable = `

    <table class="spec-main-table">

        <tbody>

            ${tableRows}

        </tbody>

    `;


    if(textArray.length > 0){


        finalTable += `

        <tbody class="spec-text-body">

        `;


        for(
            let i = 0;
            i < textArray.length;
            i += columnCount
        ){


            finalTable += `

            <tr>

            `;


            for(
                let col = 0;
                col < columnCount;
                col++
            ){


                const text =
                textArray[i + col] || "";


                finalTable += `

                <td>

                    ${text}

                </td>

                `;

            }


            finalTable += `

            </tr>

            `;

        }


        finalTable += `

        </tbody>

        `;

    }


    finalTable += `

    </table>

    `;


    const tableBox =
    document.getElementById(
        "productTableSpecs"
    );


    if(tableBox){

        tableBox.innerHTML =
        finalTable;

    }


    const textBox =
    document.getElementById(
        "productTextSpecs"
    );


    if(textBox){

        textBox.innerHTML = "";

    }

}


setTimeout(() => {

    renderSpecification();

}, 300);


/* =====================================================
   PART 5:
   PRODUCT TAB CONTROL
===================================================== */


function openProductTab(event, tabId){


    const target =
    document.getElementById(tabId);


    if(!target){

        return;

    }


    const isOpen =
    target.classList.contains("active");


    // đóng toàn bộ nội dung tab

    document
    .querySelectorAll(".tab-content")
    .forEach(tab=>{

        tab.classList.remove("active");

    });


    // bỏ trạng thái nút

    document
    .querySelectorAll(".tab-buttons button")
    .forEach(btn=>{

        btn.classList.remove("active");

    });


    // nếu trước đó chưa mở
    // thì mở

    if(!isOpen){

        target.classList.add("active");

        event.currentTarget.classList.add("active");

    }

}


/* =====================================================
   PART 6:
   PRODUCT MANUAL PDF
===================================================== */


function renderProductManual(){


    const box =
    document.getElementById("productManual");


    if(!box){

        return;

    }


    if(!product.manual){

        box.innerHTML = "";

        return;

    }


    box.innerHTML = `

    <div class="manual-box">

        <h3>
            HƯỚNG DẪN SỬ DỤNG
        </h3>

        <p>
            Tài liệu hướng dẫn sử dụng sản phẩm:
        </p>

        <a class="btn-manual"
           href="${product.manual}"
           target="_blank">

            📄 XEM HƯỚNG DẪN PDF

        </a>

        <a class="btn-manual download"
           href="${product.manual}"
           download>

            ⬇ TẢI FILE PDF

        </a>

    </div>

    `;

}


setTimeout(()=>{

    renderProductManual();

},800);