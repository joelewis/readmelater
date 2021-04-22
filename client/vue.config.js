var dotenv =require('dotenv');
dotenv.config();

module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? process.env.CDN_BASE_URL
        : '/static/',
    outputDir: process.env.OUTPUT_DIR, //  || '/Users/joe-2744/personal/readmelater/public',
    indexPath: process.env.INDEX_PATH, //  || 'index.html'
    pluginOptions: {
        quasar: {
            importStrategy: 'kebab',
            rtlSupport: false
        }
    },
    transpileDependencies: [
        'quasar'
    ]
}
