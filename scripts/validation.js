function showInputError(formEl, inputEl, message, config) {
  const errorEl = formEl.querySelector(`#${inputEl.id}-error`);
  inputEl.classList.add(config.inputErrorClass);
  errorEl.textContent = message;
  errorEl.classList.add(config.errorClass);
}
function hideInputError(formEl, inputEl, config) {
  const errorEl = formEl.querySelector(`#${inputEl.id}-error`);
  inputEl.classList.remove(config.inputErrorClass);
  errorEl.textContent = "";
  errorEl.classList.remove(config.errorClass);
}
function checkInputValidity(formEl, inputEl, config) {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage, config);
  } else {
    hideInputError(formEl, inputEl, config);
  }
}
function hasInvalidInput(inputList) {
  return inputList.some((inputEl) => !inputEl.validity.valid);
}
function toggleButtonState(inputList, buttonEl, config) {
  if (hasInvalidInput(inputList)) {
    buttonEl.classList.add(config.inactiveButtonClass);
    buttonEl.disabled = true;
  } else {
    buttonEl.classList.remove(config.inactiveButtonClass);
    buttonEl.disabled = false;
  }
}
function setEventListeners(formEl, config) {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonEl = formEl.querySelector(config.submitButtonSelector);
  toggleButtonState(inputList, buttonEl, config);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", () => {
      checkInputValidity(formEl, inputEl, config);
      toggleButtonState(inputList, buttonEl, config);
    });
  });
}
function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
}
function resetValidation(formEl, config, { resetButtonState = true } = {}) {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  inputList.forEach((inputEl) => hideInputError(formEl, inputEl, config));

  if (resetButtonState) {
    const buttonEl = formEl.querySelector(config.submitButtonSelector);
    toggleButtonState(inputList, buttonEl, config);
  }
}
const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};
enableValidation(settings);
window.formValidation = {
  resetValidation,
  settings,
};
const modals = document.querySelectorAll(".modal");

modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});
