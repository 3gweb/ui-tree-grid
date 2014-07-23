angular.module('uiTreeGrid').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('grid-row.html',
    "<div class=border><div class=row><div ng-if=isVisibleIcon() class=col-xs-1 ng-include=iconTemplate></div><div class=col-xs-3 ng-repeat=\"column in columns\">{{row[column.id]}}</div></div><div ng-if=row.child class=child><div ng-include=\"'grid-row.html'\" ng-repeat=\"row in row.child | orderBy:predicate:reverse | filter:searchText\"></div></div></div>"
  );


  $templateCache.put('grid.html',
    "<div><div class=row><div ng-repeat=\"column in columns\" class=col-xs-4 ng-click=\"sort(column.id, reverse);\">{{column.label}} <span ng-class=\"{true: 'fa fa-sort-asc', false: 'fa fa-sort-desc'}[reverse]\" ng-if=\"column.id == predicate\"></span></div></div><div class=border><div ng-include=\"'grid-row.html'\" ng-repeat=\"row in data | orderBy:predicate:reverse | filter:searchText\"></div></div></div>"
  );

}]);
