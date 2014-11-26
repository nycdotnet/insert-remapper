module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        ts: {
            options: {
                target: 'es5',
                module: 'commonjs',
                noImplicitAny: true,
                fast: "never",
                compiler: './node_modules/grunt-ts/customcompiler/tsc',
                comments: true
            },
            default: {
                src: ["*.ts"]
            }
        },
        execute: {
            target: {
                options: {
                    args: ['index-tests.js']
                },
                src: ['doNotImport.js']
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-execute');
    grunt.registerTask("default", ["ts", "execute"]);
};

