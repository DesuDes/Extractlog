const { getFiles, getSourceFile, getOutputFolder, getBatchReferenceFile } = require("./core/arguments");
const { FileReader } = require("./core/extract");
const { MakeFile } = require("./core/make");
const { TestSuite } = require("./core/interface/testSuite");

/**
 * Example commands
 */
//sanity test
//node parse input\105.txt -f tests\sanity\SAN_Accounting.js tests\sanity\SAN_Utilities.js

//HP
//node parse input\Sample_HP.txt -f tests\happy\billing\interactiveBilling\HP_BL_InteractiveBilling_VerifyInvoiceAmount.js tests\happy\hubs\projects\revenueForecast\HP_HB_PR_RF_ChangesToProjectsWithRFPlan.js tests\happy\hubs\projects\project\HP_MS_RPT_PRJ_PrintReports.js tests\happy\hubs\projects\project\HP_HB_PR_PRJ_SavedSearches_Suite.jstests\happy\hubs\projects\revenueForecast\HP_HB_PR_RF_ChangesToProjectsWithRFPlan.js tests\happy\hubs\projects\project\HP_MS_RPT_PRJ_PrintReports.js tests\happy\hubs\projects\project\HP_HB_PR_PRJ_SavedSearches_Suite.js

//hp test
//node parse input\135.txt -f tests\happy\hubs\projects\plan\HP_HB_PLN_VerifyProjectPlanReports(WBS1).js
//node parse input\Sample_HP.txt -b output\input-Sample_HP-txt.map.json -o Sample_HP

function filter(lineList, fileList) {


    const testSuitesList = [];

    fileList.forEach(filePath => {

        console.log(`Creating instance for ${filePath}.`);
        var fileName = filePath.replace(/\\/gi, "-");

        var reg = /([A-Za-z0-9_\\()]+)\.js$/gi;
        var match = reg.exec(fileName);
        if (match != null) {
            fileName = match[0];
        }

        filePath = filePath.replace(/\\/g, "\\\\").replace(/\(/gi, "\\(").replace(/\)/gi, "\\)");

        var exp = new RegExp(`${filePath}`, "gi");

        const testSuite = new TestSuite(fileName, exp, []);

        testSuitesList.push(testSuite);

    });

    console.log(`\n${lineList.length} lines will be processed. Please wait as we extract the logs. This may take a while....\n`);

    lineList.forEach(line => {
        for (var x = 0; x < testSuitesList.length; x++) {
            const suite = testSuitesList[x];
            if (suite.regExp.test(line)) {
                /**
                 * Clean up leading date.
                 */
                suite.logOutputPerLine.push(line.replace(/(.*).js  /gi, ""));
                break;
            }
        }
    });

    return testSuitesList;
}


async function main() {
    try {

        const fileList = await getFiles();
        const sourceFile = getSourceFile();
        const lines = FileReader.readFile(sourceFile);
        const batchReferenceFilePath = getBatchReferenceFile();

        if (batchReferenceFilePath != null) {
            console.log("Using batch for file reference.");
            //read json
            var file = FileReader.readFileNative(batchReferenceFilePath);
            fileList = JSON.parse(file);
        }

        var outputFolder = getOutputFolder();

        if (outputFolder.length > 0) {
            outputFolder = FileReader.normalizePath(outputFolder[0]);
        } else {
            outputFolder = "";
        }

        console.log("target output folder", outputFolder);

        var testSuiteList = filter(lines, fileList);
        MakeFile.createLog(testSuiteList, outputFolder);
        console.timeEnd("Extract time");
    } catch (error) {
        console.log(error);
    }
}

main();
