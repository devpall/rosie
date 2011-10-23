Factory = require('../../src/rosie')

describe('Factory', function() {
  afterEach(function() {
    Factory.factories = {};
  });

  describe('build', function() {
    describe('with a constructor', function() {
      var Thing = function(attrs) {
        for(var attr in attrs) {
          this[attr] = attrs[attr];
        }
      };

      beforeEach(function() {
        Factory.define('thing', Thing).attr('name', 'Thing 1');
      });

      it('should return a new instance of that constructor', function() {
        expect(Factory.build('thing') instanceof Thing).toBe(true);
        expect(Factory.build('thing').constructor).toBe(Thing);
      });

      it('should set attributes', function() {
        expect(Factory.build('thing')).toEqual({name: 'Thing 1'});
      });
    });

    describe('without a constructor', function() {
      beforeEach(function() {
        Factory.define('thing').attr('name', 'Thing 1');
      });

      it('should return object with attributes set', function() {
        expect(Factory.build('thing')).toEqual({name:'Thing 1'});
      });

      it('should allow overriding attributes', function() {
        expect(Factory.build('thing', {name:'changed'})).toEqual({name:'changed'});
      });
    });
  });

  describe('attributes', function() {
    beforeEach(function() {
      Factory.define('thing').attr('name', 'Thing 1');
    });

    it('should return object with attributes set', function() {
      expect(Factory.attributes('thing')).toEqual({name:'Thing 1'});
    });

    it('should allow overriding attributes', function() {
      expect(Factory.attributes('thing', {name:'changed'})).toEqual({name:'changed'});
    });
  });

  describe('prototype', function() {
    var factory;

    beforeEach(function() {
      factory = new Factory();
    });

    describe('attr', function() {
      it('should add given value to attributes', function() {
        factory.attr('foo', 'bar');
        expect(factory.attributes().foo).toEqual('bar');
      });

      it('should invoke function', function() {
        var calls = 0;
        factory.attr('dynamic', function() { return ++calls; });
        expect(factory.attributes().dynamic).toEqual(1);
        expect(factory.attributes().dynamic).toEqual(2);
      });

      it('should return the factory', function() {
        expect(factory.attr('foo', 1)).toBe(factory);
      });
    });

    describe('sequence', function() {
      it('should return the factory', function() {
        expect(factory.sequence('id')).toBe(factory);
      });

      it('should return an incremented value for each invocation', function() {
        factory.sequence('id');
        expect(factory.attributes().id).toEqual(1);
        expect(factory.attributes().id).toEqual(2);
        expect(factory.attributes().id).toEqual(3);
      });

      it('should increment different sequences independently', function() {
        factory.sequence('id');
        factory.sequence('count');

        expect(factory.attributes()).toEqual({id: 1, count: 1});
        expect(factory.attributes()).toEqual({id: 2, count: 2});
      });

      it('should use custom function', function() {
        factory.sequence('name', function(i) { return 'user' + i; });
        expect(factory.attributes().name).toEqual('user1');
      });
    });

    describe('attributes', function() {
      beforeEach(function() {
        factory.attr('foo', 1).attr('bar', 2);
      });

      it('should allow overriding an attribute', function() {
        expect(factory.attributes({bar:3})).toEqual({foo:1, bar:3});
      });

      it('should allow overriding an attribute with a falsy value', function() {
        expect(factory.attributes({bar:false})).toEqual({foo:1, bar:false});
      });

      it('should allow adding new attributes', function() {
        expect(factory.attributes({baz:3})).toEqual({foo:1, bar:2, baz:3});
      });
    });
  });
});
