(function (angular) {
	'use strict';
	var app = angular.module('app', ['uiTreeGrid', 'ngResource']);

	app.controller('SampleCtrl', function ($scope, $resource, $filter) {

		var Repository = $resource('js/table.json', {});
		$scope.data = Repository.query();

		$scope.search = '';

		$scope.selectRow = function (att, index) {
			console.log(index, 'select row', att);
		};
	});
})(angular);