const fs = require("fs");

module.exports.MakeFile = class MakeFile {

    static outputFolder = "./output/";

    /**
     * 
     * @param {Array<TestSuite>} testSuiteList 
     */
    static createLog(testSuiteList) {

        this.createOutputFolder();

        testSuiteList.forEach(testSuite => {
            const fileName = `${testSuite.name}.txt`;
            var temp = "";

            testSuite.logOutputPerLine.forEach(ln => {
                temp += ln + "\n";
            })
            fs.writeFileSync(`${this.outputFolder}${fileName}`, temp);
            console.log(`Log for ${testSuite.name} done!`);
        });

    }

    static createFile(contents, fileName, fileExt) {
        this.createOutputFolder();

        fs.writeFileSync(`${this.outputFolder}${fileName}.${fileExt}`, contents);
        console.log(`Log for ${fileName}.${fileExt} done!`);

    }

    static createOutputFolder() {
        /**
         * Check if directory exist
         */
        if (fs.existsSync(this.outputFolder)) {
            // Do something
            console.log("Output folder already exists!\n");
        } else {
            //create folder
            fs.mkdirSync(this.outputFolder);
        }

        console.log(`Results will be placed in this directory: ${this.outputFolder}.\n`);


    }
}