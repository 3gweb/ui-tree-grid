'use strict';

/* global _*/
angular.module('uiTreeGrid').directive('uiGrid', function (uiGridConfig, Util) {

	var options = {};

	if (uiGridConfig) {
		angular.extend(options, uiGridConfig);
	}

	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'grid.html',
		scope: true,
		link: function ($scope, $elm, attrs) {

			$scope.columns = $scope.$eval(attrs.columns);
			$scope.data = $scope.$eval(attrs.data);
			$scope.searchText = $scope.$eval(attrs.searchText);
			$scope.selectRow = $scope.$eval(attrs.selectRow);
			$scope.controller = $scope.$eval(attrs.controller);
			$scope.childrenNode = attrs.childrenNode || 'children';
			$scope.fixedHeader = attrs.fixedHeader;
			$scope.iconTemplate = attrs.iconTemplate;
			$scope.treeData = [];
			$scope.predicate = '';
			$scope.reverse = false;

			if ($scope.fixedHeader) {
				angular.element($elm).bind('scroll', function (event) {
					this.querySelector('.tg-header').style.top = event.target.scrollTop + 'px';
					$scope.$apply();
				});
			}

			if (Util.isEmpty($scope.data.$promise)) {
				$scope.data.$promise = {
					then: function (fn) {
						fn($scope.data);
					}
				};
			}

			if (Util.isEmpty($scope.columns)) {
				$scope.data.$promise.then(function (data) {
					$scope.columns = Util.generateColumnsByData(data, $scope.childrenNode);
				});
			}

			$scope.data.$promise.then(function (data) {
				$scope.treeData = Util.generate(Util.sort(data, $scope.predicate, $scope.reverse), 1);
			});

			$scope.sort = function (predicate, reverse) {
				$scope.predicate = predicate;
				$scope.reverse = !reverse;

				$scope.treeData = Util.generate(Util.sort($scope.data, $scope.predicate, $scope.reverse), 1);
			};

			$scope.isVisibleIcon = function (index) {
				if (index > 0) {
					return false;
				}
				return !Util.isUndefined($scope.iconTemplate);
			};

			$scope.clickRow = function (row, index) {
				if (Util.isEmpty($scope.selectRow)) {
					return false;
				}
				$scope.selectRow(row, index);
			};

			$scope.$watch('searchText', function (value) {
				$scope.treeData = [];

				var filtro = Util.filter($scope.data, value);

				var filtroSort = Util.sort(filtro, $scope.predicate, $scope.reverse);

				$scope.treeData = Util.generate(filtroSort, 1);
			});

			$scope.$watch('data', function (value, oldValue) {
				var changes = _.difference(_.pluck(value, 'id'), _.pluck(oldValue, 'id'));

				changes.forEach(function(id){
					_.find(value, {id: id}).change = true;
				});

				$scope.treeData = [];
				$scope.treeData = Util.generate(value);
			}, true);

			$elm.find('div').eq(1).bind('scroll', function () {
				$elm.find('div').eq(0).css('left', (this.scrollLeft * -1) + 'px');
			});

			attrs.$observe('iconTemplate', function (value) {
				$scope.iconTemplate = value;
			});
		}
	};
}).directive('uiCell', function (Util, $filter) {
	var link = function ($scope) {
		var column = $scope.column;
		var row = $scope.row;

		var value = Util.deepFind(row, column.id);

		switch (column.format) {
			case 'date':
				value = $filter('date')(value);
				break;
			case 'currency':
				value = $filter('currency')(value);
				break;
			case 'file':
				value = $filter('convertFile')(value);
				break;
		}

		$scope.value = value;

	};

	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'cell.html',
		transclude: true,
		scope: {
			column: '=',
			row: '='
		},
		link: link
	};
}).filter('convertFile', function ($sce) {
	return function (fileId) {
		return $sce.trustAsHtml('<a href="/service/download/:id" target="_blank" class="btn btn-primary btn-icon"><i class="fa fa-cloud-download"></i></a>'.replace(':id', fileId));
	};
});