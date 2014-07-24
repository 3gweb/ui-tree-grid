'use strict';

/* global _ */
angular.module('uiTreeGrid').directive('uiGrid', function (uiGridConfig, $filter) {

	var options = {};

	function defineColumnsIfNotExists(scope) {

		if (!_.isUndefined(scope.columns)) {
			return false;
		}

		scope.columns = [];

		console.log(scope.data);
		Object.keys(scope.data[0]).forEach(function (item) {
			scope.columns.push({
				id: item,
				label: item.camelCaseToNormalText()
			});
		});
	}

	function filter(arr, $filter, searchText) {
		var newArr = angular.copy(arr);
		(newArr || []).forEach(function (item) {
			item.children = filter(item.children, $filter, searchText);
		});

		return $filter('filter')(newArr, searchText);
	}

	function sort(arr, $filter, predicate, reverse) {
		var newArr = angular.copy(arr);
		(newArr || []).forEach(function (item) {
			item.children = sort(item.children, $filter, predicate, reverse);
		});

		return $filter('orderBy')(newArr, predicate, reverse);
	}

	function generate(arr, lvl, arrOut) {
		arrOut = arrOut || [];
		var newArr = angular.copy(arr);

		(newArr|| []).forEach(function (row) {
			row.lvl = lvl;
			arrOut.push(row);
			generate(row.children, lvl + 1, arrOut);
			delete row.children;
		});

		return arrOut;
	}

	if (uiGridConfig) {
		angular.extend(options, uiGridConfig);
	}

	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'grid.html',
		scope: {
			searchText: '=',
			iconTemplate: '@',
			selectRow: '&',
			data: '='
		},
		link: function ($scope, $elm, attrs) {
			$scope.treeData = [];
			$scope.columns = $scope.$eval(attrs.columns);

			$scope.predicate = 'name';
			$scope.reverse = false;

			$scope.data.$promise.then(function (data) {
				defineColumnsIfNotExists($scope);
				$scope.treeData = generate(sort(data, $filter, $scope.predicate, $scope.reverse), 1);
			});

			$scope.sort = function (predicate, reverse) {
				$scope.predicate = predicate;
				$scope.reverse = !reverse;

				$scope.treeData = generate(sort($scope.data, $filter, $scope.predicate, $scope.reverse), 1);
			};

			$scope.isVisibleIcon = function () {
				return !_.isUndefined($scope.iconTemplate);
			};

			$scope.clickRow = function (row, index) {
				$scope.selectRow()(row, index);
			};

			$scope.$watch('searchText', function (value) {
				$scope.treeData = [];

				var filtro = filter($scope.data, $filter, value);

				var filtroSort = sort(filtro, $filter, $scope.predicate, $scope.reverse);

				$scope.treeData = generate(filtroSort, 1);
			});
		}
	};
});