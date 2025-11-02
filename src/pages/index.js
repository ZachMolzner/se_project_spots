import "./index.css";
import Api from "../utils/Api.js";
import { enableValidation, resetValidation } from "../scripts/validation.js";
import { validationConfig } from "../scripts/constants.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "800f8c77-4aa6-4b88-989e-2391faf166e2",
  },
});

let currentUserId = null;

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscClose);
}
function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscClose);
}
function handleEscClose(evt) {
  if (evt.key !== "Escape") return;
  const opened = document.querySelector(".modal.modal_opened");
  if (opened) closeModal(opened);
}
function setLoading(btn, isLoading, text = "Saving…") {
  if (!btn) return;
  btn.dataset.defaultText ??= btn.textContent;
  btn.textContent = isLoading
    ? btn.dataset.loadingText || text
    : btn.dataset.defaultText;
  btn.disabled = !!isLoading;
}

const previewModal = document.querySelector("#preview-modal");
const previewCloseBtn = previewModal?.querySelector(
  ".modal__close-btn_type_preview"
);
const previewImage = previewModal?.querySelector(".modal__preview-image");
const previewCaption = previewModal?.querySelector(".modal__caption");

const profileNameEl = document.querySelector(".profile__name");
const profileAboutEl = document.querySelector(".profile__description");
const avatarImgEl = document.querySelector(".profile__avatar");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileOpenBtn = document.querySelector(".profile__edit-btn");
const editProfileCloseBtn =
  editProfileModal?.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal?.querySelector(".modal__form");
const profileNameInput = editProfileModal?.querySelector("#profile-name-input");
const profileAboutInput = editProfileModal?.querySelector(
  "#profile-description-input"
);

const newCardModal = document.querySelector("#new-post-modal");
const newCardOpenBtn = document.querySelector(".profile__new-post-btn");
const newCardCloseBtn = newCardModal?.querySelector(".modal__close-btn");
const newCardForm = newCardModal?.querySelector(".modal__form");
const newCardTitleInput = newCardModal?.querySelector("#card-caption-input");
const newCardLinkInput = newCardModal?.querySelector("#card-image-input");

const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarOpenBtn = document.querySelector(".profile__avatar-edit-btn");
const editAvatarCloseBtn = editAvatarModal?.querySelector(".modal__close-btn");
const editAvatarForm = editAvatarModal?.querySelector(".modal__form");
const avatarUrlInput = editAvatarModal?.querySelector("#avatar-link-input");

const confirmDeleteModal = document.querySelector("#confirm-modal");
const confirmDeleteForm = confirmDeleteModal?.querySelector(".modal__form");
const confirmDeleteCloseBtn =
  confirmDeleteModal?.querySelector(".modal__close-btn");
const confirmDeleteSubmitBtn =
  confirmDeleteForm?.querySelector(".btn--danger, [data-role='submit']") ||
  confirmDeleteForm?.querySelector('button[type="submit"]');
const confirmDeleteCancelBtn = confirmDeleteForm?.querySelector(
  ".btn--ghost, [data-role='cancel']"
);

let pendingDelete = { id: null, element: null };

const cardTemplate = document
  .querySelector("#card-template")
  ?.content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function renderCard(cardData) {
  const cardEl = cardTemplate.cloneNode(true);

  const img = cardEl.querySelector(".card__image");
  const title = cardEl.querySelector(".card__title");
  const likeBtn = cardEl.querySelector(".card__like-btn");
  const likeCountEl = cardEl.querySelector(".card__like-count");
  const deleteBtn = cardEl.querySelector(".card__delete-btn");

  img.src = cardData.link;
  img.alt = cardData.name;
  title.textContent = cardData.name;

  const likesArr = Array.isArray(cardData.likes) ? cardData.likes : null;
  const initiallyLiked =
    (likesArr && likesArr.some((u) => u._id === currentUserId)) ||
    Boolean(cardData.isLiked);
  likeBtn.classList.toggle("card__like-btn_active", initiallyLiked);

  if (likeCountEl) {
    if (likesArr) {
      likeCountEl.textContent = String(likesArr.length);
      likeCountEl.style.display = "";
    } else {
      likeCountEl.style.display = "none";
    }
  }

  const ownerId = cardData.owner && (cardData.owner._id || cardData.owner);
  if (!ownerId || ownerId !== currentUserId) deleteBtn?.remove();

  img.addEventListener("click", () => {
    if (!previewModal) return;
    previewImage.src = cardData.link;
    previewImage.alt = cardData.name;
    previewCaption.textContent = cardData.name;
    openModal(previewModal);
  });

  likeBtn.addEventListener("click", () => {
    const isActive = likeBtn.classList.contains("card__like-btn_active");
    likeBtn.disabled = true;

    api
      .changeLikeCardStatus(cardData._id, !isActive)
      .then((updated) => {
        const updatedLikes = Array.isArray(updated.likes)
          ? updated.likes
          : null;
        const nowLiked =
          (updatedLikes && updatedLikes.some((u) => u._id === currentUserId)) ||
          Boolean(updated.isLiked);
        likeBtn.classList.toggle("card__like-btn_active", nowLiked);

        if (likeCountEl) {
          if (updatedLikes) {
            likeCountEl.textContent = String(updatedLikes.length);
            likeCountEl.style.display = "";
          } else {
            likeCountEl.style.display = "none";
          }
        }
      })
      .catch(console.error)
      .finally(() => {
        likeBtn.disabled = false;
      });
  });

  deleteBtn?.addEventListener("click", () => {
    pendingDelete.id = cardData._id;
    pendingDelete.element = cardEl;
    openModal(confirmDeleteModal);
  });

  return cardEl;
}

function closeConfirmDeleteModal() {
  pendingDelete.id = null;
  pendingDelete.element = null;
  closeModal(confirmDeleteModal);
}

function handleConfirmDeleteSubmit(e) {
  e.preventDefault();
  if (!pendingDelete.id || !pendingDelete.element) return;

  setLoading(confirmDeleteSubmitBtn, true, "Deleting…");
  api
    .deleteCard(pendingDelete.id)
    .then(() => {
      pendingDelete.element.remove();
      closeConfirmDeleteModal();
    })
    .catch(console.error)
    .finally(() => setLoading(confirmDeleteSubmitBtn, false));
}

confirmDeleteForm?.addEventListener("submit", handleConfirmDeleteSubmit);
confirmDeleteCancelBtn?.addEventListener("click", closeConfirmDeleteModal);
confirmDeleteCloseBtn?.addEventListener("click", closeConfirmDeleteModal);
confirmDeleteModal?.addEventListener("mousedown", (e) => {
  if (e.target === confirmDeleteModal) closeConfirmDeleteModal();
});

previewCloseBtn?.addEventListener("click", () => closeModal(previewModal));
previewModal?.addEventListener("mousedown", (e) => {
  if (e.target === previewModal) closeModal(previewModal);
});

function openEditProfileModal() {
  if (!editProfileModal) return;
  if (profileNameInput) profileNameInput.value = profileNameEl.textContent;
  if (profileAboutInput) profileAboutInput.value = profileAboutEl.textContent;
  if (editProfileForm) resetValidation(editProfileForm, validationConfig);
  openModal(editProfileModal);
}
function closeEditProfileModal() {
  closeModal(editProfileModal);
}
function handleEditProfileSubmit(e) {
  e.preventDefault();
  const btn =
    e.submitter || editProfileForm.querySelector('button[type="submit"]');
  setLoading(btn, true, "Saving…");
  const name = profileNameInput.value.trim();
  const about = profileAboutInput.value.trim();

  api
    .updateUserInfo({ name, about })
    .then((user) => {
      profileNameEl.textContent = user.name;
      profileAboutEl.textContent = user.about;
      closeEditProfileModal();
    })
    .catch(console.error)
    .finally(() => setLoading(btn, false));
}

editProfileOpenBtn?.addEventListener("click", openEditProfileModal);
editProfileCloseBtn?.addEventListener("click", closeEditProfileModal);
editProfileModal?.addEventListener("mousedown", (e) => {
  if (e.target === editProfileModal) closeEditProfileModal();
});
editProfileForm?.addEventListener("submit", handleEditProfileSubmit);

function openNewCardModal() {
  if (newCardForm) resetValidation(newCardForm, validationConfig);
  openModal(newCardModal);
}
function closeNewCardModal() {
  closeModal(newCardModal);
}
function handleNewCardSubmit(e) {
  e.preventDefault();
  const btn = e.submitter || newCardForm.querySelector('button[type="submit"]');
  setLoading(btn, true, "Saving…");

  const name = newCardTitleInput.value.trim();
  const link = newCardLinkInput.value.trim();

  api
    .addCard({ name, link })
    .then((serverCard) => {
      cardsList.prepend(renderCard(serverCard));
      newCardForm.reset();
      closeNewCardModal();
      resetValidation(newCardForm, validationConfig);
    })
    .catch(console.error)
    .finally(() => setLoading(btn, false));
}

newCardOpenBtn?.addEventListener("click", openNewCardModal);
newCardCloseBtn?.addEventListener("click", closeNewCardModal);
newCardModal?.addEventListener("mousedown", (e) => {
  if (e.target === newCardModal) closeNewCardModal();
});
newCardForm?.addEventListener("submit", handleNewCardSubmit);

function openEditAvatarModal() {
  if (editAvatarForm) resetValidation(editAvatarForm, validationConfig);
  openModal(editAvatarModal);
}
function closeEditAvatarModal() {
  closeModal(editAvatarModal);
}
function handleEditAvatarSubmit(e) {
  e.preventDefault();
  const btn =
    e.submitter || editAvatarForm.querySelector('button[type="submit"]');
  setLoading(btn, true, "Saving…");
  const avatar = avatarUrlInput.value.trim();

  api
    .updateAvatar(avatar)
    .then((user) => {
      if (avatarImgEl) avatarImgEl.src = user.avatar;
      editAvatarForm.reset();
      closeEditAvatarModal();
      resetValidation(editAvatarForm, validationConfig);
    })
    .catch(console.error)
    .finally(() => setLoading(btn, false));
}

editAvatarOpenBtn?.addEventListener("click", openEditAvatarModal);
editAvatarCloseBtn?.addEventListener("click", closeEditAvatarModal);
editAvatarModal?.addEventListener("mousedown", (e) => {
  if (e.target === editAvatarModal) closeEditAvatarModal();
});
editAvatarForm?.addEventListener("submit", handleEditAvatarSubmit);

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([user, cards]) => {
    currentUserId = user._id;
    if (profileNameEl) profileNameEl.textContent = user.name;
    if (profileAboutEl) profileAboutEl.textContent = user.about;
    if (avatarImgEl) avatarImgEl.src = user.avatar;

    cardsList.innerHTML = "";
    cards.forEach((c) => cardsList.append(renderCard(c)));
  })
  .catch(console.error);

enableValidation(validationConfig);
