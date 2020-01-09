// my-module.js
const fs = require('fs');
const path = require('path');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const shell = require('shelljs');

exports.command = 'mp';
exports.describe = 'mini-programe command';
exports.aliases = [];
exports.builder = {
}
exports.handler = function (argv) {
    // do something with argv.
    console.log(argv)
    if (argv.init) {
        init(argv);
    } else if (argv.create) {
        argv.create(argv);
    }
}


// 初始化一个项目
function init(argv) {
    const promptList = [{
        type: 'input',
        message: '项目名称:',
        name: 'name',
        default: argv.init !== 'true' ? argv.init : "new-mp-program" // 默认值
    },{
        type: 'list',
        message: '是否使用mpstore:',
        name: 'redux',
        choices: [
            {name: "no", checked: true},
            "yes",
        ]
    },{
        type: 'list',
        message: '是否使用所有工具（mixin, cleaner）:',
        name: 'utils',
        choices: [
            {name: "no", checked: true},
            "yes",
        ]
    }];

    inquirer.prompt(promptList).then(answers => {
        const cwd = process.cwd();
        const projectPath = path.join(cwd, answers.name);
        if (fs.existsSync(projectPath)) {
            console.warn(answers.name + '项目已经存');
        } else {
            download('direct:https://github.com/ccfalling/mp-cli-template.git', answers.name, { clone: true }, err => {
                if (err) {
                    console.log(err);
                }
                if (answers.redux === 'no') {
                    shell.rm('-rf', path.resolve(projectPath, 'mpstore'));
                }

                if (answers.utils === 'no') {
                    shell.rm('-rf', path.resolve(projectPath, 'utils/mixin.js'));
                    shell.rm('-rf', path.resolve(projectPath, 'utils/cleaner.js'));
                }
            });
        }
    })
}

// 新建页面、组件
function create(argv) {
    const cwd = process.cwd();
    const name = argv.component || argv.page;
    const dirPath = path.join(cwd, name);
    const filename = argv.component ? 'index' : 'main';
    if (fs.existsSync(dirPath)) {
        console.warn(name + '目录已经存');
    } else {
        fs.mkdir(dirPath, err => {
            if (err) {
                console.error(err);
                return;
            }
            function callback(filename) {
                return () => {
                    console.log(`${filename} 创建完成`);
                }
            }
            fs.writeFile(path.resolve(dirPath, `${filename}.js`), '', 'utf8', callback(`${filename}.js`));
            fs.writeFile(path.resolve(dirPath, `${filename}.json`), '{}', 'utf8', callback(`${filename}.json`));
            fs.writeFile(path.resolve(dirPath, `${filename}.wxss`), '.container { background: #0cc; height: 100%; }', 'utf8', callback(`${filename}.wxss`));
            fs.writeFile(path.resolve(dirPath, `${filename}.wxml`), `<view class="container">${name}</view>`, 'utf8', callback(`${filename}.wxml`));
            if (argv.page) {
                const rootPath = shell.exec('npm prefix', { silent: true }).stdout.replace(/\n/g, '');
                const pagePath = path.resolve(dirPath, filename).replace(rootPath, '');
                const pagePathArray = pagePath.split(path.sep);
                const appJSONPath = path.resolve(rootPath, 'app.json');

                if (pagePathArray[0] === 'pages') {
                    modifyFile(appJSONPath, pagePath);
                } else if (pagePathArray[1] === 'pages') {
                    modifyFile(appJSONPath, pagePath, pagePathArray[0]);
                }
            }
        });
    }
}

// 新建文件后修改app.json文件配置
function modifyFile(filePath, pagePath, sub) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return;
        }
        const dataObj = JSON.parse(data);
        if (sub) {
            const subPagePath = pagePath.replace(`${path.sep}${sub}${path.sep}`, '');
            const index = dataObj.subpackages.findIndex(e => e.root === sub);
            if (index === '-1') {
                dataObj.subpackages.push({ root: sub, pages: [subPagePath] });
            } else {
                dataObj.subpackages[index].pages.push(subPagePath);
            }
        } else {
            dataObj.pages.push(pagePath.replace(path.sep, ''));
        }
        fs.writeFile(filePath, JSON.stringify(dataObj, null, 4), (err) => {
            if (err) {
                console.log(err);
            }
        });
    })
}

