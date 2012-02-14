/*
 * Copyright (c) Site builder.
 * Source: https://github.com/B-Vladi/Site-builder
 * Author: Vlad Kurkin, b-vladi@cs-console.ru.
 */

project.addReference('EXPORT', {
	runTarget: function (project, name, properties) {
		for (var propertyName in properties) {
			if (properties.hasOwnProperty(propertyName)) {
				project.setProperty(propertyName, properties[propertyName]);
			}
		}

		project.getTargets().get(name).execute();
	}
});