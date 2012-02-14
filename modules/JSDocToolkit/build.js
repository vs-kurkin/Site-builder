importClass(java.io.File);

var CONFIG = JSON.parse(project.getProperty('CONFIG.TEXT'));

if (CONFIG.hasOwnProperty('baseBir')) {
	project.setBaseDir(CONFIG.baseDir);
}

var jsDocToolkit = project.createTask('jsdoctoolkit');
jsDocToolkit.setJsdochome(HOMEDIR + '/' + project.getProperty('jsdoc.home') + '/');

jsDocToolkit.setTemplate(CONFIG.template || 'jsdoc');
jsDocToolkit.setOutputdir(CONFIG.outputDir || basedir);

if (typeof CONFIG.inputDir == 'string' && CONFIG.inputDir.length) {
	jsDocToolkit.setInputdir(CONFIG.inputDir);

	if (!isNaN(Number(CONFIG.depth)) && CONFIG.depth >= 0) {
		jsDocToolkit.setDepth(CONFIG.depth);
	}

	if (CONFIG.extensions && CONFIG.extensions.length) {
		jsDocToolkit.setExtensions(CONFIG.extensions.join(','));
	}
} else {
	var fileSet = project.createDataType('fileset');
	fileSet.setDir(new File(basedir));

	if (CONFIG.includes) {
		fileSet.setIncludes(CONFIG.includes.join(','));
	}

	if (CONFIG.excludes) {
		fileSet.setExcludes(CONFIG.excludes.join(','));
	}

	jsDocToolkit.addFileSet(fileSet);
}


if (typeof CONFIG.includeUnderscored == 'boolean') {
	jsDocToolkit.setIncludeunderscored(CONFIG.includeUnderscored);
}

if (typeof CONFIG.includeUndocumented == 'boolean') {
	jsDocToolkit.setIncludeundocumented(CONFIG.includeUndocumented);
}

if (typeof CONFIG.includePrivate == 'boolean') {
	jsDocToolkit.setIncludeprivate(CONFIG.includePrivate);
}

if (typeof CONFIG.verbose == 'boolean') {
	jsDocToolkit.setVerbose(CONFIG.verbose);
}

if (typeof CONFIG.logFile == 'string' && CONFIG.logFile.length) {
	jsDocToolkit.setLog(CONFIG.logFile);
}

if (typeof CONFIG.encoding == 'string' && CONFIG.encoding.length) {
	jsDocToolkit.setLog(CONFIG.encoding);
}

if (CONFIG.arguments) {
	for (var name in CONFIG.arguments) {
		var argument = project.createDataType('Arg');
		argument.setName(name);
		argument.setValue(CONFIG.arguments[name]);
		jsDocToolkit.addArg(argument);
	}
}

jsDocToolkit.execute();