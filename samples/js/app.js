(function (angular) {
	'use strict';
	var app = angular.module('app', ['uiTreeGrid']);

	app.controller('SampleCtrl', function ($scope) {
		$scope.search = '';

		$scope.selectRow = function (att, index) {
			console.log(index, 'select row', att);
		};
	});
})(angular);