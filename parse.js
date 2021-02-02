const { getFiles, getSourceFile } = require("./core/arguments");
const { FileReader } = require("./core/extract");
const { MakeFile } = require("./core/make");

function filter(lineList, fileList) {

    const compiledLines = [];

    fileList.forEach(filePath => {
        const tempLines = [];

        console.log(`Seeking ${filePath}`);
        filePath = filePath.replace(/\\/g, "\\\\");
        var exp = new RegExp(`${filePath}`, "gi");
        // lineList = ["2021-02-01T22:09:13.6567983Z  tests\\sanity\\SAN_Accounting.js    '--use_user=ADMIN', "]

        lineList.forEach(line => {

            if (exp.test(line)) {
                tempLines.push(line);
            }
        });

        compiledLines.push(tempLines);

    });

    return compiledLines;
}


function main() {

    const fileList = getFiles();
    const sourceFile = getSourceFile();
    const lines = FileReader.readFile(sourceFile);

    var filteredLinesPerFile = filter(lines, fileList);

    MakeFile.createLog(filteredLinesPerFile);

}

main();

//sanity test
//node parse input\105.txt -f tests\sanity\SAN_Accounting.js

//HP
//node parse input\Sample_HP.txt -f tests\happy\billing\interactiveBilling\HP_BL_InteractiveBilling_VerifyInvoiceAmount.js