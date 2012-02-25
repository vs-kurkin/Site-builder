/*
 Copyright (c) Site builder.
 Source: https://github.com/B-Vladi/Site-builder
 Author: Vlad Kurkin, b-vladi@cs-console.ru.
 */

importClass(java.io.File);

var scriptsDir = project.getProperty('scripts.dir') + File.separator,
	script = project.createTask('script');

script.setLanguage('javascript');

script.setSrc(scriptsDir + 'loadConfig.js');
script.execute();

script.setSrc(scriptsDir + 'loadModules.js');
script.execute();