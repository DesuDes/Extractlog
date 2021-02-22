const fs = require("fs");

module.exports.MakeFile = class MakeFile {

    static outputFolder = "./output/";

    /**
     * 
     * @param {Array<TestSuite>} testSuiteList 
     */
    static createLog(testSuiteList, outputFolderPath = "") {

        this.createOutputFolder(outputFolderPath);

        outputFolderPath = outputFolderPath.length ? outputFolderPath : this.outputFolder;

        testSuiteList.forEach(testSuite => {
            const fileName = `${testSuite.name}.txt`;
            var temp = "";

            testSuite.logOutputPerLine.forEach(ln => {
                temp += ln + "\n";
            })
            fs.writeFileSync(`${outputFolderPath}${fileName}`, temp);
            console.log(`Log for ${testSuite.name} with ${testSuite.logOutputPerLine.length} line(s) has been written.`);
        });

    }

    static createFile(contents, fileName, fileExt) {

        this.createOutputFolder(this.outputFolder);
        fs.writeFileSync(`${this.outputFolder}${fileName}.${fileExt}`, contents);
        console.log(`Log for ${fileName}.${fileExt} written.`);

    }

    static createOutputFolder(outputFolderPath = "") {

        outputFolderPath = outputFolderPath.length == 0 ? this.outputFolder : outputFolderPath;
        /**
         * Check if directory exist
         */
        if (fs.existsSync(outputFolderPath)) {
            // Do something
            console.log("Output folder already exists!\n");
        } else {
            //create folder
            fs.mkdirSync(outputFolderPath);
        }

        console.log(`Results will be placed in this directory: ${outputFolderPath}.\n`);


    }
}