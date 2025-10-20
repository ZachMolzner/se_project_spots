import "../vendor/normalize.css";
import "../vendor/fonts.css";
import "../pages/index.css";

import Api from "../utils/Api.js";
import { enableValidation, resetValidation } from "../scripts/validation.js";
import { validationConfig } from "../scripts/constants.js";

const previewModal = document.querySelector("#preview-modal");
const editProfileModal = document.querySelector("#edit-profile-modal");
const addCardModal = document.querySelector("#new-post-modal");
const deleteModal = document.querySelector("#delete-card-modal");
const editAvatarModal = document.querySelector("#edit-avatar-modal");

const editProfileForm = document.querySelector("#edit-profile-form");
const addCardForm = document.querySelector("#add-card-form");
const deleteForm = document.querySelector("#delete-card-form");
const avatarForm = document.querySelector("#edit-avatar-form");

const profileSubmitBtn = editProfileForm?.querySelector(
  "button[type='submit']"
);
const addCardSubmitBtn = addCardForm?.querySelector("button[type='submit']");
const deleteSubmitBtn = deleteForm?.querySelector("button[type='submit']");
const avatarSubmitBtn = avatarForm?.querySelector("button[type='submit']");

const nameEl = document.querySelector(".profile__name");
const aboutEl = document.querySelector(".profile__job");
const avatarEl = document.querySelector(".profile__avatar");
const editProfileBtn = document.querySelector(".profile__edit-btn");
const avatarEditBtn = document.querySelector(".profile__avatar-edit-btn");

const editProfileNameInput = editProfileModal?.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal?.querySelector(
  "#profile-description-input"
);

const cardsContainer = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template").content;

const modalImage = previewModal?.querySelector(".modal__preview-image");
const modalCaption = previewModal?.querySelector(".modal__caption");

const BUTTON_TEXT = {
  save: "Save",
  saving: "Saving…",
  create: "Create",
  creating: "Saving…",
  yes: "Yes",
  deleting: "Deleting…",
};

let currentUserId = null;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "95b0c08c-f2bc-4b3a-9d45-35928431d195",
    "Content-Type": "application/json",
  },
});

function renderLoading(button, isLoading, idleText, loadingText) {
  if (!button) return;
  button.textContent = isLoading ? loadingText : idleText;
  button.disabled = !!isLoading;
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

function handleEscClose(evt) {
  if (evt.key !== "Escape") return;
  const opened = document.querySelector(".modal.modal_is-opened");
  if (opened) closeModal(opened);
}

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (e) => {
    if (e.target === modal) closeModal(modal);
  });
  modal
    .querySelector(".modal__close-btn")
    ?.addEventListener("click", () => closeModal(modal));
});

function renderUser({ name, about, avatar, _id }) {
  nameEl.textContent = name;
  aboutEl.textContent = about;
  avatarEl.src = avatar;
  if (_id) currentUserId = _id;
}

function computeIsLiked(likes = []) {
  return currentUserId ? likes.some((u) => u._id === currentUserId) : false;
}

function createCardElement(card) {
  const cardEl = cardTemplate.cloneNode(true).querySelector(".card");

  const img = cardEl.querySelector(".card__image");
  const title = cardEl.querySelector(".card__title");
  const likeBtn = cardEl.querySelector(".card__like-button");
  const likeCount = cardEl.querySelector(".card__like-count");
  const deleteBtn = cardEl.querySelector(".card__delete-button");

  img.src = card.link;
  img.alt = card.name;
  title.textContent = card.name;
  likeCount.textContent = card.likes?.length ?? 0;

  const initiallyLiked =
    typeof card.isLiked === "boolean"
      ? card.isLiked
      : computeIsLiked(card.likes);
  if (initiallyLiked) likeBtn.classList.add("card__like-button_active");

  img.addEventListener("click", () => {
    if (!previewModal) return;
    modalCaption.textContent = card.name;
    modalImage.src = card.link;
    modalImage.alt = card.name;
    openModal(previewModal);
  });

  likeBtn.addEventListener("click", () =>
    handleToggleLike(card, { likeBtn, likeCount })
  );

  deleteBtn.addEventListener("click", () => handleDeleteClick(cardEl, card));

  return cardEl;
}

function renderCards(cards) {
  cardsContainer.innerHTML = "";
  for (let i = cards.length - 1; i >= 0; i--) {
    const el = createCardElement(cards[i]);
    cardsContainer.append(el);
  }
}

editProfileBtn?.addEventListener("click", () => {
  openModal(editProfileModal);
  editProfileNameInput.value = nameEl.textContent;
  editProfileDescriptionInput.value = aboutEl.textContent;
  resetValidation(editProfileForm, validationConfig);
});

editProfileForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = editProfileForm.elements.name.value.trim();
  const about = editProfileForm.elements.about.value.trim();

  renderLoading(profileSubmitBtn, true, BUTTON_TEXT.save, BUTTON_TEXT.saving);
  api
    .editUserInfo({ name, about })
    .then((user) => {
      renderUser(user);
      closeModal(editProfileModal);
    })
    .catch((err) => console.error("Edit profile failed:", err))
    .finally(() => renderLoading(profileSubmitBtn, false, BUTTON_TEXT.save));
});

document
  .querySelector(".profile__new-post-btn")
  ?.addEventListener("click", () => {
    resetValidation(addCardForm, validationConfig);
    openModal(addCardModal);
  });

addCardForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = addCardForm.elements.title.value.trim();
  const link = addCardForm.elements.link.value.trim();

  renderLoading(
    addCardSubmitBtn,
    true,
    BUTTON_TEXT.create,
    BUTTON_TEXT.creating
  );
  api
    .addCard({ name, link })
    .then((card) => {
      const el = createCardElement(card);
      cardsContainer.prepend(el);
      addCardForm.reset();
      closeModal(addCardModal);
    })
    .catch((err) => console.error("Add card failed:", err))
    .finally(() => renderLoading(addCardSubmitBtn, false, BUTTON_TEXT.create));
});

function openAvatarModal() {
  resetValidation(avatarForm, validationConfig);
  openModal(editAvatarModal);
}
avatarEditBtn?.addEventListener("click", openAvatarModal);
avatarEl?.addEventListener("click", openAvatarModal);

avatarForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const avatar = avatarForm.elements.avatar.value.trim();

  renderLoading(avatarSubmitBtn, true, BUTTON_TEXT.save, BUTTON_TEXT.saving);
  api
    .updateAvatar({ avatar })
    .then((user) => {
      renderUser(user);
      avatarForm.reset();
      closeModal(editAvatarModal);
    })
    .catch((err) => console.error("Update avatar failed:", err))
    .finally(() => renderLoading(avatarSubmitBtn, false, BUTTON_TEXT.save));
});

let selectedCardEl = null;
let selectedCardId = null;

function handleDeleteClick(cardEl, data) {
  selectedCardEl = cardEl;
  selectedCardId = data._id;
  openModal(deleteModal);
}

deleteForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!selectedCardId) return;

  renderLoading(deleteSubmitBtn, true, BUTTON_TEXT.yes, BUTTON_TEXT.deleting);
  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCardEl?.remove();
      selectedCardEl = null;
      selectedCardId = null;
      closeModal(deleteModal);
    })
    .catch((err) => console.error("Delete card failed:", err))
    .finally(() => renderLoading(deleteSubmitBtn, false, BUTTON_TEXT.yes));
});

function handleToggleLike(card, { likeBtn, likeCount }) {
  const isActive = likeBtn.classList.contains("card__like-button_active");
  const req = isActive ? api.unlikeCard(card._id) : api.likeCard(card._id);

  req
    .then((updated) => {
      const isLiked =
        typeof updated.isLiked === "boolean"
          ? updated.isLiked
          : computeIsLiked(updated.likes);
      likeBtn.classList.toggle("card__like-button_active", isLiked);
      likeCount.textContent = updated.likes?.length ?? (isLiked ? 1 : 0);
      card.isLiked = isLiked;
      card.likes = updated.likes ?? card.likes;
    })
    .catch((err) => console.error("Toggle like failed:", err));
}

function init() {
  enableValidation(validationConfig);

  api
    .getAppData()
    .then(([user, cards]) => {
      renderUser(user);
      renderCards(cards);
    })
    .catch((err) => console.error("Failed to load app data:", err));
}

init();
