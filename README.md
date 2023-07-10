# Warehouse application for the Desktop with Electron.js

## Features

- It has a separate table and page for Products and Sales
- You can add Products, their quantity, and price
- The amount will be subtracted from the Products table once the product is sold.
- Printing bar codes for products without bar codes (Requires ThermalPrinter. XPrinter POS 58 was used for the real use case), it doesn't generate a number for the Barcode though. You will do it by yourself

## Running the application

### You need:
- Node.js 14+
- npm 6+

First step:

### Clone the repo
`git clone https://github.com/Nodirbek-py/warehouse.git`
### Go to the repo folder
`cd warehouse`
### Install dependencies
`npm i`
### Run the app on dev mode
`npm run start`
### Getting executable files for win/linux/mac
`npm run make`
> Keep that in mind, if you run the above command app on Mac, it will create an executable for the Mac, if you run it on Windows it will create for Windows ... etc.


## Using the Printer
If you decide to use thermal printer, you need to add its name for the code (I know it is a bad way of adding printer, but it was fast, I had 4 days to complete the whole app). Here is the steps to add printer
Once you got the thermal printer and installed its driver for the OS, it will be saved as smth in the devices list, so you will need to add that name for the code. 
You need to go to the file from this route `~/src/index.js`, and line **181**. You will see this function to call the printer and request to print smth. You need to add your printer's name for the **202th** line as a string. And now you are good to proceed...
```
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
         printerName: <CHANGE ME>,
         timeOutPerLine: 600,
         pageSize: "80mm",
      },
   )
      .then((data) => {
         console.log(data);
      })
      .catch((er) => console.log(er));
});
```
