/***********************************************
* ui-tree-grid JavaScript Library
* Authors: https://github.com/guilhermegregio/ui-tree-grid/blob/master/README.md 
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
* Compiled At: 09/01/2014 10:20
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
  /* global _*/
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
            if (changes.length > 0) {
              value.forEach(function (item) {
                item.change = false;
              });
              changes.forEach(function (id) {
                _.find(value, { id: id }).change = true;
              });
            }
            $scope.treeData = [];
            $scope.treeData = Util.generate(value);
          }, true);
          $elm.find('div').eq(1).bind('scroll', function () {
            $elm.find('div').eq(0).css('left', this.scrollLeft * -1 + 'px');
          });
          attrs.$observe('iconTemplate', function (value) {
            $scope.iconTemplate = value;
          });
        }
      };
    }
  ]).directive('uiCell', [
    'Util',
    '$filter',
    function (Util, $filter) {
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
    }
  ]).filter('convertFile', [
    '$sce',
    function ($sce) {
      return function (fileId) {
        return $sce.trustAsHtml('<a href="/service/download/:id" target="_blank" class="btn btn-primary btn-icon"><i class="fa fa-cloud-download"></i></a>'.replace(':id', fileId));
      };
    }
  ]);
  'use strict';
  /*global toString*/
  angular.module('uiTreeGrid').service('Util', [
    '$filter',
    function ($filter) {
      var self = this;
      this.isUndefined = function (value) {
        return typeof value === 'undefined';
      };
      this.isEmpty = function (value) {
        return typeof value === 'undefined' || value === null || value === '';
      };
      [
        'Arguments',
        'Function',
        'String',
        'Number',
        'Date',
        'RegExp',
        'Object'
      ].forEach(function (name) {
        self['is' + name] = function (obj) {
          return toString.call(obj) === '[object ' + name + ']';
        };
      });
      this.generate = function generate(arr, lvl, arrOut) {
        arrOut = arrOut || [];
        lvl = lvl || 1;
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
      this.deepFind = function (obj, path) {
        var result;
        try {
          result = this.deep(obj, path);
        } catch (err) {
        }
        return result;
      };
      this.deep = function (obj, key, value) {
        var keys = key.replace(/\[(["']?)([^\1]+?)\1?\]/g, '.$2').replace(/^\./, '').split('.'), root, i = 0, n = keys.length;
        if (arguments.length > 2) {
          // Set deep value
          root = obj;
          n--;
          while (i < n) {
            key = keys[i++];
            obj = obj[key] = this.isObject(obj[key]) ? obj[key] : {};
          }
          obj[keys[i]] = value;
          value = root;
        } else {
          // Get deep value
          var exec = true;
          while (exec && i < n) {
            exec = (obj = obj[keys[i++]]) !== null;
          }
          value = i < n ? void 0 : obj;
        }
        return value;
      };
    }
  ]);
  angular.module('uiTreeGrid').run([
    '$templateCache',
    function ($templateCache) {
      'use strict';
      $templateCache.put('cell.html', '<div><span ng-transclude></span> <span ng-bind=value ng-if="column.format !== \'file\'"></span> <span ng-bind-html=value ng-if="column.format === \'file\'"></span></div>');
      $templateCache.put('grid.html', '<div class="ui-tree-grid bordered"><div class=tg-content-table><div class="tg-header tg-row"><div class="tg-column tg-size-{{column.size||3}}" ng-repeat="column in columns" ng-click="sort(column.id, reverse);">{{column.label}} <span ng-class="{true: \'fa fa-sort-asc\', false: \'fa fa-sort-desc\'}[reverse]" ng-if="column.id == predicate"></span></div></div><div class=tg-body><div ng-repeat="row in treeData" class=tg-row ng-class="{true: \'tg-animate-included\'}[row.change]"><a id={{row.id}}></a><div ui-cell="" column=column row=row class="tg-column tg-lvl-{{row.lvl}} tg-size-{{column.size||3}}" ng-repeat="column in columns" ng-click="clickRow(row, $index);"><span ng-if=isVisibleIcon($index) class=icon-template ng-include=iconTemplate></span></div></div></div></div></div>');
    }
  ]);
}(window));