/***********************************************
* ui-tree-grid JavaScript Library
* Authors: https://github.com/guilhermegregio/ui-tree-grid/blob/master/README.md 
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
* Compiled At: 07/28/2014 18:17
***********************************************/
(function (window) {
  'use strict';
  String.prototype.camelCaseToNormalText = function () {
    return this.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
      return str.toUpperCase();
    });
  };
  angular.module('uiTreeGrid', []);
  angular.module('uiTreeGrid').value('uiGridConfig', {});
  'use strict';
  angular.module('uiTreeGrid').directive('uiGrid', [
    'uiGridConfig',
    'Util',
    function (uiGridConfig, Util) {
      var options = {};
      if (uiGridConfig) {
        angular.extend(options, uiGridConfig);
      }
      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'grid.html',
        link: function ($scope, $elm, attrs) {
          $scope.columns = $scope.$eval(attrs.columns);
          $scope.data = $scope.$eval(attrs.data);
          $scope.searchText = $scope.$eval(attrs.searchText);
          $scope.selectRow = $scope.$eval(attrs.selectRow);
          $scope.childrenNode = attrs.childrenNode || 'children';
          $scope.treeData = [];
          $scope.predicate = '';
          $scope.reverse = false;
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
          $scope.isVisibleIcon = function () {
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
          angular.element($elm.find('div')[1]).bind('scroll', function () {
            $elm.find('div')[0].style.left = this.scrollLeft * -1 + 'px';
          });
        }
      };
    }
  ]);
  'use strict';
  angular.module('uiTreeGrid').service('Util', [
    '$filter',
    function ($filter) {
      this.isUndefined = function (value) {
        return typeof value === 'undefined';
      };
      this.isEmpty = function (value) {
        return typeof value === 'undefined' || value === null || value === '';
      };
      this.generate = function generate(arr, lvl, arrOut) {
        arrOut = arrOut || [];
        var newArr = angular.copy(arr);
        (newArr || []).forEach(function (row) {
          row.lvl = lvl;
          arrOut.push(row);
          generate(row.children, lvl + 1, arrOut);
          delete row.children;
        });
        return arrOut;
      };
      this.filter = function filter(arr, searchText) {
        var newArr = angular.copy(arr);
        (newArr || []).forEach(function (item) {
          item.children = filter(item.children, searchText);
        });
        return $filter('filter')(newArr, searchText);
      };
      this.sort = function sort(arr, predicate, reverse) {
        var newArr = angular.copy(arr);
        (newArr || []).forEach(function (item) {
          item.children = sort(item.children, predicate, reverse);
        });
        return $filter('orderBy')(newArr, predicate, reverse);
      };
      this.generateColumnsByData = function (data, childrenNode) {
        var nodes = [];
        Object.keys(data[0]).forEach(function (node) {
          if (node === childrenNode) {
            return false;
          }
          nodes.push({
            id: node,
            label: node.camelCaseToNormalText()
          });
        });
        return nodes;
      };
    }
  ]);
  angular.module('uiTreeGrid').run([
    '$templateCache',
    function ($templateCache) {
      'use strict';
      $templateCache.put('grid.html', '<div class="ui-tree-grid bordered"><div class="tg-header row"><div class="column size-{{column.size||3}}" ng-repeat="column in columns" ng-click="sort(column.id, reverse);">{{column.label}} <span ng-class="{true: \'fa fa-sort-asc\', false: \'fa fa-sort-desc\'}[reverse]" ng-if="column.id == predicate"></span></div></div><div class=tg><div ng-repeat="row in treeData" class=row><div class="column lvl-{{row.lvl}} size-{{column.size||3}}" ng-repeat="column in columns" ng-click="clickRow(row, $index);">{{row[column.id]}}</div></div></div></div>');
    }
  ]);
}(window));