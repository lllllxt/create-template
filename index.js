#!/usr/bin/env node

const package = require('./package')
const config = require('./config')
const path = require('path');
const fs = require('fs');
const program = require('commander');
const chalk = require('chalk');

const download = require('./download')

/** 关键字替换 
 * @param source 模板
 * @param target 生成文件地址
 */
function translate(source, target) {
    if (!path.extname(target)) {
        target += path.extname(source.replace('.tpl', ''))
    }
    const filename = path.win32.basename(target)
    const ext = path.extname(filename)
    const filenamebase = path.win32.basename(target, ext)
    fs.mkdirSync(path.dirname(target), {
        recursive: true
    });

    // 读取模板并转换写入目标文件地址
    fs.readFile(source, 'utf8', (err, data) => {
        if (err) throw err;
        data = data.replace(/#FILENAME_BASE#/g, filenamebase)
            .replace(/#FILENAME#/g, filename)

        fs.writeFile(target, data, 'utf8', err => {
            if (err) throw (chalk.red(err))
            console.log(chalk.green('创建成功'), chalk.underline(path.resolve(target)));
        });
    })
}

function showConfig() {
    console.log();
    console.log(chalk.cyan('配置文件:'), chalk.underline(path.resolve(__dirname, 'config.js')))
    console.log(chalk.cyan('模板目录:'), chalk.underline(path.resolve(config.root, config.tplDir)));
    console.log();
}

program.version(package.version, '-v, --version')
    .name('ct')
    .usage('<模板名> <生成文件路径> [是否更新]')
    .arguments('<type> <filepath> [isNew] [env]')
    .description('生成文件路径 相对于当前执行命令的路径')
    .action(function (type, filepath, isNew = false, env) {
        // 下载模板文件[如已存在, 则直接使用]
        const tplName = path.resolve(config.root, config.tplDir, `${type}.tpl`)
        if (!isNew && fs.existsSync(tplName)) {
            translate(tplName, filepath)
            return false
        }
        if (!config.tplUrlMap[type]) {
            console.log(chalk.red(`没有配置 ${type} 模板下载地址`));
            console.log(chalk.red(`请在 [ 配置文件 ] 配置, 或在 [ 模板目录 ] 创建本地模板`));
            return showConfig()
        }

        // 下载
        download(config.tplUrlMap[type], tplName, function () {
            // 关键字替换 并最终生成文件
            translate(tplName, filepath)
        })
    });

// 输出当前配置
program.option('-c, --config', 'output the config', () => {
    console.log(JSON.stringify(config, null, 2));
    showConfig()
})
// 命令修改配置

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.help()
}