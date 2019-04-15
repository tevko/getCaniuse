describe('Check caniuse tag', function() {
  var t = document.createElement('div');
  t.setAttribute("data-caniuse");
  t.innerHTML = 'clip-path';
  document.body.appendChild(t);
  CIU.init();
  it('Should contain a caniuse icon', function() {
    expect(t.querySelector('img').src).toBe('http://caniuse.com/img/favicon-128.png');
  });
  /* it('Should contain a caniuse card when clicked', function() {
    window.CIU.getCIUData.bind(t, t.textContent, window.CIU.settings);
    expect(t.querySelector('div').classList.contains('caniuse-card')).toBe(true);
  }); */
});