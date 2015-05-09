'use strict';

describe('Service: <%= cameledName %>', function () {

    // load the service's module
    beforeEach(module('<%= scriptAppName %>'));

    // instantiate service
    var <%= cameledName %>;
    beforeEach(inject(function (_<%= cameledName %>Service_) {
        <%= cameledName %> = _<%= cameledName %>Service_;
    }));

    it('should do something', function () {
        expect(!!<%= cameledName %>).toBe(true);
    });

});
