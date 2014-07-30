'use strict';

describe('Service: Util', function () {
	beforeEach(module('uiTreeGrid'));

	var Util;
	beforeEach(inject(function (_Util_) {
		Util = _Util_;
	}));

	it("should return true when argument is undefined, null or empty string", function () {

		expect(Util.isEmpty('')).toBe(true);
		expect(Util.isEmpty(null)).toBe(true);
		expect(Util.isEmpty(undefined)).toBe(true);

	});

	it("should generate simple array with four elements based on tree array", function () {
		var treeArray = [
			{
				nome: 'ITEM-1',
				children: [
					{
						nome: 'ITEM-1-1',
						children: [
							{
								nome: 'ITEM-1-1-1',
								children: [
									{
										nome: 'ITEM-1-1-1-1',
										children: []
									}
								]
							}
						]
					}
				]

			}
		];

		var result = Util.generate(treeArray);
		expect(result.length).toBe(4);
		expect(result[0]).toEqual({nome: 'ITEM-1', lvl: 1});
		expect(result[1]).toEqual({nome: 'ITEM-1-1', lvl: 2});
		expect(result[2]).toEqual({nome: 'ITEM-1-1-1', lvl: 3});
		expect(result[3]).toEqual({nome: 'ITEM-1-1-1-1', lvl: 4});
	});

	it("should get deep property value by string with dot", function () {
		var obj = {
			u: {
				i: {
					t: {
						g: 'uiTreeGrid'
					}
				}
			}
		}

		expect(Util.deepFind(obj, 'u.i.t.g')).toBe('uiTreeGrid');
	});


});