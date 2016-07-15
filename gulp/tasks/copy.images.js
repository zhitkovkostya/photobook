'use strict';

module.exports = () => {
  $.gulp.task('copy:images', () => {
    return $.gulp.src('./source/images/**')
      .pipe($.gulp.dest($.config.root + '/assets/img'));
  });
};
