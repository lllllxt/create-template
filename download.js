const https = require('https')
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

function download(path, filename, cb) {
    const file = fs.createWriteStream(filename, {
        flags: 'w'
    });
    https
        .get(path, function (response) {
            response.pipe(file);
            console.log(chalk.green('下载成功：'), filename);
            cb && cb()
        })
        .on("error", function (err) {
            fs.unlinkSync(filename);
            console.log('错误:', chalk.red(err.message));
        });
}

module.exports = function (url, filename, cb) {
    const dir = path.dirname(filename)
    fs.mkdir(dir, {
        recursive: true
    }, (err) => {
        if (err) throw err;
        download(url, filename, cb)
    });

}