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
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.registerTask("default", ["ts", "nodeunit"]);
};

