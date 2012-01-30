/*
 * Copyright (c) Site-builder, 30.1.2012.
 * Source: https://github.com/B-Vladi/Site-builder
 * Author: Vlad Kurkin, b-vladi@cs-console.ru.
 */

importClass(java.io.File);

var CONFIG = JSON.parse(project.getProperty('CONFIG.TEXT'))
	,cleanDir = project.createTask('delete');

project.setProperty('path.source', CONFIG.sourceDir);
project.setProperty('path.destination', CONFIG.destinationDir);

cleanDir.setDir(new File(basedir + '/' + CONFIG.destinationDir));
cleanDir.execute();

for (var fileName in CONFIG.files) {
	if (CONFIG.files.hasOwnProperty(fileName)) {
		var fileData = CONFIG.files[fileName];

		print(fileData.includes.join(','));

		AntApi.runTarget(project, 'concat', {
			'file.name': fileName,
			'file.includes': fileData.hasOwnProperty('includes') ? fileData.includes.join(',') : '*',
			'file.excludes': fileData.hasOwnProperty('excludes') ? fileData.excludes.join(',') : '*',
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