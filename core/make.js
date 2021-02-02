const fs = require("fs");

module.exports.MakeFile = class MakeFile {

    static outputFolder = "./output/";

    static createLog(fileLineList) {

        fileLineList.forEach(l => {
            const fileName = `${Math.floor((new Date()).getTime() / 1000)}.txt`;
            var temp = "";
            temp += l + "\n";
            fs.writeFileSync(`${this.outputFolder}${fileName}`, temp);
        });
    }
}