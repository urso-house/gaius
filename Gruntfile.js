module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dist: ['dist']
    },
    connect: {
      server: {
        options: {
          hostname: '*',
          port: 9000,
          keepalive: false,
          livereload: true,
          open: true,
          base: {
            path: 'dist',
            options: {
              index: 'index.html'
            }
          },
          middleware: function (connect) {
            var connectStatic = require('serve-static');
            return [require('connect-modrewrite')(['!\\.html|\\.woff2|\\.js|\\.svg|\\.css|\\.png|\\.ico|\\.jpg$ /index.html [L]'])].concat(
              connectStatic('dist')
            );
          }
        }
      }
    },
    pug: {
      init: {
        options: {
          pretty: false,
          client: false,
          data: function(dest, src) {
            return {
              data: grunt.file.readJSON('src/data.json'),
            }
          }
        },
        files: [
          {
            cwd: 'src/pages',
            src: '**/*.pug',
            dest: 'dist',
            expand: true,
            ext: '.html'
          }
        ]
      }
    },
    stylus: {
      init: {
        expand: true,
        cwd: 'src/stylus',
        src: 'main.styl',
        dest: 'dist/css',
        ext: '.css',
        options: {
          import: [__dirname + '/src/stylus/includes/*'],
          use: [
            function () { return require('autoprefixer-stylus')('last 2 versions', 'ie 8'); }
          ]
        }
      }
    },
    imagemin: {
      init: {
        files: [{
          expand: true,
          cwd: 'src/images',
          src: ['**/*.{png,jpg,gif,ico,svg}'],
          dest: 'dist/images'
        }]
      }
    },
    concat: {
      dist: {
        src: ['src/js/**/*.js'],
        dest: 'dist/js/main.js'
        //dest: 'dist/js/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    uglify: {
      init: {
        options: {
          banner: '/*! v<%= pkg.version %> - Build: <%= grunt.template.today("dd/mm/yyyy H:M:ss") %>\n*/'
        },
        files: [{
          // expand: true,
          // cwd: 'dist',
          src: ['dist/js/main.js'],
          dest: 'dist/js/main.min.js'
        }]
      }
    },
    watch: {
      pug: {
        files: ['src/**/*.pug'],
        tasks: ['pug'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['src/**/*.js'],
        tasks: ['concat'],
        options: {
          livereload: true
        }
      },
      styl: {
        files: ['src/**/*.styl'],
        tasks: ['stylus'],
        options: {
          livereload: true
        }
      },
      img: {
        files: ['src/images/**/*'],
        tasks: ['imagemin'],
        options: {
          livereload: true
        }
      }
    },
    copy: {
      main: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**/*'],
          dest: 'docs'
        }]
      },
    },
  });

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' was ' + action);
  });
  grunt.registerTask('default', ['clean:dist', 'pug', 'stylus', 'imagemin', 'concat', 'uglify', 'connect:server', 'watch']);
  grunt.registerTask('build', ['clean:dist', 'pug', 'stylus', 'imagemin', 'concat', 'copy']);
};
