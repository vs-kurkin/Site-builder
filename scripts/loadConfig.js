/*
 Copyright (c) Site builder.
 Source: https://github.com/B-Vladi/Site-builder
 Author: Vlad Kurkin, b-vladi@cs-console.ru.
 */

importClass(java.io.File);
importClass(java.io.FileReader);
importClass(java.io.BufferedReader);

var configFilePath = project.getProperty('config');

if (configFilePath == null || !configFilePath.length) {
	var input = project.createTask('input');
	input.setMessage('Enter path to "config" file');
	input.setAddproperty('config');
	input.execute();

	configFilePath = project.getProperty('config');

	if (!configFilePath.length) {
		throw 'Property "config" not specified';
	}
}

var configFile = new File(configFilePath);
if (!configFile) {
	throw 'Can not find configuration file in "' + basedir + File.separator + configFilePath + '"';
}

project.setProperty('CONFIG.DIR', configFile.getParentFile());

var buffer = new BufferedReader(new FileReader(configFile)),
	cfgString = '',
	line;

while (line = buffer.readLine()) {
	cfgString += line;
}

self.log('Loaded configuration file from ' + configFilePath);

project.addReference('CONFIG', JSON.parse(cfgString));