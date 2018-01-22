module.exports = function (grunt) {

    var config = require('./.screeps.json');
    var branch = 'Swarm0.2';//config.branch;
    var email = grunt.option('email') || config.email;
    var password = grunt.option('password') || config.password;
    var ptr = grunt.option('ptr') ? true : config.ptr;

    // parameters

    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-file-append');
    grunt.loadNpmTasks("grunt-ts");

    var currentdate = new Date();

    // Output the current date and branch.
    grunt.log.subhead('Task Start: ' + currentdate.toLocaleString())
    grunt.log.writeln('Branch: ' + branch)

    grunt.initConfig({
        screeps: {
            options: {
                email: email,
                password: password,
                branch: branch,
                ptr: ptr
            },
            dist: {
                src: ['dist/*.js']
            },
        },
        ts: {
            Base: {
                tsconfig: './tscommon.json'
            },
            default: {
                tsconfig: true
            }
        },

        // Remove all files from the dist folder.
        clean: {
            default: ['dist', 'obj', 'decl', 'build', 'obj/declared', 'src/declarations'],
        },

        // Copy all source files into the dist folder, flattening the folder structure by converting path delimiters to underscores
        copy: {
            // Pushes the game code to the dist folder so it can be modified before being send to the screeps server.
            screeps: {
                files: [{
                    expand: true,
                    cwd: 'obj/',
                    src: '**',
                    dest: 'dist/',
                    filter: 'isFile',
                    rename: function (dest, src) {
                        // Change the path name utilize underscores for folders
                        return dest + src.replace(/\//g, '_');
                    }
                }],
            },
            version: {
                files: [{ src: ['./src/version.js'], dest: './dist/version.js'}],
            },
        },
        file_append: {
            versioning: {
                files: [
                    {
                        append: "global.SCRIPT_VERSION = " + currentdate.getTime() + "\n",
                        input: 'dist/version.js',
                    }
                ]
            }
        },
        concat: {
            options: {
                separator: '\n/************************************************************************************************************/\n',
            },
            common: {
                src:["./build/declared/common/IDisposable.js", "./build/declared/common/IMemory.js"],
                dest:"./obj/declared/common.js"
            }
        }
    })

    grunt.registerTask('default', ['clean', 'ts', 'copy:screeps']);
    grunt.registerTask('commit', ['clean', 'ts', 'copy:screeps', 'copy:version', 'file_append:versioning', 'screeps']);
    grunt.registerTask('decl', ['clean', 'ts:Base']);
    grunt.registerTask('tryConcat', ['concat']);
    grunt.registerTask('cleanAll', ['clean']);

    grunt.registerTask('test', ['ts:default', 'copy:screeps', 'screeps']);
    grunt.registerTask('TryFullCompile', ['clean', 'ts:Base', 'concat', 'ts:default', 'copy:screeps', 'copy:version', 'file_append:versioning', 'screeps']);
}