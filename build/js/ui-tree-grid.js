/***********************************************
* ui-tree-grid JavaScript Library
* Authors: https://github.com/guilhermegregio/ui-tree-grid/blob/master/README.md 
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
* Compiled At: 07/24/2014 11:04
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
  /* global _ */
  angular.module('uiTreeGrid').directive('uiGrid', [
    'uiGridConfig',
    function (uiGridConfig) {
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
          selectRow: '&'
        },
        link: function ($scope, $elm, attrs) {
          $scope.data = $scope.$eval(attrs.data);
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
    }
  ]);
  angular.module('uiTreeGrid').run([
    '$templateCache',
    function ($templateCache) {
      'use strict';
      $templateCache.put('grid-row.html', '<div class=tg-include-content><div class=row ng-click="clickRow(row, $index);"><div ng-if=isVisibleIcon() class="column col-xs-1" ng-include=iconTemplate><button class="btn btn-icon"><i class="fa fa-caret-down"></i></button></div><div class="column col-xs-4" ng-repeat="column in columns">{{row[column.id]}}</div></div><div class=tg ng-if=row.child><div class=tg-include-child ng-include="\'grid-row.html\'" ng-repeat="row in row.child | orderBy:predicate:reverse | filter:searchText"></div></div></div>');
      $templateCache.put('grid.html', '<div class="ui-tree-grid bordered"><div class="tg-header row"><div ng-repeat="column in columns" class="column col-xs-4" ng-click="sort(column.id, reverse);">{{column.label}} <span ng-class="{true: \'fa fa-sort-asc\', false: \'fa fa-sort-desc\'}[reverse]" ng-if="column.id == predicate"></span></div></div><div class=tg><div class=tg-include ng-include="\'grid-row.html\'" ng-repeat="row in data | orderBy:predicate:reverse | filter:searchText"></div></div></div>');
    }
  ]);
}(window));