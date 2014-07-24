'use strict';

/* global _ */
angular.module('uiTreeGrid').directive('uiGrid', function (uiGridConfig) {

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

			$scope.columns = $scope.$eval(attrs.columns);

			defineColumnsIfNotExists($scope);

			$scope.predicate = 'name';
			$scope.reverse = true;

			$scope.sort = function (predicate, reverse) {
				$scope.predicate = predicate;
				$scope.reverse = !reverse;
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