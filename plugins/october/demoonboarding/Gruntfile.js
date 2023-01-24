module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        less: {
            onboarding: {
                files: {
                    'assets/css/onboarding.css': 'assets/less/onboarding.less'
                }
            }
        },
        cssmin: {
            target: {
                files: {
                    'assets/css/onboarding.css': 'assets/css/onboarding.css'
                }
            }
        },
        watch: {
            onboardingLess: {
                files: ['assets/less/**/*.less'],
                tasks: ['less:onboarding', 'cssmin'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['less:onboarding', 'cssmin']);
};
