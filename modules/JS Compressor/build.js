/*
 Copyright (c) Site-builder, 2012.
 Source: https://github.com/B-Vladi/Site-builder
 Vlad Kurkin, b-vladi@cs-console.ru.
 */

importClass(java.io.File);

var CONFIG = JSON.parse(project.getProperty('CONFIG.TEXT')), targets = project.getTargets(), cleanDir = project.createTask('delete');

function runTarget(name, properties) {
	for (var propertyName in properties) {
		if (properties.hasOwnProperty(propertyName)) {
			project.setProperty(propertyName, properties[propertyName]);
		}
	}

	targets.get(name).execute();
}

project.setProperty('path.source', CONFIG.sourceDir);
project.setProperty('path.destination', CONFIG.destinationDir);

cleanDir.setDir(new File(basedir + '/' + CONFIG.destinationDir));
cleanDir.execute();

for (var fileName in CONFIG.files) {
	if (CONFIG.files.hasOwnProperty(fileName)) {
		var fileData = CONFIG.files[fileName];

		runTarget('concat', {
			'file.name': fileName,
			'file.includes': fileData.hasOwnProperty('includes') ? fileData.includes.join(',') : '*',
			'file.excludes': fileData.hasOwnProperty('excludes') ? fileData.excludes.join(',') : '*',
			'casesensitive': fileData.hasOwnProperty('caseSensitive') ? !!fileData.caseSensitive : false
		});

		if (fileData.compile !== false) {
			runTarget('compile', {
				'file.name': fileName,
				'file.path': CONFIG.destinationDir + '/' + fileName,
				'compilation.level': fileData.hasOwnProperty('compile') ? fileData.compile : CONFIG.compile
			});
		}

		if (CONFIG.gZipped !== false) {
			runTarget('gZipped', {
				'file.name': fileName
			});
		}
	}
}