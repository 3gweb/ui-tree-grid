(function (angular) {
	'use strict';
	var app = angular.module('app', ['uiTreeGrid', 'ngResource']);

	app.controller('ComplexCtrl', function ($scope, $resource, $filter) {

		var Repository = $resource('js/table.json', {});
		$scope.data = Repository.query();

		$scope.columns = [
			{id: 'name', label: 'Nome', size: 5},
			{id: 'idade', label: 'Idade', size: 1},
			{id: 'cargo', label: 'Cargo', size: 3},
			{id: 'email', label: 'E-mail', size: 4}
		];

		$scope.search = '';

		$scope.selectRow = function (att, index) {
			$scope.selected = att;
		};
	});
})(angular);