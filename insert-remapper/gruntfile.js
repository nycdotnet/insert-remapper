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
        qunit: {
            all: {
                options: {
                    urls: [
                      'http://localhost:8000/tests/index.html'
                    ]
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: '.',
                    hostname: '*'
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask("default", ["ts:dev", "connect", "qunit"]);
};

