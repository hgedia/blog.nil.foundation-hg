---
---

const
  nameInput = document.querySelector('#name'),
  messageInput = document.querySelector('#message'),
  form = document.getElementById('form'),
  modal = document.getElementById('modal'),
  submitButton = document.querySelector('#sbtBtn'),
  spinner = document.getElementById('spinner-show'),
  normalBtn = document.getElementById('spinner-hidden'),
  inputs = document.querySelectorAll('.form-control'),
  errorMessage = document.getElementById('error-message'),
  successMessage = document.getElementById('success-message');

let processingRequest = false;

const checkInputs = () => {
  [...inputs].some(input => input.value.trim() === '')
    ? submitButton.setAttribute('disabled', '')
    : submitButton.removeAttribute('disabled');
}

checkInputs();
setProcessingRequest(false);

/** Disables button while inputs are empty */
inputs.forEach(node => {
  node.addEventListener('keyup', () => {
    checkInputs();
  })
})

form.addEventListener( "submit", function ( event ) {
  event.preventDefault();
  if ([...inputs].some(input => input.value.trim() === '') || processingRequest) { return; }
  processForm();
} );

/** Onsubmit */
async function processForm () {
  const FD = new FormData(form);
  setProcessingRequest(true);

  let body = '';
  for (const key of FD.keys()) {
    body = body + `${key}=` + encodeURIComponent(FD.get(key)) + '&'
  };
  body = body.slice(0, -1);
  
  const XHR = new XMLHttpRequest();
  XHR.addEventListener( "load", function(event) {
    inputs.forEach(input => input.value = '');
    setProcessingRequest(false);
    showModal('success')
  });
  XHR.addEventListener( "error", function(event) {
    setProcessingRequest(false);
    showModal('error')
  });
  XHR.open("POST", "{{ site.staticman_url }}", true);
  XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  XHR.send(body);
};

/** Corrects window scroll offset after clicking on permalink. */
function correctPermalink () {
  setTimeout(() => {
    (window.innerHeight + window.pageYOffset) < document.body.offsetHeight && window.scrollBy(0, -76);
    console.log('correctPermalink');
  }, 0)
}

/** Shows success message */
function showModal (state) {
  modal.style.display = 'block';
  switch (state) {
    case 'success':
      successMessage.style.display = 'flex';
      errorMessage.style.display = 'none';
      break;
    case 'error':
      successMessage.style.display = 'none';
      errorMessage.style.display = 'flex';
      break;
    default: break;
  }
  setTimeout(() => {
    hideModal()
  }, 5000);
}

/** Hides modal wth successful message. */
function hideModal () {
  modal.style.display = 'none';
}

/** Indicates when request is processing */
function setProcessingRequest (isProcessing) {
  if (isProcessing) {
    spinner.classList.remove('d-none');
    normalBtn.classList.add('d-none');
    submitButton.setAttribute('disabled', '');
    processingRequest = true;
  } else {
    spinner.classList.add('d-none');
    normalBtn.classList.remove('d-none');
    processingRequest = false;
  }
}

/** moves form when replying */
function moveForm (comment_id, respond, skug, url) {
  console.log(comment_id, respond, skug, url);
}