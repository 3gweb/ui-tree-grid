angular.module('uiTreeGrid').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('grid-row.html',
    "<div class=tg-include-content><div class=row ng-click=\"clickRow(row, $index);\"><div ng-if=isVisibleIcon() class=\"column col-xs-1\" ng-include=iconTemplate><button class=\"btn btn-icon\"><i class=\"fa fa-caret-down\"></i></button></div><div class=\"column col-xs-4\" ng-repeat=\"column in columns\">{{row[column.id]}}</div></div><div class=tg ng-if=row.child><div class=tg-include-child ng-include=\"'grid-row.html'\" ng-repeat=\"row in row.child | orderBy:predicate:reverse | filter:searchText\"></div></div></div>"
  );


  $templateCache.put('grid.html',
    "<div class=\"ui-tree-grid bordered\"><div class=\"tg-header row\"><div ng-repeat=\"column in columns\" class=\"column col-xs-4\" ng-click=\"sort(column.id, reverse);\">{{column.label}} <span ng-class=\"{true: 'fa fa-sort-asc', false: 'fa fa-sort-desc'}[reverse]\" ng-if=\"column.id == predicate\"></span></div></div><div class=tg><div class=tg-include ng-include=\"'grid-row.html'\" ng-repeat=\"row in data | orderBy:predicate:reverse | filter:searchText\"></div></div></div>"
  );

}]);
