importClass(java.io.File);

var pathScripts = project.getProperty('path.scripts') + File.separator,
	script = project.createTask('script');

script.setLanguage('javascript');

script.setSrc(pathScripts + 'loadConfig.js');
script.execute();

script.setSrc(pathScripts + 'loadLibs.js');
script.execute();

script.setSrc(pathScripts + 'loadModules.js');
script.execute();