'use strict';

/* global _ */
angular.module('uiTreeGrid').directive('uiGrid', function (uiGridConfig, $filter) {

	var options = {};

	function defineColumnsIfNotExists(scope) {

		if (!_.isUndefined(scope.columns)) {
			return false;
		}

		scope.columns = [];
		Object.keys(scope.data[0]).forEach(function (item) {
			scope.columns.push({
				id: item,
				label: item.camelCaseToNormalText()
			});
		});
	}

	function sort(arr, $filter, predicate, reverse) {
		(arr || []).forEach(function (item) {
			item.children = sort(item.children, $filter, predicate, reverse);
		});

		return $filter('orderBy')(arr, predicate, reverse);
	}

	function generate(arr, newArr, lvl) {
		(arr || []).forEach(function (row) {
			var newRow = angular.copy(row);
			newRow.lvl = lvl;

			newArr.push(newRow);
			generate(newRow.children, newArr, lvl + 1);
			delete newRow.children;
		});
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

			defineColumnsIfNotExists($scope);

			$scope.data.$promise.then(function(data){
				generate(data, $scope.treeData, 1);
			});


			$scope.predicate = 'name';
			$scope.reverse = true;

			$scope.sort = function (predicate, reverse) {
				$scope.predicate = predicate;
				$scope.reverse = !reverse;

				$scope.treeData = [];

				generate(sort($scope.data, $filter, $scope.predicate, $scope.reverse), $scope.treeData, 1);
			};

			$scope.isVisibleIcon = function () {
				return !_.isUndefined($scope.iconTemplate);
			};

			$scope.clickRow = function (row, index) {
				$scope.selectRow()(row, index);
			};
		}
	};

});