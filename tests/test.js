describe('Check caniuse tag', function() {
    var t = document.createElement('get-caniuse');
    t.innerHTML = 'clip-path';
    document.body.appendChild(t);
    CIU.init();
    it('Should contain a caniuse icon', function() {
        expect(t.querySelector('img').src).toBe('http://caniuse.com/img/favicon-128.png');
    });
});