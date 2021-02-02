const fs = require("fs");

/**
 * Class the reads primarily the logs output by the selenium grid nightwatch
 */
module.exports.FileReader = class FileReader {

    /**
     * @description reads the .txt as provded by the TFS
     * @param {*} path 
     * @returns an array of string - output (per line)
     */
    static readFile(path) {

        /**
         * get the file
         */

        var body = fs.readFileSync(path, 'utf8');
        return body.split("\n");

    }




}