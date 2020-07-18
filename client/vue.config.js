// vue.config.js
var dotenv =require('dotenv');

dotenv.config();
console.log(process.env);
module.exports = {
    baseUrl: '/static/',
    outputDir: process.env.OUTPUT_DIR, //  || '/Users/joe-2744/personal/readmelater/public',
    indexPath: process.env.INDEX_PATH //  || 'index.html'
}