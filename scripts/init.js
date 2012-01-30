/*
 * Copyright (c) Site-builder, 30.1.2012.
 * Source: https://github.com/B-Vladi/Site-builder
 * Author: Vlad Kurkin, b-vladi@cs-console.ru.
 */

importClass(java.io.File);

var pathScripts = project.getProperty('path.scripts') + File.separator, script = project.createTask('script');

script.setLanguage('javascript');

script.setSrc(pathScripts + 'loadConfig.js');
script.execute();

script.setSrc(pathScripts + 'loadLibs.js');
script.execute();

script.setSrc(pathScripts + 'loadModules.js');
script.execute();