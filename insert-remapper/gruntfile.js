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
                src: ["*.ts", "./tests/**/*.ts"]
            }
        },
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.registerTask("default", ["ts:dev"]);
};

