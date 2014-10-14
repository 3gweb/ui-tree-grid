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

	app.controller('ExpensesCtrl', function ($scope, $resource) {

		var Repository = $resource('js/expenses.json', {});
		$scope.data = Repository.query();

		$scope.columns = [
			{label: "Data", id: "date"},
			{label: "Tree", id: "tree", format: 'tree', size: 7},
			{label: "Valor", id: "value"},
			{label: "Tipo", id: "type.name"},
			{label: "Banco", id: "bankAccount.bank.name"},
			{label: "Agência", id: "bankAccount.agency"},
			{label: "Conta", id: "bankAccount.currentAccount"}
		];

		$scope.search = '';

		$scope.selectRow = function (att, index) {
			$scope.selected = att;
		};
	});
})(angular);