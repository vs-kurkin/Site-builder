importClass(java.io.File);

var CONFIG = JSON.parse(project.getProperty('CONFIG.TEXT'));

if (CONFIG.hasOwnProperty('baseDir')) {
	project.setBaseDir(new File(basedir, CONFIG.baseDir));
}

var JSHint = project.createTask('jshint');

JSHint.setDir(project.getBaseDir());

if (CONFIG.hasOwnProperty('optionsFile') && CONFIG.optionsFile != '') {
	JSHint.setOptionsFile(CONFIG.optionsFile);
}

if (CONFIG.hasOwnProperty('reportFile') && CONFIG.reportFile != '') {
	JSHint.setReportFile(CONFIG.reportFile);
}

if (CONFIG.hasOwnProperty('options')) {
	var options = '';

	for (var name in CONFIG.options) {
		if (CONFIG.options.hasOwnProperty(name)) {
			options += name + '=' + CONFIG.options[name] + ',';
		}
	}

	JSHint.setOptions(options);
}

JSHint.setFail(CONFIG.fail !== false);

JSHint.setIncludes(CONFIG.hasOwnProperty('includes') ? CONFIG.includes.join(',') : '*');
JSHint.setExcludes(CONFIG.hasOwnProperty('excludes') ? CONFIG.includes.join(',') : '*');

JSHint.execute();