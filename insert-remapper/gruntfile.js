module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        ts: {
            options: {
                target: 'es5',
                module: 'commonjs',
                noImplicitAny: true,
                fast: "never",
                compiler: './node_modules/grunt-ts/customcompiler/tsc'
            },
            dev: {
                src: ["*.ts","tests/**/*.ts"]
            }
        },
        nodeunit: {
            dev: ['tests/index-nodeunit-tests.js']
        }
        //qunit: {
        //    dev: {
        //        options: {
        //            urls: [
        //              'http://localhost:8000/tests/index.html'
        //            ]
        //        }
        //    }
        //},
        //connect: {
        //    dev: {
        //        options: {
        //            port: 8000,
        //            base: '.',
        //            hostname: '*'
        //        }
        //    }
        //},
        //browserify: {
        //    dev: {
        //        files : {
        //            'dist/index.js' : 'index.js',
        //            'dist/tests/index-tests.js': 'tests/index-tests.js'
        //        }
        //    }
        //}
    });

    grunt.loadNpmTasks("grunt-ts");
    //grunt.loadNpmTasks('grunt-contrib-qunit');
    //grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    //grunt.loadNpmTasks('grunt-browserify');
    //grunt.registerTask("default", ["ts", "browserify", "connect", "qunit"]);
    grunt.registerTask("default", ["ts", "nodeunit"]);
};

