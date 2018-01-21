module.exports = function (grunt) {

    var config = require('./.screeps.json')
    var branch = config.branch;
    var email = grunt.option('email') || config.email;
    var password = grunt.option('password') || config.password;
    var ptr = grunt.option('ptr') ? true : config.ptr;

    // parameters

    grunt.loadNpmTasks('grunt-screeps')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-file-append')
    grunt.loadNpmTasks("grunt-ts")

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
            options: {
                comments: false,
                sourceRoot: '',
                mapRoot: './map',
                declaration: true,
            },
            default: {
                src: ["src/**/*.ts"],
            }
        },

        // Remove all files from the dist folder.
        clean: {
            dist: {
                'dist': ['dist']
            },
            obj: {
                'obj': ['obj']
            }
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
                        append: "\nglobal.SCRIPT_VERSION = " + currentdate.getTime() + "\n",
                        input: 'dist/version.js',
                    }
                ]
            }
        },
    })

    grunt.registerTask('default', ['clean:dist', 'copy:screeps']);
    grunt.registerTask('commit', ['clean:dist', 'copy:screeps', 'copy:version', 'file_append:versioning', 'screeps']);
    grunt.registerTask('compile', ['clean:obj', 'ts']);
    grunt.registerTask('clean2', ['clean:obj']);
}