String.prototype.camelCaseToNormalText = function () {
    return this.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
        return str.toUpperCase();
    });
};

angular.module('uiGrid', []);

angular.module('uiGrid').value('uiGridConfig', {});

angular.module('uiGrid').directive('uiGrid', function (uiGridConfig) {

    var options = {};

    function defineColumnsIfNotExists (scope) {

        if(!_.isUndefined(scope.columns)){
            return false;
        }

        scope.columns = []
        Object.keys(scope.data[0]).forEach(function(item){
            scope.columns.push({
                id: item,
                label: item.camelCaseToNormalText()
            });
        })
    }

    if (uiGridConfig) {
        angular.extend(options, uiGridConfig);
    }

    return {
        restrict: 'A',
        replace: true,
        templateUrl: '../src/templates/grid.html',
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

});