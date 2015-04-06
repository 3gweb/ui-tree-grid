'use strict';

/* global _, moment*/
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

				$scope.data.$promise.then(function (data) {
					$scope.treeData = Util.generate(Util.sort(data, $scope.predicate, $scope.reverse), 1);
				});
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

				if (changes.length > 0) {
					value.forEach(function (item) {
						item.change = false;
					});

					changes.forEach(function (id) {
						_.find(value, {id: id}).change = true;
					});
				}

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
		var match;

		$scope.hasHtml = false;

		var value = Util.deepFind(row, column.id);

		var format = '';

		if (_.has(column.format)) {
			format = column.format;
		}

		switch (format) {
			case 'currency':
				value = $filter('currency')(value);
				break;
			case 'file':
				$scope.hasHtml = true;
				value = $filter('convertFile')(value);
				break;
			case 'fileType':
				value = $filter('fileType')(value);
				break;
			case 'tree':
				$scope.hasHtml = true;
				value = $filter('convertTree')(value);
				break;
			case String(format.match(/unixTimestamp.*/)):
				match = format.match(/(unixTimestamp)\((.*)\)/);

				value = $filter(match[1])(value, match[2]);
				break;
			case String(format.match(/usFullTimestamp.*/)):
				match = format.match(/(usFullTimestamp)\((.*)\)/);

				value = $filter(match[1])(value, match[2]);
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
}).filter('usFullTimestamp', function () {
	return function (timestamp, format) {
		return moment(timestamp, 'YYYYMMDDHHmmssSSS').format(format);
	};
}).filter('unixTimestamp', function () {
	return function (timestamp, format) {
		return moment(timestamp, 'x').format(format);
	};
}).filter('convertTree', function ($sce) {
	return function (tree) {
		var newTree = [],
			resultTree = '';

		function generateTree(tree) {
			newTree.unshift('<li class="tg-tree-list-item">' + tree.label + '</li>');
			if (tree.parent) {
				generateTree(tree.parent);
			} else {
				newTree[newTree.length - 1] = newTree[newTree.length - 1].replace('tg-tree-list-item', 'tg-tree-list-item mult-select-tree-last');
			}
		}

		generateTree(tree);
		resultTree = '<ul class="tg-tree-list tg-tree-list__readonly">' + newTree.join('') + '</ul>';

		return $sce.trustAsHtml(resultTree);
	};
}).filter('fileType', function () {
	return function (fileName) {
		var msg = '';
		var extension = fileName.split('.').pop();

		switch (extension) {
			case 'jpg':
			case 'jpeg':
			case 'bmp':
			case 'gif':
			case 'tif':
				msg = 'Imagem';
				break;
			case 'zip':
			case 'rar':
			case '7z':
				msg = 'Compactado';
				break;
			case 'doc':
			case 'docx':
				msg = 'Microsoft Word';
				break;
			case 'xls':
			case 'xlsx':
				msg = 'Microsoft Excel';
				break;
			case 'mp3':
			case 'wav':
			case 'mid':
				msg = 'Audio';
				break;
			case 'avi':
			case '3gp':
			case 'mpeg':
				msg = 'Video';
				break;
			case 'txt':
				msg = 'Texto';
				break;
			case 'pdf':
				msg = 'Adobe Acrobat Reader';
				break;
			case 'ppt':
			case 'pptx':
			case 'pps':
				msg = 'Microsoft Power Point';
				break;
			default:
				msg = 'Outros';
		}

		return msg;
	};
});