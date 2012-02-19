importClass(java.io.File);

var CONFIG = JSON.parse(project.getProperty('CONFIG.TEXT'));

if (CONFIG.hasOwnProperty('baseDir')) {
	project.setBaseDir(new File(basedir, CONFIG.baseDir));
}

project.setProperty('fail', CONFIG.fail === false ? 'false' : 'true');
project.setProperty('reportfile', CONFIG.hasOwnProperty('reportFile') && CONFIG.reportFile.length ? basedir + '/' + CONFIG.reportFile : '');
project.setProperty('includes', CONFIG.hasOwnProperty('includes') ? CONFIG.includes.join(',') : '*');
project.setProperty('excludes', CONFIG.hasOwnProperty('excludes') ? CONFIG.includes.join(',') : '*');
project.setProperty('optionsfile', CONFIG.hasOwnProperty('optionsFile') && CONFIG.optionsFile.length ? basedir + '/' + CONFIG.optionsFile : '');

if (CONFIG.hasOwnProperty('options')) {
	var options = '';

	for (var name in CONFIG.options) {
		if (CONFIG.options.hasOwnProperty(name)) {
			options += name + '=' + CONFIG.options[name] + ',';
		}
	}

	project.setProperty('options', options);
}