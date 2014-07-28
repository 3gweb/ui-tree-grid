'use strict';

angular.module('uiTreeGrid').service('Util', function ($filter) {

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
});