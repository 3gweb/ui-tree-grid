'use strict';
/*global toString*/
angular.module('uiTreeGrid').service('Util', function ($filter) {

	var self = this;
	this.isUndefined = function (value) {
		return typeof value === 'undefined';
	};

	this.isEmpty = function (value) {
		return typeof value === 'undefined' || value === null || value === '';
	};

	['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Object'].forEach(function (name) {
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
		var keys = key.replace(/\[(["']?)([^\1]+?)\1?\]/g, '.$2').replace(/^\./, '').split('.'),
			root,
			i = 0,
			n = keys.length;

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

});