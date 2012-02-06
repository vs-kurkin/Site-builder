/*
 * Copyright (c) Site-builder, 30.1.2012.
 * Source: https://github.com/B-Vladi/Site-builder
 * Author: Vlad Kurkin, b-vladi@cs-console.ru.
 */

importClass(java.io.File);
importClass(org.apache.tools.ant.ProjectHelper);
importClass(org.apache.tools.ant.Target);
importClass(java.io.FileReader);
importClass(java.io.BufferedReader);

function Module(name, options) {
	this.buildFile = new File(project.getProperty('path.modules') + File.separator + options.src);

	if (!(this.buildFile && this.buildFile.file)) {
		throw 'Can not find build file "' + options.src + '"';
	}

	this.configs = options.configs;
	this.depends = options.depends;
	this.name = name;
	this.project = project.createSubProject();

	ProjectHelper.configureProject(this.project, this.buildFile);

	var elements = project.getBuildListeners().elements();

	while (elements.hasMoreElements()) {
		this.project.addBuildListener(elements.nextElement());
	}

	this.globalTarget = this.project.getTargets().get('');

	var defaulttargetName = this.project.getDefaultTarget();
	if (defaulttargetName != null) {
		this.defaultTarget = this.project.getTargets().get(defaulttargetName);
	}
}

Module.prototype.init = function () {
	var homeDir = this.buildFile.getParentFile();

	this.project.setBaseDir(homeDir);
	this.project.setProperty('HOMEDIR', homeDir.getAbsolutePath());

	for (var name in LIBS) {
		if (LIBS.hasOwnProperty(name)) {
			this.project.addReference(name, LIBS[name]);
		}
	}

	this.globalTarget.execute();
};

Module.prototype.run = function (configFilePath) {
	if (!(typeof configFilePath == 'string' && configFilePath.length)) {
		throw 'Path to the configuration file for the module ' + this.name + ' is not defined';
	}

	var configFile = new File(configFilePath);

	if (!(configFile && configFile.file)) {
		throw 'Can not find the configuration file in "' + configFilePath + '" for the module "' + this.name + '"';
	}

	var buffer = new BufferedReader(new FileReader(configFile)), text = '', line;

	while (line = buffer.readLine()) {
		text += line;
	}

	this.project.setProperty('CONFIG.TEXT', text);
	this.project.setProperty('CONFIG.PATH', configFilePath);

	this.project.setBaseDir(configFile.getParentFile());
	this.defaultTarget && this.defaultTarget.execute();
};

var MODULES = {};
project.addReference('MODULES', MODULES);

for (var name in CONFIG.modules) {
	if (CONFIG.modules.hasOwnProperty(name)) {
		if (MODULES.hasOwnProperty(name)) {
			throw 'The module "' + name + '" already exist';
		}

		var module = new Module(name, CONFIG.modules[name]);

		if (module.hasOwnProperty('defaultTarget')) {
			var target = new Target();
			target.setName(name);
			project.addTarget(target);

			var property = project.createTask('property');
			property.setName('moduleName');
			property.setValue(name);
			target.addTask(property);

			var script = project.createTask('script');
			script.setLanguage('javascript');
			script.addText('project.executeTarget("' + project.getDefaultTarget() + '");');
			target.addTask(script);

			MODULES[name] = module;
		}
	}
}