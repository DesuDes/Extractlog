const fs = require("fs");

module.exports.MakeFile = class MakeFile {

    static outputFolder = "./output/";

    /**
     * 
     * @param {Array<TestSuite>} testSuiteList 
     */
    static createLog(testSuiteList) {

        // console.log(fileLineList);
        testSuiteList.forEach(testSuite => {
            const fileName = `${testSuite.name}.txt`;
            var temp = "";
            testSuite.logOutputPerLine.forEach(ln => {
                temp += ln + "\n";
            })
            fs.writeFileSync(`${this.outputFolder}${fileName}`, temp);
        });
    }
}