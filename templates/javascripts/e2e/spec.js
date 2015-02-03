'use strict';
describe('e2e test for page: <%= name %>', function() {
    it('should do something', function() {
        browser.get('http://localhost:9000/#<%= name %>');
        expect(1).toEqual(1);
    });
});