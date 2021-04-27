const fs = require('path');
const { spawn } = require('child_process');

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

    if (fileIndex == -1) {
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
module.exports.extractFile = () => {
    const filter = [];
    const xtag = this.getx();
    const ytag = this.gety();
    filter.push(xtag, ytag, process.argv[2]);

    const childPython = spawn('python', [__dirname + './py/extract.py', JSON.stringify(filter)]);

    return new Promise(function(resolve) {

        childPython.stdout.on('data', (data) => {

            let myjson = JSON.parse(data);

            resolve(myjson);
        });
    });
}


/**
 * Get files included in the argument
 */
module.exports.getFiles = async () => {
    const flag = "-f"
    if (process.argv.indexOf(flag) !== -1) {
        const filesList = this.getArgumentValues(flag)

        return new Promise((resolve) => {
            resolve(filesList);

        });
    }

    const filesList = await this.extractFile()

    return new Promise((resolve) => {
        resolve(filesList);
    });
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

module.exports.getx = function() {

    return this.getArgumentValues("-x");
}

module.exports.gety = function() {

    return this.getArgumentValues("-y");
}
