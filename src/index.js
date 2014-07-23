'use strict';

String.prototype.camelCaseToNormalText = function () {
	return this.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
		return str.toUpperCase();
	});
};

angular.module('uiTreeGrid', []);

angular.module('uiTreeGrid').value('uiGridConfig', {});