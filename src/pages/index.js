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
  modal.classList.add("modal_is-opened", "modal_opened");
  document.addEventListener("keydown", handleEscClose);
}
function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("modal_is-opened", "modal_opened");
  document.removeEventListener("keydown", handleEscClose);
}
function handleEscClose(evt) {
  if (evt.key !== "Escape") return;
  const opened = document.querySelector(
    ".modal.modal_is-opened, .modal.modal_opened"
  );
  if (opened) closeModal(opened);
}
function setLoading(btn, isLoading, loadingText = "Saving…") {
  if (!btn) return;
  btn.dataset.defaultText ??= btn.textContent;
  btn.textContent = isLoading
    ? btn.dataset.loadingText || loadingText
    : btn.dataset.defaultText;
  btn.disabled = !!isLoading;
}

const previewModal = document.querySelector("#preview-modal");
const modalImage = previewModal?.querySelector(".modal__preview-image");
const modalCaption = previewModal?.querySelector(".modal__caption");
const modalCloseBtn = previewModal?.querySelector(
  ".modal__close-btn_type_preview"
);

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn =
  editProfileModal?.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal?.querySelector(".modal__form");
const editProfileNameInput = editProfileModal?.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal?.querySelector(
  "#profile-description-input"
);
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const newPostBtn = document.querySelector(".profile__new-post-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal?.querySelector(".modal__close-btn");
const newPostForm = newPostModal?.querySelector(".modal__form");
const newPostLink = newPostModal?.querySelector("#card-image-input");
const newPostCaption = newPostModal?.querySelector("#card-caption-input");

const avatarImgEl = document.querySelector(".profile__avatar");
const avatarEditBtn = document.querySelector(".profile__avatar-edit-btn");
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarForm = avatarModal?.querySelector(".modal__form");
const avatarInput = avatarModal?.querySelector("#avatar-link-input");
const avatarCloseBtn = avatarModal?.querySelector(".modal__close-btn");

const confirmModal = document.querySelector("#confirm-modal");
const confirmForm = confirmModal?.querySelector(".modal__form");
const confirmCloseBtn = confirmModal?.querySelector(".modal__close-btn");

const cardTemplate = document
  .querySelector("#card-template")
  ?.content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function renderCard(cardData) {
  const cardElement = cardTemplate.cloneNode(true);

  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  const cardLikeCountEl = cardElement.querySelector(".card__like-count");

  cardImageEl.src = cardData.link;
  cardImageEl.alt = cardData.name;
  cardTitleEl.textContent = cardData.name;

  const likesArr = Array.isArray(cardData.likes) ? cardData.likes : null;
  const initiallyLiked =
    (likesArr && likesArr.some((u) => u._id === currentUserId)) ||
    Boolean(cardData.isLiked);
  cardLikeBtnEl.classList.toggle("card__like-btn_active", initiallyLiked);

  if (cardLikeCountEl) {
    if (likesArr) {
      cardLikeCountEl.textContent = String(likesArr.length);
      cardLikeCountEl.style.display = "";
    } else {
      cardLikeCountEl.style.display = "none";
    }
  }

  const ownerId = cardData.owner && (cardData.owner._id || cardData.owner);
  if (!ownerId || ownerId !== currentUserId) cardDeleteBtnEl?.remove();

  cardImageEl.addEventListener("click", () => {
    if (!previewModal) return;
    modalCaption.textContent = cardData.name;
    modalImage.src = cardData.link;
    modalImage.alt = cardData.name;
    openModal(previewModal);
  });

  cardLikeBtnEl.addEventListener("click", () => {
    const active = cardLikeBtnEl.classList.contains("card__like-btn_active");
    cardLikeBtnEl.disabled = true;

    const req =
      typeof api.changeLikeCardStatus === "function"
        ? api.changeLikeCardStatus(cardData._id, !active)
        : active
        ? api.unlikeCard(cardData._id)
        : api.likeCard(cardData._id);

    req
      .then((updated) => {
        const uLikes = Array.isArray(updated.likes) ? updated.likes : null;
        const nowLiked =
          (uLikes && uLikes.some((u) => u._id === currentUserId)) ||
          Boolean(updated.isLiked);
        cardLikeBtnEl.classList.toggle("card__like-btn_active", nowLiked);

        if (cardLikeCountEl) {
          if (uLikes) {
            cardLikeCountEl.textContent = String(uLikes.length);
            cardLikeCountEl.style.display = "";
          } else {
            cardLikeCountEl.style.display = "none";
          }
        }
      })
      .catch(console.error)
      .finally(() => {
        cardLikeBtnEl.disabled = false;
      });
  });

  cardDeleteBtnEl?.addEventListener("click", () => {
    if (!confirmModal || !confirmForm) {
      if (window.confirm("Delete this card?")) {
        api
          .deleteCard(cardData._id)
          .then(() => cardElement.remove())
          .catch(console.error);
      }
      return;
    }

    openModal(confirmModal);

    const cancelBtn = confirmForm.querySelector('[data-role="cancel"]');
    const submitBtn = confirmForm.querySelector(".btn--danger");

    const onCancel = () => closeModal(confirmModal);
    cancelBtn?.addEventListener("click", onCancel, { once: true });

    const onSubmit = (evt) => {
      evt.preventDefault();
      setLoading(submitBtn, true, "Deleting…");

      api
        .deleteCard(cardData._id)
        .then(() => {
          cardElement.remove();
          closeModal(confirmModal);
        })
        .catch(console.error)
        .finally(() => setLoading(submitBtn, false));
    };

    confirmForm.addEventListener("submit", onSubmit, { once: true });
  });

  return cardElement;
}

modalCloseBtn?.addEventListener("click", () => closeModal(previewModal));
previewModal?.addEventListener("mousedown", (e) => {
  if (e.target === previewModal) closeModal(previewModal);
});

editProfileBtn?.addEventListener("click", () => {
  openModal(editProfileModal);
  if (editProfileNameInput)
    editProfileNameInput.value = profileNameEl.textContent;
  if (editProfileDescriptionInput)
    editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  if (editProfileForm) resetValidation(editProfileForm, validationConfig);
});
editProfileCloseBtn?.addEventListener("click", () =>
  closeModal(editProfileModal)
);
editProfileModal?.addEventListener("mousedown", (e) => {
  if (e.target === editProfileModal) closeModal(editProfileModal);
});

editProfileForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const btn =
    e.submitter || editProfileForm.querySelector('button[type="submit"]');
  setLoading(btn, true, "Saving…");

  const name = editProfileNameInput.value.trim();
  const about = editProfileDescriptionInput.value.trim();

  api
    .updateUserInfo({ name, about })
    .then((user) => {
      profileNameEl.textContent = user.name;
      profileDescriptionEl.textContent = user.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => setLoading(btn, false));
});

newPostBtn?.addEventListener("click", () => openModal(newPostModal));
newPostCloseBtn?.addEventListener("click", () => closeModal(newPostModal));
newPostModal?.addEventListener("mousedown", (e) => {
  if (e.target === newPostModal) closeModal(newPostModal);
});

newPostForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = e.submitter || newPostForm.querySelector('button[type="submit"]');
  setLoading(btn, true, "Saving…");

  const name = newPostCaption.value.trim();
  const link = newPostLink.value.trim();

  api
    .addCard({ name, link })
    .then((serverCard) => {
      cardsList.prepend(renderCard(serverCard));
      closeModal(newPostModal);
      newPostForm.reset();
      resetValidation(newPostForm, validationConfig);
    })
    .catch(console.error)
    .finally(() => setLoading(btn, false));
});

avatarEditBtn?.addEventListener("click", () => {
  openModal(avatarModal);
  if (avatarForm) resetValidation(avatarForm, validationConfig);
});
avatarCloseBtn?.addEventListener("click", () => closeModal(avatarModal));
avatarModal?.addEventListener("mousedown", (e) => {
  if (e.target === avatarModal) closeModal(avatarModal);
});

avatarForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = e.submitter || avatarForm.querySelector('button[type="submit"]');
  setLoading(btn, true, "Saving…");

  const avatar = avatarInput.value.trim();
  api
    .updateAvatar(avatar)
    .then((user) => {
      if (avatarImgEl) avatarImgEl.src = user.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
      resetValidation(avatarForm, validationConfig);
    })
    .catch(console.error)
    .finally(() => setLoading(btn, false));
});

confirmCloseBtn?.addEventListener("click", () => closeModal(confirmModal));
confirmModal?.addEventListener("mousedown", (e) => {
  if (e.target === confirmModal) closeModal(confirmModal);
});

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([user, cards]) => {
    currentUserId = user._id;
    if (profileNameEl) profileNameEl.textContent = user.name;
    if (profileDescriptionEl) profileDescriptionEl.textContent = user.about;
    if (avatarImgEl) avatarImgEl.src = user.avatar;

    cardsList.innerHTML = "";
    cards.forEach((c) => cardsList.append(renderCard(c)));
  })
  .catch(console.error);

enableValidation(validationConfig);
