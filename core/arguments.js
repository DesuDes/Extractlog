const fs = require('path');

/**
 * Get files included in the argument
 */
module.exports.getFiles = () => {

    const fileIndex = process.argv.indexOf("-f");

    const fileList = [];
    for (var x = fileIndex +1; x < process.argv.length; x++) {
        const filePath = process.argv[x];
        fileList.push(filePath);
    }

    return fileList;


}

module.exports.getSourceFile = () => {
    return process.argv[2];
}