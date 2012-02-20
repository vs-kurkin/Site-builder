/*
 * Copyright (c) Site builder.
 * Source: https://github.com/B-Vladi/Site-builder
 * Author: Vlad Kurkin, b-vladi@cs-console.ru.
 */

importClass(java.io.File);

var CONFIG = JSON.parse(project.getProperty('CONFIG.TEXT')),
	cleanDir = project.createTask('delete');

if (CONFIG.hasOwnProperty('baseDir')) {
	project.setBaseDir(new File(basedir, CONFIG.baseDir));
}

project.setProperty('source.dir', CONFIG.sourceDir);
project.setProperty('destination.dir', CONFIG.destinationDir);

cleanDir.setDir(new File(project.getBaseDir(), CONFIG.destinationDir));
cleanDir.execute();

for (var fileName in CONFIG.files) {
	if (CONFIG.files.hasOwnProperty(fileName)) {
		var fileData = CONFIG.files[fileName];

		AntApi.runTarget(project, 'concat', {
			'file.name': fileName,
			'includes': fileData.hasOwnProperty('includes') ? fileData.includes.join(',') : '',
			'excludes': fileData.hasOwnProperty('excludes') ? fileData.excludes.join(',') : '',
			'casesensitive': fileData.hasOwnProperty('caseSensitive') ? !!fileData.caseSensitive : false
		});

		if (fileData.compile !== false) {
			AntApi.runTarget(project, 'compile', {
				'file.name': fileName
			});
		}

		if (CONFIG.gZipped !== false) {
			AntApi.runTarget(project, 'gZipped', {
				'file.name': fileName
			});
		}
	}
}