const { getFiles, getSourceFile } = require("./core/arguments");
const { FileReader } = require("./core/extract");
const { MakeFile } = require("./core/make");

const fileList = [];

function registerFile(fileName) {

    if (fileList.indexOf(fileName) == -1) {
        fileList.push(fileName);
    }
}
/**
 * Extract all the files/test suites involved in a run.
 * Command: node testSuiteExtract input/Sample_HP.txt
 */
function main() {

    console.time("[testSuiteExtract] Extract time");
    const sourceFile = getSourceFile();
    const lines = FileReader.readFile(sourceFile);

    /**
     * extract file path starting from Zulu
     */
    const regExp = /(?<=(Z  ))([A-Za-z0-9_\\]+)\.js/gi;

    lines.forEach(line => {
        var match = regExp.exec(line);

        if (match != null) {
            registerFile(match[0]);
        }
    });

    console.log(`${fileList.length} file(s) found.\n`);

    MakeFile.createFile(
        JSON.stringify(fileList, null, 3),
        sourceFile.replace(/\\|\/|\./gi,"-") + ".map",
        "json"
    );


    console.timeEnd("[testSuiteExtract] Extract time");

}



main();