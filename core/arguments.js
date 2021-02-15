const fs = require('path');

/**
 * 
 * @description get argument values. 
 * 
 * For example: `node sample -f x y z -r hello world;`
 * 
 * Supplying -f would return an array: `['x','y','z']`
 * @param {*} flag 
 */
module.exports.getArgumentValues = (flag) => {
    const fileIndex = process.argv.indexOf(flag);
    const argValues = [];

    if(fileIndex == -1){
        return [];
    }

    for (var x = fileIndex + 1; x < process.argv.length; x++) {
        const filePath = process.argv[x];

        if (/^\-[A-Za-z]$/gi.test(filePath)) {
            break;
        }

        argValues.push(filePath);
    }

    return argValues;

}

/**
 * Get files included in the argument
 */
module.exports.getFiles = () => {

    return this.getArgumentValues("-f");

}


module.exports.getBatchReferenceFile = () => {
    var targetFile = this.getArgumentValues("-b");

    if (targetFile.length == 0)
        return null;

    
    return targetFile[0];

}


module.exports.getOutputFolder = () => {

    return this.getArgumentValues("-o");
}

module.exports.getSourceFile = () => {
    return process.argv[2];
}