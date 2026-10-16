(function () {
  var form = document.querySelector('.contact-form');
  if (!form) return;
  var subject = form.querySelector('input[name="_subject"]');
  var subjects = {
    'Free 30-day missed-call trial': 'Trial request from oahuwebco.com',
    'Free review': 'Free review request from oahuwebco.com'
  };

  function sync() {
    var picked = form.querySelector('input[name="offer"]:checked');
    if (picked && subject && subjects[picked.value]) subject.value = subjects[picked.value];
  }

  function fromHash() {
    var target = { '#free-review': 'Free review', '#free-trial': 'Free 30-day missed-call trial' }[location.hash];
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
