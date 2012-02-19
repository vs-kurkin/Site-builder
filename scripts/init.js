/*
 Copyright (c) Site builder.
 Source: https://github.com/B-Vladi/Site-builder
 Author: Vlad Kurkin, b-vladi@cs-console.ru.
 */

importClass(java.io.File);

var pathScripts = project.getProperty('scripts.dir') + File.separator,
	script = project.createTask('script');

script.setLanguage('javascript');

script.setSrc(pathScripts + 'loadConfig.js');
script.execute();

script.setSrc(pathScripts + 'loadModules.js');
script.execute();