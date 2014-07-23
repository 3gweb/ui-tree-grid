'use strict';
/* global _ */
String.prototype.camelCaseToNormalText = function () {
  return this.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
    return str.toUpperCase();
  });
};
angular.module('uiTreeGrid', []);
angular.module('uiTreeGrid').value('uiGridConfig', {});
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
        iconTemplate: '@'
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
      }
    };
  }
]);
;
angular.module('uiTreeGrid').run([
  '$templateCache',
  function ($templateCache) {
    'use strict';
    $templateCache.put('grid-row.html', '<div class="border">\n' + '    <div class="row">\n' + '        <div ng-if="isVisibleIcon()" class="col-xs-1" ng-include="iconTemplate"></div>\n' + '        <div class="col-xs-3" ng-repeat="column in columns">\n' + '            {{row[column.id]}}\n' + '        </div>\n' + '    </div>\n' + '\n' + '    <div ng-if="row.child" class="child">\n' + '        <div ng-include="\'grid-row.html\'" ng-repeat="row in row.child | orderBy:predicate:reverse | filter:searchText"></div>\n' + '    </div>\n' + '</div>');
    $templateCache.put('grid.html', '<div>\n' + '    <div class="row">\n' + '        <div ng-repeat="column in columns" class="col-xs-4" ng-click="sort(column.id, reverse);">\n' + '            {{column.label}}\n' + '            <span  ng-class="{true: \'fa fa-sort-asc\', false: \'fa fa-sort-desc\'}[reverse]" ng-if="column.id == predicate"></span>\n' + '        </div>\n' + '    </div>\n' + '\n' + '    <div class="border">\n' + '        <div ng-include="\'grid-row.html\'" ng-repeat="row in data | orderBy:predicate:reverse | filter:searchText"></div>\n' + '    </div>\n' + '</div>');
  }
]);