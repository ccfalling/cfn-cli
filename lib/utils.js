const path = require('path');
const fs = require('fs');

/**
 * 获取自定义配置
 * @param {String} filePath 配置文件路径
 */
function getWebpackConfig(filePath) {
    // 检查文件路径为绝对路径
    let configPath = filePath;
    if (!path.isAbsolute(configPath)) {
        const cwd = process.cwd();
        configPath = path.resolve(cwd, filePath);
    }
    return new Promise((resolve, reject) => {
        // 文件不存在 return
        if (!fs.existsSync(configPath)) {
            resolve({});
            return;
        }

        // 配置文件为js
        if (path.extname(configPath) === '.js') {
            const config = require(configPath);
            resolve(config);
        }
        // 配置文件为json
        if (path.extname(configPath) === '.json') {
            fs.readFile(configPath, (err, data) => {
                if (err) reject(err);
                const configObj = JSON.parse(data);
                resolve(configObj)
            })
        }
        reject('config type is invalid');
    })
}

exports.getWebpackConfig = getWebpackConfig;