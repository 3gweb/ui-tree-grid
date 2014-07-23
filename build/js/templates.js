angular.module('uiTreeGrid').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('grid-row.html',
    "<div class=\"border\">\n" +
    "    <div class=\"row\">\n" +
    "        <div ng-if=\"isVisibleIcon()\" class=\"col-xs-1\" ng-include=\"iconTemplate\"></div>\n" +
    "        <div class=\"col-xs-3\" ng-repeat=\"column in columns\">\n" +
    "            {{row[column.id]}}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"row.child\" class=\"child\">\n" +
    "        <div ng-include=\"'grid-row.html'\" ng-repeat=\"row in row.child | orderBy:predicate:reverse | filter:searchText\"></div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('grid.html',
    "<div>\n" +
    "    <div class=\"row\">\n" +
    "        <div ng-repeat=\"column in columns\" class=\"col-xs-4\" ng-click=\"sort(column.id, reverse);\">\n" +
    "            {{column.label}}\n" +
    "            <span  ng-class=\"{true: 'fa fa-sort-asc', false: 'fa fa-sort-desc'}[reverse]\" ng-if=\"column.id == predicate\"></span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"border\">\n" +
    "        <div ng-include=\"'grid-row.html'\" ng-repeat=\"row in data | orderBy:predicate:reverse | filter:searchText\"></div>\n" +
    "    </div>\n" +
    "</div>"
  );

}]);
