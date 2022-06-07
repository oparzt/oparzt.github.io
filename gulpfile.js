const { src, dest, series, parallel, watch } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify-es').default;
const cssMinify = require('gulp-csso');
const htmlMinify = require('gulp-htmlmin');
const connect = require('gulp-connect');
const sass = require('gulp-sass')(require('sass'));
const closureCompiler = require('gulp-closure-compiler');
const pug = require('gulp-pug');

const func = {
  buildJS() {
    return src('src/**/*.js')
      .pipe(uglify({
        toplevel: true
      }))
      .pipe(dest('dist/'))
  },

  buildDevJS() {
    return src('src/**/*.js')
      .pipe(uglify({
        toplevel: true
      }))
      .pipe(dest('dist/'))
  },

  buildSecretJS() {
    return src('src/design/index2.js')
      .pipe(closureCompiler({
        compilerPath: 'closure-compiler.jar',
        externs: [
          'src/perfect-scrollbar.min.js'
        ],
        fileName: 'index.js',
        compilerFlags: {
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          warning_level: 'VERBOSE'
        }
      }))
      .pipe(dest('dist/design/'))
  },

  buildCSS() {
    return src('src/**/*.scss')
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(dest('dist/'))
  },

  buildHTML() {
    return src('src/**/index.pug')
      .pipe(pug({}))
      .pipe(dest('dist/'))
    // return src('src/**/*.html')
    //   .pipe(htmlMinify({
    //     removeComments: true,
    //     collapseWhitespace: true
    //   }))
    //   .pipe(dest('dist/'))
  },

  copyImages() {
    return src('src/images/**/*.*')
      .pipe(dest('dist/images'))
  },

  copyFonts() {
    return src('src/fonts/**/*.*')
      .pipe(dest('dist/fonts/'))
  },

  copyPotracio() {
    return src('src/potracio/*.*')
      .pipe(dest('dist/potracio/'))
  },

  copyPaycom() {
    return src('src/paycom/**/*.*')
      .pipe(dest('dist/paycom/'))
  },

  copyOrders() {
    return src('src/design/orders/**/*.*')
      .pipe(dest('dist/design/orders/'))
  },

  copyVideo() {
    return src('src/video/*')
      .pipe(dest('dist/video'));
  },

  clean() {
    return(src('dist/*'))
      .pipe(clean({force: true}))
  }
}

async function build() {
  series(
    func.clean,
    parallel(
      func.buildJS, 
      func.buildCSS, 
      func.buildHTML, 
      func.copyFonts, 
      func.copyImages, 
      func.copyVideo,
      func.copyPotracio,
      func.copyPaycom,
      func.copyOrders
    )
  )();

  await Promise.resolve();
}

function dev() {
  series(
    func.clean,
    parallel(
      func.buildDevJS,
      func.buildCSS, 
      func.buildHTML, 
      func.copyFonts, 
      func.copyImages, 
      func.copyVideo,
      func.copyPotracio,
      func.copyPaycom,
      func.copyOrders
    )
  )();

  watch('src/**/*.js', {delay: 2500}, series(func.buildDevJS));
  watch('src/**/*.scss', {delay: 2500}, series(func.buildCSS));
  watch('src/**/*.pug', {delay: 2500}, series(func.buildHTML));
  watch('src/images/**/*.*', {delay: 2500}, series(func.copyImages));

  connect.server({
    name: 'MetalCard server start',
    root: 'dist',
    livereload: true
  });
}

exports.build = build;
exports.dev = dev;