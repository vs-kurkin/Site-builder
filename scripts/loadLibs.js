/*
 * Copyright (c) Site builder.
 * Source: https://github.com/B-Vladi/Site-builder
 * Author: Vlad Kurkin, b-vladi@cs-console.ru.
 */

importClass(java.io.File);

var libProject = project.createSubProject(), pathLibs = project.getProperty('path.libs') + File.separator, LIBS = {}, script = libProject.createTask('script'), libData;

script.setSetBeans(false);

for (var name in CONFIG.libraries) {
	if (CONFIG.libraries.hasOwnProperty(name)) {
		if (LIBS.hasOwnProperty(name)) {
			throw 'The library "' + name + '" already exist';
		}

		libData = CONFIG.libraries[name];
		script.setLanguage(libData.language);
		script.setSrc(pathLibs + libData.src);
		script.execute();

		LIBS[name] = libProject.getReference('EXPORT');
	}
}

project.addReference('LIBS', LIBS);