'use strict';

angular.module('uiTreeGrid').service('Util', function ($filter) {

	var Util = this;

	this.isUndefined = function (value) {
		return typeof value === 'undefined';
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

	this.defineColumnsIfNotExists = function (scope) {

		if (!Util.isUndefined(scope.columns)) {
			return false;
		}

		scope.columns = [];

		Object.keys(scope.data[0]).forEach(function (item) {
			scope.columns.push({
				id: item,
				label: item.camelCaseToNormalText()
			});
		});
	};
});