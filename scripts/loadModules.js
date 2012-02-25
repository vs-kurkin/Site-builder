/*
 Copyright (c) Site builder.
 Source: https://github.com/B-Vladi/Site-builder
 Author: Vlad Kurkin, b-vladi@cs-console.ru.
 */

importClass(java.io.File);
importClass(org.apache.tools.ant.ProjectHelper);
importClass(org.apache.tools.ant.Target);
importClass(java.io.FileReader);
importClass(java.io.BufferedReader);

function Module(name, options) {
	this.buildFile = new File(project.getProperty('modules.dir') + File.separator + name + File.separator + 'build.xml');

	if (!(this.buildFile && this.buildFile.file)) {
		throw 'Can not find build file in "' + this.buildFile.getAbsolutePath() + '"';
	}

	this.homeDir = this.buildFile.getParentFile();
	this.configs = options.configs;
	this.depends = options.depends;
	this.name = name;
	this.project = project.createSubProject();
}

Module.prototype.init = function () {
	this.project.setBaseDir(this.homeDir);
	this.project.setProperty('HOMEDIR', this.homeDir.getAbsolutePath());
	this.project.setProperty('TOOLDIR', project.getProperty('tools.dir'));
	this.project.setProperty('LIBDIR', project.getProperty('libs.dir'));

	ProjectHelper.configureProject(this.project, this.buildFile);

	var elements = project.getBuildListeners().elements();

	while (elements.hasMoreElements()) {
		this.project.addBuildListener(elements.nextElement());
	}

	var defaultTargetName = this.project.getDefaultTarget();
	if (defaultTargetName != null) {
		this.defaultTarget = this.project.getTargets().get(defaultTargetName);
	}

	this.globalTarget = this.project.getTargets().get('');
	this.globalTarget.execute();
};

Module.prototype.run = function (configFilePath) {
	if (!(typeof configFilePath == 'string' && configFilePath.length)) {
		throw 'Path to the configuration file for the module ' + this.name + ' is not defined';
	}

	var configFile = new File(project.getProperty('CONFIG.DIR'), configFilePath);

	if (!(configFile && configFile.file)) {
		throw 'Can not find the configuration file in "' + configFilePath + '" for the module "' + this.name + '"';
	}

	var buffer = new BufferedReader(new FileReader(configFile)),
		text = '',
		line;

	while (line = buffer.readLine()) {
		text += line;
	}

	this.project.setProperty('CONFIG.TEXT', text);
	this.project.setProperty('CONFIG.PATH', configFile.getAbsolutePath());

	this.project.setBaseDir(configFile.getParentFile());
	this.defaultTarget && this.defaultTarget.execute();
};

var MODULES = {};
project.addReference('MODULES', MODULES);

for (var name in CONFIG) {
	if (CONFIG.hasOwnProperty(name)) {
		if (MODULES.hasOwnProperty(name)) {
			throw 'The module "' + name + '" already exist';
		}

		var module = MODULES[name] = new Module(name, CONFIG[name]);

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
	}
}