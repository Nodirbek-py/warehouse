/* eslint-disable no-unused-vars */
// Navigation
const kassaNav = document.querySelector("#kassa");
const reportNav = document.querySelector("#report");
const codeNav = document.querySelector("#code");
const goodsNav = document.querySelector("#goods");

const content = document.querySelector(".content");

const kassaPage = document.querySelector(".kassa");
const reportPage = document.querySelector(".report");
const codePage = document.querySelector(".code");
const goodsPage = document.querySelector(".goods");

let kassaTotal = 0;
let reportTotal = 0;

kassaNav.addEventListener("click", () => {
   kassaPage.setAttribute("style", "display: block;");
   reportPage.setAttribute("style", "display: none;");
   codePage.setAttribute("style", "display: none;");
   goodsPage.setAttribute("style", "display: none;");
   content.append(kassaPage);
   document.querySelector("#kassaTotal").innerText = kassaTotal;
});

reportNav.addEventListener("click", () => {
   reportPage.setAttribute("style", "display: block;");
   kassaPage.setAttribute("style", "display: none;");
   codePage.setAttribute("style", "display: none;");
   goodsPage.setAttribute("style", "display: none;");
   const productsTable = document.querySelector("#reportTable");
   window.api.send("getSales");
   window.api.receive("fromMain", (data) => {
      const products = document.getElementsByClassName("goods-row");
      while (products.length > 0) {
         products[0].parentNode.removeChild(products[0]);
      }
      reportTotal = data.reduce((a, c) => a + c.total, 0);
      document.querySelector("#reportCount").innerText = data.length;
      document.querySelector("#reportSumm").innerText = reportTotal;
      data.forEach((product) => {
         const productRow = document.createElement("div");
         productRow.classList.add("goods-row", "report");
         productRow.innerHTML = `
            <span class="row-text">${product.id}</span>
            <span class="row-text">${product.name}</span>
            <span class="row-text">${product.price}</span>
            <span class="row-text">${product.quantity}</span>
            <span class="row-text">${product.total}</span>
         `;
         productsTable.append(productRow);
      });
   });
   content.append(reportPage);
});

codeNav.addEventListener("click", () => {
   reportPage.setAttribute("style", "display: none;");
   kassaPage.setAttribute("style", "display: none;");
   codePage.setAttribute("style", "display: flex;");
   goodsPage.setAttribute("style", "display: none;");
   content.append(codePage);
});

goodsNav.addEventListener("click", () => {
   reportPage.setAttribute("style", "display: none;");
   kassaPage.setAttribute("style", "display: none;");
   codePage.setAttribute("style", "display: none;");
   goodsPage.setAttribute("style", "display: block;");
   const productsTable = document.querySelector("#productsTable");
   window.api.send("getProduct");
   window.api.receive("fromMain", (data) => {
      document.querySelector("#goodsCount").innerText = data.length;
      document.querySelector("#goodsSumm").innerText = data.reduce((a, c) => a + c.price, 0);
      const products = document.getElementsByClassName("goods-row");
      while (products.length > 0) {
         products[0].parentNode.removeChild(products[0]);
      }
      data.forEach((product) => {
         const productRow = document.createElement("div");
         productRow.classList.add("goods-row");
         productRow.innerHTML = `
            <span class="row-text">${product.id}</span>
            <span class="row-text">${product.name}</span>
            <span class="row-text">${product.price}</span>
            <span class="row-text">${product.quantity}</span>
            <span class="row-text">${Number(product.price) * Number(product.quantity)}</span>
            <span>
               <button class="btn" onclick="editProduct('${product.id}')"><img src="./img/pencil.png" /></button>
               <button class="btn" onclick="deleteProduct('${product.id}')"><img src="./img/remove.png" /></button>
            </span>
         `;
         productsTable.append(productRow);
      });
   });
   content.append(goodsPage);
});

// Actions

const addButton = document.querySelector("#add-btn");
const closePopup = document.querySelector("#close-btn");
const addpopup = document.querySelector("#add");

addButton.addEventListener("click", () => {
   addpopup.setAttribute("style", "display: flex;");
});

closePopup.addEventListener("click", () => {
   addpopup.setAttribute("style", "display: none;");
});

// Adding Products
const btnAddProduct = document.querySelector("#addProduct");
btnAddProduct.addEventListener("click", () => {
   const id = document.querySelector("#addID").value;
   const name = document.querySelector("#addName").value;
   const price = Number(document.querySelector("#addPrice").value);
   const quantity = Number(document.querySelector("#addQuantity").value);
   window.api.send("addProduct", { id, name, price, quantity });
   const productsTable = document.querySelector("#productsTable");
   window.api.receive("updateProducts", (data) => {
      addpopup.setAttribute("style", "display: none;");
      const products = document.getElementsByClassName("goods-row");
      while (products.length > 0) {
         products[0].parentNode.removeChild(products[0]);
      }
      data.forEach((product) => {
         const productRow = document.createElement("div");
         productRow.classList.add("goods-row");
         productRow.innerHTML = `
            <span class="row-text">${product.id}</span>
            <span class="row-text">${product.name}</span>
            <span class="row-text">${product.price}</span>
            <span class="row-text">${product.quantity}</span>
            <span class="row-text">${Number(product.price) * Number(product.quantity)}</span>
            <span>
               <button class="btn" onclick="editProduct('${product.id}')"><img src="./img/pencil.png" /></button>
               <button class="btn" onclick="deleteProduct('${product.id}')"><img src="./img/remove.png" /></button>
            </span>

         `;
         productsTable.append(productRow);
      });
   });
});

const deleteProduct = (id) => {
   window.api.send("deleteProduct", id);
   const productsTable = document.querySelector("#productsTable");
   window.api.receive("updateProducts", (data) => {
      const products = document.getElementsByClassName("goods-row");
      while (products.length > 0) {
         products[0].parentNode.removeChild(products[0]);
      }
      data.forEach((product) => {
         const productRow = document.createElement("div");
         productRow.classList.add("goods-row");
         productRow.innerHTML = `
            <span class="row-text">${product.id}</span>
            <span class="row-text">${product.name}</span>
            <span class="row-text">${product.price}</span>
            <span class="row-text">${product.quantity}</span>
            <span class="row-text">${Number(product.price) * Number(product.quantity)}</span>
            <span>
               <button class="btn" onclick="editProduct('${product.id}')"><img src="./img/pencil.png" /></button>
               <button class="btn" onclick="deleteProduct('${product.id}')"><img src="./img/remove.png" /></button>
            </span>

         `;
         productsTable.append(productRow);
      });
   });
};

const editProduct = (id) => {
   const editpopup = document.querySelector("#edit");
   editpopup.setAttribute("style", "display: flex;");
   editpopup.querySelector("#close-btn").addEventListener("click", () => {
      editpopup.setAttribute("style", "display: none;");
   });
   editpopup.querySelector("#editProduct").addEventListener("click", () => {
      const name = document.querySelector("#namePopup").value;
      const price = Number(document.querySelector("#pricePopup").value);
      const quantity = Number(document.querySelector("#quantityPopup").value);
      window.api.send("editProduct", { id, name, price, quantity });
      window.api.receive("updateProducts", () => {
         editpopup.setAttribute("style", "display: none;");
         const response = confirm("Hello");
      });
   });
};

let SearchedProduct = null;

const searchButton = document.querySelector("#searchBtn");
searchButton.addEventListener("click", () => {
   const query = document.querySelector("#search").value;
   if (query !== "") {
      const title = document.querySelector("#productTitle");
      const price = document.querySelector("#productPrice");
      window.api.send("searchProduct", query);
      window.api.receive("searchResult", (data) => {
         SearchedProduct = data;
         title.innerText = data.product.name;
         price.innerText = data.product.price + " so'm";
      });
   }
});

const confirmButton = document.querySelector("#confirm");
confirmButton.addEventListener("click", () => {
   const quantity = document.querySelector("#saleQuantity").value;
   const kassaLeft = document.querySelector(".kassa-left");
   const totalMoney = document.querySelector("#kassaTotal");
   if (quantity !== "") {
      if (SearchedProduct.product.quantity >= Number(quantity)) {
         const sale = {
            ...SearchedProduct.product,
            quantity: Number(quantity),
            total: Number(quantity) * Number(SearchedProduct.product.price),
         };
         window.api.send("addSales", sale);
         const saleRow = document.createElement("div");
         saleRow.classList.add("row-kassa");
         saleRow.innerHTML = `
                  <span class="kassa-text">${sale.id}</span>
                  <span class="kassa-text">${sale.name}</span>
                  <span class="kassa-text">${quantity}</span>
                  <span class="kassa-text">${sale.total} so'm</span>
         `;
         kassaTotal += sale.total;
         totalMoney.innerText = kassaTotal;
         kassaLeft.append(saleRow);
         // window.api.receive("getProduct", (data) => console.log(data));
      } else {
         alert("Bu mahsulot ozroq qolgan");
      }
   }
});

const kassaClear = document.querySelector("#kassaFinish");
kassaClear.addEventListener("click", () => {
   kassaTotal = 0;
   document.querySelector("#kassaTotal").innerText = "0";
   const sales = document.getElementsByClassName("row-kassa");
   while (sales.length > 0) {
      sales[0].parentNode.removeChild(sales[0]);
   }
});

const generateQR = () => {
   if (document.querySelector("#codeID").value !== "" && document.querySelector("#codeName").value !== "")
      window.api.send("generateQR", {
         id: document.querySelector("#codeID").value,
         name: document.querySelector("#codeName").value,
      });
   alert("Shtrix kodingiz yaratildi va kompyuterga saqlab qo'yildi");
};
