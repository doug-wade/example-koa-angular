"use strict";

let babel      = require('gulp-babel');
let bower      = require("gulp-bower");
let concat     = require("gulp-concat");
let david      = require("gulp-david");
let del        = require("del");
let gulp       = require("gulp");
let imagemin   = require("gulp-imagemin");
let install    = require("gulp-install");
let jade       = require("gulp-jade");
let karma      = require("karma");
let livereload = require("gulp-livereload");
let mocha      = require("gulp-mocha-co");
let ngHtml2Js  = require("gulp-ng-html2js");
let nodemon    = require("gulp-nodemon");
let path       = require("path");
let pngquant   = require("imagemin-pngquant");
let protractor = require("gulp-protractor").protractor;
let ptor       = require("protractor");
let stylus     = require("gulp-stylus");
let uglify     = require("gulp-uglify");

let paths = {
  bower: "public/vendor",
  bowerjson: "./bower.json",
  build: "build",
  e2especs: "test/e2e/*.scenarios.js",
  karmaconf: __dirname + "/karma.conf.js",
  images: "./images/**/*.*",
  packagejson: "./package.json",
  partials: "partials/*.jade",
  public: "public",
  scripts: "webapp/**/*.js",
  server: "server/*.js",
  serverspecs: "test/server/*.spec.js",
  styles: "./stylesheets/**/*.css",
  views: "views/*.jade"
};

gulp.task("angular-views", () => {
  return gulp.src(paths.partials)
    .pipe(jade())
    .pipe(ngHtml2Js({
      moduleName: "example-koa-angular",
      prefix: "/partials/"
    }))
    .pipe(concat("angular-views.min.js"))
    .pipe(gulp.dest(path.join(paths.public, "scripts")))
    .pipe(livereload());
});

gulp.task("bower", () => {
  return gulp.src([paths.bowerjson])
    .pipe(install());
});

gulp.task("checkDependencies", function() {
  return gulp.src("package.json")
    .pipe(david())
    .pipe(david.reporter)
});

gulp.task("upgradeDependencies", function() {
  gulp.src(paths.packagejson)
    .pipe(david({ update: true }))
    .pipe(gulp.dest('.'));
});

gulp.task("clean", function() {
  return del([paths.build, paths["public"]], function(err, deletedFiles) {
    return console.log('Cleaned files:', deletedFiles.join(', '));
  });
});

gulp.task("images", function() {
  return gulp.src(paths.images)
    .pipe(imagemin({
      optimizationLevel: 5,
      use: [pngquant()]
    }))
    .pipe(gulp.dest(path.join(paths.public + "/images")))
    .pipe(livereload());
});

gulp.task("karma", function(done) {
  return karma.server.start({
    configFile: paths.karmaconf,
    singleRun: true
  }, done);
});

gulp.task("mocha", function() {
  return gulp.src(paths.serverspecs)
    .pipe(mocha({
      reporter: "nyan"
    }));
});

gulp.task("npm", function() {
  return gulp.src([paths.packagejson])
    .pipe(install());
});

gulp.task("protractor", ["webdriver_update", "webdriver_standalone"], function() {
  return gulp.src(paths.e2especs).pipe(protractor({
    configFile: "protractor.conf.js"
  })).on("error", function(e) {
    throw e;
  });
});

gulp.task("server", function() {
  return nodemon({
    script: paths.build + "/app.js",
    nodeArgs: ["--harmony"],
    ignore: ["images", "node_modules", "public", "server", "styles", "test", "views", "webapp"]
  });
});

gulp.task("server-scripts", function() {
  return gulp.src(paths.server)
    .pipe(babel())
    .pipe(gulp.dest(paths.build));
});

gulp.task("scripts", function() {
  return gulp.src(paths.scripts)
    .pipe(babel())
    .pipe(concat("all.js"))
    .pipe(uglify())
    .pipe(gulp.dest(paths["public"] + "/scripts"))
    .pipe(livereload());
});

gulp.task("styles", function() {
  return gulp.src(paths.styles)
    .pipe(gulp.dest(paths["public"] + "/stylesheets"))
    .pipe(livereload());
});

gulp.task("views", function() {
  return gulp.src(paths.views)
    .pipe(jade())
    .pipe(gulp.dest(paths.public))
    .pipe(livereload());
});

gulp.task("watch", function() {
  gulp.watch(paths.partials, ["angular-views"]);
  gulp.watch(paths.bowerjson, ["bower"]);
  gulp.watch(paths.images, ["images"]);
  gulp.watch(paths.packagejson, ["npm"]);
  gulp.watch(paths.styles, ["styles"]);
  gulp.watch(paths.scripts, ["scripts"]);
  gulp.watch(paths.server, ["server-scripts"]);
  return gulp.watch(paths.views, ["views"]);
});

gulp.task("webdriver_standalone", ptor.webdriver_standalone);
gulp.task("webdriver_update", ptor.webdriver_update);
gulp.task("compile", ["bower", "images", "views", "styles", "scripts", "server-scripts"]);
gulp.task("default", ["compile", "watch", "server"]);
gulp.task("test", ["mocha", "karma", "protractor"]);
