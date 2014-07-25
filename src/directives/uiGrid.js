'use strict';

angular.module('uiTreeGrid').directive('uiGrid', function (uiGridConfig, Util) {

	var options = {};

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
			data: '=',
			columns: '='
		},
		link: function ($scope, $elm) {
			$scope.treeData = [];

			$scope.predicate = 'name';
			$scope.reverse = false;

			$scope.data.$promise.then(function (data) {
				Util.defineColumnsIfNotExists($scope);
				$scope.treeData = Util.generate(Util.sort(data, $scope.predicate, $scope.reverse), 1);
			});

			$scope.sort = function (predicate, reverse) {
				$scope.predicate = predicate;
				$scope.reverse = !reverse;

				$scope.treeData = Util.generate(Util.sort($scope.data, $scope.predicate, $scope.reverse), 1);
			};

			$scope.isVisibleIcon = function () {
				return !Util.isUndefined($scope.iconTemplate);
			};

			$scope.clickRow = function (row, index) {
				$scope.selectRow()(row, index);
			};

			$scope.$watch('searchText', function (value) {
				$scope.treeData = [];

				var filtro = Util.filter($scope.data, value);

				var filtroSort = Util.sort(filtro, $scope.predicate, $scope.reverse);

				$scope.treeData = Util.generate(filtroSort, 1);
			});

			angular.element($elm.find('div')[1]).bind('scroll', function () {
				$elm.find('div')[0].style.left = (this.scrollLeft * -1) + 'px';
			});
		}
	};
});