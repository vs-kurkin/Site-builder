importClass(java.io.File);

var CONFIG = JSON.parse(project.getProperty('CONFIG.TEXT'));

if (CONFIG.hasOwnProperty('baseDir')) {
	project.setBaseDir(new File(basedir, CONFIG.baseDir));
}

var JSDocHome = HOMEDIR + '/' + project.getProperty('jsdoc.home');
var javaTask = project.createTask('java');

javaTask.setFork(true);
javaTask.setDir(new File(JSDocHome));
javaTask.setJar(new File(JSDocHome, 'jsrun.jar'));

if (CONFIG.hasOwnProperty('configFile') && CONFIG.configFile != '') {
	javaTask.createArg().setValue('-c=' + CONFIG.configFile);
	javaTask.createArg().setValue('-j=app/run.js');
	javaTask.execute();
} else {
	javaTask.createArg().setValue('app/run.js');
	javaTask.createArg().setValue('-t=' + 'templates' + File.separator + (CONFIG.template || 'jsdoc'));
	javaTask.createArg().setValue('-d=' + new File(basedir, CONFIG.outputDir || '.').getAbsolutePath());
	javaTask.createArg().setValue('-e=' + (CONFIG.encoding || 'UTF-8'));
	javaTask.createArg().setValue('-x=' + (CONFIG.extension || 'js'));

	if (CONFIG.hasOwnProperty('isUndocumentedFunctions') && CONFIG.isUndocumentedFunctions === true) {
		javaTask.createArg().setValue('-a');
	}

	if (CONFIG.hasOwnProperty('isSuppressSourceOut') && CONFIG.isSuppressSourceOut === true) {
		javaTask.createArg().setValue('-s');
	}

	if (CONFIG.hasOwnProperty('isUnderscoredFunctions') && CONFIG.isUnderscoredFunctions === true) {
		javaTask.createArg().setValue('-A');
	}

	if (CONFIG.hasOwnProperty('isPrivate') && CONFIG.isPrivate === true) {
		javaTask.createArg().setValue('-p');
	}

	if (CONFIG.hasOwnProperty('isVerbose') && CONFIG.isVerbose === true) {
		javaTask.createArg().setValue('-v');
	}

	if (CONFIG.hasOwnProperty('logFile') && CONFIG.logFile != '') {
		javaTask.createArg().setValue('-o=' + CONFIG.logFile);
	}

	if (CONFIG.hasOwnProperty('inputDir') && CONFIG.inputDir != '') {
		var depth = Number(CONFIG.depth),
			arg = javaTask.createArg();

		if (isNaN(depth)) {
			arg.setValue('-r=10');
		} else if (depth < 0) {
			arg.setValue('-r');
		} else {
			arg.setValue('-r=' + depth);
		}

		javaTask.createArg().setValue(CONFIG.inputDir);
	} else {
		var fileSet = project.createDataType('fileset');
		fileSet.setDir(project.getBaseDir());

		if (CONFIG.hasOwnProperty('excludes')) {
			fileSet.setExcludes(CONFIG.excludes.join(','));
		}

		if (CONFIG.hasOwnProperty('includes')) {
			fileSet.setIncludes(CONFIG.includes.join(','));
		}

		var iterator = fileSet.iterator();

		while (iterator.hasNext()) {
			javaTask.createArg().setValue(iterator.next());
		}
	}

	if (CONFIG.hasOwnProperty('arguments')) {
		var arguments = CONFIG.arguments;
		for (var name in arguments) {
			if (arguments.hasOwnProperty(name)) {
				javaTask.createArg().setValue('-D=' + name + ':' + arguments[name]);
			}
		}
	}

	javaTask.createArg().setValue('-j=app/run.js');

	javaTask.execute();
}