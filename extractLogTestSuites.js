const { getFiles, getSourceFile, getArgumentValues } = require("./core/arguments");
const { FileReader } = require("./core/extract");
const { MakeFile } = require("./core/make");
const { extractTestSuiteFileNameFromString } = require("./core/extract");

const fileList = [];

function registerFile(fileName) {

    if (fileList.indexOf(fileName) == -1) {
        fileList.push(fileName);
    }
}

/**
 * Extract all the files/test suites involved in a run.
 * Command: node extractLogTestSuites input/Sample_HP.txt
 */
function main() {

    console.time("[testSuiteExtract] Extract time");
    const sourceFile = getSourceFile();
    const lines = FileReader.readFile(sourceFile);

    lines.forEach(line => {

        const result = extractTestSuiteFileNameFromString(line);

        if (result != null) {
            registerFile(result);
        }


    });

    console.log(`${fileList.length} file(s) found.\n`);

    MakeFile.createFile(
        JSON.stringify(fileList, null, 3),
        sourceFile.replace(/\\|\/|\./gi, "-") + ".map",
        "json"
    );


    console.timeEnd("[testSuiteExtract] Extract time");

}



main();