module.exports.TestSuite = class TestSuite {

    constructor(name, regExp, logOutputPerLine) {
        this.name = name;

        /**
         * RegExp object
         */
        this.regExp = regExp; 
        
        this.logOutputPerLine = logOutputPerLine;
    }
}