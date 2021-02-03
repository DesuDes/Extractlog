const { getFiles, getSourceFile } = require("./core/arguments");
const { FileReader } = require("./core/extract");
const { MakeFile } = require("./core/make");
const { TestSuite } = require("./core/interface/testSuite");

function filter(lineList, fileList) {

    const testSuitesList = [];

    fileList.forEach(filePath => {
        const tempLines = [];

        console.log(`Seeking ${filePath}`);
        const fileName = filePath.replace(/\\/gi,"-");

        filePath = filePath.replace(/\\/g, "\\\\");
        var exp = new RegExp(`${filePath}`, "gi");

        const testSuite = new TestSuite(fileName, []);

        lineList.forEach(line => {

            if (exp.test(line)) {
                testSuite.logOutputPerLine.push(line.replace(/(.*).js  /gi, ""));
            }
        });

        testSuitesList.push(testSuite);

    });

    return testSuitesList;
}


function main() {

    const fileList = getFiles();
    const sourceFile = getSourceFile();
    const lines = FileReader.readFile(sourceFile);

    var testSuiteList = filter(lines, fileList);

    MakeFile.createLog(testSuiteList);

}

main();

//sanity test
//node parse input\105.txt -f tests\sanity\SAN_Accounting.js tests\sanity\SAN_Utilities.js

//HP
//node parse input\Sample_HP.txt -f tests\happy\billing\interactiveBilling\HP_BL_InteractiveBilling_VerifyInvoiceAmount.js 