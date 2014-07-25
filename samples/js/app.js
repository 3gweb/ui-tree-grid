(function (angular) {
	'use strict';
	var app = angular.module('app', ['uiTreeGrid', 'ngResource']);

	app.controller('SampleCtrl', function ($scope, $resource, $filter) {

		var Repository = $resource('js/table.json', {});
		$scope.data = Repository.query();

		$scope.columns = [
			{id: 'name', label: 'Nome'},
			{id: 'idade', label: 'Idade'},
			{id: 'cargo', label: 'Cargo'},
			{id: 'email', label: 'E-mail'}
		];

		$scope.search = '';

		$scope.selectRow = function (att, index) {
			console.log(index, 'select row', att);
		};
	});
})(angular);