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

        console.log(`Reading source file ${path}. Please wait for this may take a while...`);
        /**
         * get the file
         */
        var body = fs.readFileSync(path, 'utf8');
        body = body.split("\n");

        var stats = fs.statSync(path);
        var fileSizeInBytes = stats.size;
        var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

        console.log(`${path}. has ${Math.floor(fileSizeInMegabytes)}MB with ${body.length} lines.\n`);

        return body;

    }

    static readFileNative(path) {
        return fs.readFileSync(path, 'utf8');
    }

    static normalizePath(path) {
        return /\/|\\$/gi.test(path) ? path : `${path}\\`;
    }




}