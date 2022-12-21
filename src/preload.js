/* eslint-disable no-undef */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
   node: () => process.versions.node,
   chrome: () => process.versions.chrome,
   electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld("api", {
   send: (channel, data) => {
      // whitelist channels
      let validChannels = [
         "updateProducts",
         "toMain",
         "addProduct",
         "getProduct",
         "deleteProduct",
         "editProduct",
         "searchProduct",
         "addSales",
         "getSales",
         "generateQR",
         "deleteSale",
      ];
      if (validChannels.includes(channel)) {
         ipcRenderer.send(channel, data);
      }
   },
   receive: (channel, func) => {
      let validChannels = [
         "updateProducts",
         "fromMain",
         "getProduct",
         "deleteProduct",
         "editProduct",
         "searchResult",
         "getSales",
         "deleteSale",
      ];
      if (validChannels.includes(channel)) {
         // Deliberately strip event as it includes `sender`
         ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
   },
});
