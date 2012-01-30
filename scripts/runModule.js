/*
 * Copyright (c) Site-builder, 30.1.2012.
 * Source: https://github.com/B-Vladi/Site-builder
 * Author: Vlad Kurkin, b-vladi@cs-console.ru.
 */

var input = project.createTask('input');
input.setMessage('Enter module name');
input.setAddproperty('moduleName');
input.execute();

var moduleName = project.getProperty('moduleName');
if (moduleName != null && moduleName.length) {
	if (MODULES.hasOwnProperty(moduleName)) {
		project.executeTarget('build');
	} else {
		throw 'The module "' + moduleName + '" is not defined';
	}
} else {
	throw 'Module name is not defined';
}