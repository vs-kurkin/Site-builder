/*
 Copyright (c) Site-builder, 2012.
 Source: https://github.com/B-Vladi/Site-builder
 Vlad Kurkin, b-vladi@cs-console.ru.
 */

var stack = [], moduleName = project.getProperty('moduleName'), modulesInStack = {}, index = 0, module, depends, length;

if (moduleName == null) {
	for (var name in MODULES) {
		if (MODULES.hasOwnProperty(name)) {
			stack.push(MODULES[name]);
		}
	}
} else if (MODULES.hasOwnProperty(moduleName)) {
	stack.push(MODULES[moduleName]);
} else {
	throw 'The module "' + moduleName + '" is not defined';
}

while (true) {
	module = stack[index];

	if (module) {
		moduleName = module.name;

		if (modulesInStack.hasOwnProperty(moduleName)) {
			stack.splice(index, 1);
		} else {
			depends = module.depends;
			length = depends ? depends.length : 0;

			while (length--) {
				var dependModuleName = depends[length];

				if (MODULES.hasOwnProperty(dependModuleName)) {
					if (!modulesInStack.hasOwnProperty(dependModuleName)) {
						stack.splice(index, 0, MODULES[dependModuleName]);
						modulesInStack[dependModuleName] = true;
						index++;
					}
				} else {
					throw 'Module "' + dependModuleName + '", depending on the module "' + moduleName + '" is not defined';
				}
			}

			modulesInStack[moduleName] = true;
			index++;
		}
	} else {
		break;
	}
}

while (module = stack.shift()) {
	index = 0;
	length = module.configs.length;

	while (index < length) {
		module.run(module.configs[index++]);
	}
}