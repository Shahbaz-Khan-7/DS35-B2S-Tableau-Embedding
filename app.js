console.log("is this thing on?");

// create some constants and variables to use later
const viz = document.getElementById("tableauViz");
let workbook;
let vizActiveSheet;
let dashboard;
let listSheets;

let saleMap;
let totalSales;
let salesByProduct;
let salesBySegment;

// logging information about the workbook
function logWorkbookInformation() {
  // get the workbook
  workbook = viz.workbook;
  console.log(`The workbook name is: ${workbook.name}`);

  // finding all of the tabs in workbook
  let sheets = workbook.publishedSheetsInfo;
  sheets.forEach((element) => {
    index = element.index;
    console.log(`The sheet with index 
        [${index}] is : "${element.name}"`);
  });

  // the currently active tab
  vizActiveSheet = workbook.activeSheet;
  listSheets = vizActiveSheet.worksheets;
  console.log(`The active sheet is "${vizActiveSheet.name}"`);

  // the sheets in the dashboard
  listSheets = vizActiveSheet.worksheets;
  listSheets.forEach((element) => {
    index = element.index;
    worksheetName = element.name;
    console.log(`The worksheet with index [${index}] is : 
        "${worksheetName}`);
  });

  // assign sheets to the variables for the sheetnames at the top of the app.js file
  saleMap = listSheets.find((ws) => ws.name == "SaleMap");
  totalSales = listSheets.find((ws) => ws.name == "Total Sales");
  salesByProduct = listSheets.find((ws) => ws.name == "SalesbyProduct");
  salesBySegment = listSheets.find((ws) => ws.name == "SalesbySegment");
}

// log this information once things are actually loaded
viz.addEventListener("firstinteractive", logWorkbookInformation);

// define what our button are
const oregonWashingtonButton = document.getElementById("oregon_and_washington");
const clearFilterButton = document.getElementById("clear_filter");
const undoButton = document.getElementById("undo");
const filterRangeButton = document.getElementById("filter_range");

// what the buttons do when clicked
oregonWashingtonButton.addEventListener(
  "click",
  function oregonWashFunction(e) {
    console.log(e.target.value);

    // apply the filter to all the sheets
    saleMap.applyFilterAsync("State", ["Washington", "Oregon"], "replace");
    totalSales.applyFilterAsync("State", ["Washington", "Oregon"], "replace");
    salesByProduct.applyFilterAsync(
      "State",
      ["Washington", "Oregon"],
      "replace"
    );
    salesBySegment.applyFilterAsync(
      "State",
      ["Washington", "Oregon"],
      "replace"
    );
  }
);

clearFilterButton.addEventListener("click", function clearState(e) {
  // log what is pressed
  console.log(e.target.value);

  // clear filter from all sheets
  saleMap.clearFilterAsync("State");
  totalSales.clearFilterAsync("State");
  salesByProduct.clearFilterAsync("State");
  salesBySegment.clearFilterAsync("State");
});

undoButton.addEventListener("click", function unDo() {
  viz.undoAsync();
});

//Adding range filters for map - doesn't make sense to do this for the other charts.
filterRangeButton.addEventListener("click", function filterRangeFunction() {
  //Bringing in min and max values specified in our number inputs on the HTML page.
  // Have to convert these to floats to keep Tableau API happy
  const minValue = parseFloat(document.getElementById("minValue").value);
  const maxValue = parseFloat(document.getElementById("maxValue").value);
  console.log(minValue, maxValue);
  saleMap.applyRangeFilterAsync("SUM(Sales)", {
    min: minValue,
    max: maxValue,
  });
});

// undo button goes through sheet by sheet and turns it back
