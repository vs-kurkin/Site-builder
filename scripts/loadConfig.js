importClass(java.io.File);
importClass(java.io.FileReader);
importClass(java.io.BufferedReader);

var configFilePath = project.getProperty('path.config');
if (configFilePath == null || !configFilePath.length) {
	throw 'Property "path.config" not specified';
}

var configFile = new File(configFilePath);
if (!configFile) {
	throw 'Can not find configuration file in "' + basedir + File.separator + configFilePath + '"';
}

var buffer = new BufferedReader(new FileReader(configFile)),
	cfgString = '',
	line;

while (line = buffer.readLine()) {
	cfgString += line;
}

project.addReference('CONFIG', new Function('return ' + cfgString)());