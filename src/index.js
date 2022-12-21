/* eslint-disable no-undef */
const { app, BrowserWindow, ipcMain } = require("electron");
const Store = require("electron-store");
const path = require("path");
const { PosPrinter } = require("electron-pos-printer");

let mainWindow;

const store = new Store();
if (!store.get("products")) {
   store.set("products", []);
}
if (!store.get("sales")) {
   store.set("sales", []);
}
if (require("electron-squirrel-startup")) {
   app.quit();
}

app.whenReady().then(() => {
   mainWindow = new BrowserWindow({
      width: 1280,
      height: 768,
      webPreferences: {
         preload: path.join(__dirname, "preload.js"),
         nodeIntegration: false,
         contextIsolation: true,
         enableRemoteModule: false,
      },
   });
   mainWindow.loadFile(path.join(__dirname, "index.html"));
   const products = store.get("products");
   mainWindow.webContents.send("fromMain", products);
});

app.on("window-all-closed", () => {
   if (process.platform !== "darwin") {
      app.quit();
   }
});

app.on("activate", () => {
   if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
   }
});

ipcMain.on("addProduct", function (event, arg) {
   let products = store.get("products");
   let exists = false;
   products = products.map((product) => {
      if (product.id === arg.id) {
         exists = true;
         return { ...product, quantity: product.quantity + arg.quantity };
      } else {
         return { ...product };
      }
   });
   if (exists) {
      store.set("products", [...products]);
   } else {
      store.set("products", [...products, arg]);
   }
   mainWindow.webContents.send("updateProducts", store.get("products"));
});

ipcMain.on("deleteProduct", function (event, arg) {
   let products = store.get("products");
   products = products.filter((product) => String(product.id) !== arg);
   store.set("products", products);
   mainWindow.webContents.send("updateProducts", store.get("products"));
});

ipcMain.on("deleteSale", function (event, arg) {
   let products = store.get("sales");
   products = products.filter((product) => String(product.id) !== arg);
   store.set("sales", products);
   mainWindow.webContents.send("updateProducts", store.get("sales"));
});

ipcMain.on("editProduct", function (event, arg) {
   let products = store.get("products");
   products = products.map((product) => {
      if (product.id === arg.id) {
         return { ...arg };
      } else {
         return { ...product };
      }
   });
   store.set("products", products);
   mainWindow.webContents.send("updateProducts", store.get("products"));
});

ipcMain.on("searchProduct", function (event, arg) {
   const products = store.get("products");
   const product = products.find((item) => item.id === arg);
   if (product) {
      if (product.quantity === 0) {
         mainWindow.webContents.send("searchResult", { product: { ...product, name: "Bu mahsulot qolmadi" } });
         console.log(product);
      } else {
         mainWindow.webContents.send("searchResult", { product });
      }
   } else {
      mainWindow.webContents.send("searchResult", { product: { name: "Bunday mahsulot topilmadi", price: null } });
   }
});

ipcMain.on("addSales", function (event, sale) {
   let sales = store.get("sales");
   let products = store.get("products");
   const existingSale = sales.find((item) => item.id === sale.id);
   if (existingSale) {
      sales = sales.map((item) => {
         if (item.id === existingSale.id) {
            return {
               ...existingSale,
               quantity: Number(item.quantity) + Number(sale.quantity),
               total: item.total + sale.total,
            };
         } else {
            return { ...item };
         }
      });
      store.set("sales", sales);
   } else {
      sales = [...sales, sale];
      store.set("sales", sales);
   }
   products = products.map((product) => {
      if (product.id === sale.id) {
         return { ...product, quantity: product.quantity - sale.quantity };
      } else {
         return { ...product };
      }
   });
   store.set("products", products);
   mainWindow.webContents.send("getSales", store.get("sales"));
   mainWindow.webContents.send("getProduct", store.get("products"));
});

ipcMain.on("getSales", () => {
   const sales = store.get("sales");
   mainWindow.webContents.send("fromMain", sales);
});

ipcMain.on("getProduct", () => {
   const products = store.get("products");
   mainWindow.webContents.send("fromMain", products);
});

ipcMain.on("generateQR", async (event, arg) => {
   PosPrinter.print(
      [
         {
            type: "barCode",
            value: arg.id,
            height: 70,
            width: 2,
            displayValue: true,
            fontsize: 20,
            style: {
               scale: 2,
               textAlign: "center",
               marginBottom: 10,
            },
         },
      ],
      {
         preview: false,
         margin: "0 0 30px 0",
         copies: 1,
         printerName: "XP-58 (copy 1)",
         timeOutPerLine: 600,
         pageSize: "80mm",
      },
   )
      .then((data) => {
         console.log(data);
      })
      .catch((er) => console.log(er));
   // bwipjs.toBuffer(
   //    {
   //       bcid: "code128",
   //       text: arg.id,
   //       includetext: true,
   //       textxalign: "center",
   //       padding: 10,
   //       scale: 4,
   //    },
   //    function (err, png) {
   //       if (err) {
   //          console.log(err);
   //       } else {
   //          fs.createWriteStream(__dirname + "/codes/" + arg.name + ".png").write(png);
   //       }
   //    },
   // );
   // }
});
