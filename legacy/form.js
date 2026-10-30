(function () {
  var form = document.querySelector('.contact-form');
  if (!form) return;
  var subject = form.querySelector('input[name="_subject"]');
  var subjects = {
    'Missed calls': 'Missed-call trial request from oahuwebco.com',
    'Get found': 'Free review request from oahuwebco.com',
    'Website': 'Website request from oahuwebco.com',
    'Reviews and repeat customers': 'Repeat business request from oahuwebco.com',
    'Not sure': 'New request from oahuwebco.com'
  };

  function sync() {
    var picked = form.querySelector('input[name="offer"]:checked');
    if (picked && subject && subjects[picked.value]) subject.value = subjects[picked.value];
  }

  function fromHash() {
    var target = {
      '#free-trial': 'Missed calls',
      '#free-review': 'Get found',
      '#website': 'Website',
      '#repeat-business': 'Reviews and repeat customers'
    }[location.hash];
    if (!target) return;
    var input = form.querySelector('input[name="offer"][value="' + target + '"]');
    if (input) input.checked = true;
    sync();
  }

  form.addEventListener('change', sync);
  window.addEventListener('hashchange', fromHash);
  fromHash();
  sync();
})();
