<<<<<<< HEAD
import "./index.css";
=======
import "../pages/index.css";
>>>>>>> spots-final

import { enableValidation, resetValidation } from "../scripts/validation.js";
import { validationConfig } from "../scripts/constants.js";

<<<<<<< HEAD
const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorenx",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "a very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];
=======
import Api from "../utils/Api.js";

export const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "4b9453cf-7fc7-4297-822b-58666c578c69",
    "Content-Type": "application/json",
  },
});
>>>>>>> spots-final

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}
<<<<<<< HEAD

=======
>>>>>>> spots-final
function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}
<<<<<<< HEAD

=======
>>>>>>> spots-final
function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal.modal_is-opened");
    if (openedModal) closeModal(openedModal);
  }
}

const previewModal = document.querySelector("#preview-modal");
const modalImage = previewModal.querySelector(".modal__preview-image");
const modalCaption = previewModal.querySelector(".modal__caption");
const modalCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);
<<<<<<< HEAD
=======
modalCloseBtn.addEventListener("click", () => closeModal(previewModal));
previewModal.addEventListener("mousedown", (e) => {
  if (e.target === previewModal) closeModal(previewModal);
});
>>>>>>> spots-final

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
<<<<<<< HEAD
=======
const profileSubmitBtn = editProfileForm.querySelector("button[type='submit']");
>>>>>>> spots-final
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
<<<<<<< HEAD
=======
const profileAvatarEl = document.querySelector(".profile__avatar");
>>>>>>> spots-final

const newPostBtn = document.querySelector(".profile__new-post-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");
<<<<<<< HEAD
=======
const newPostSubmitBtn = newPostForm.querySelector("button[type='submit']");
>>>>>>> spots-final
const newPostLink = newPostModal.querySelector("#card-image-input");
const newPostCaption = newPostModal.querySelector("#card-caption-input");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

<<<<<<< HEAD
// --- Card factory ---
=======
function withLoading(button, loadingText, fn) {
  const original = button.textContent;
  button.textContent = loadingText;
  button.disabled = true;
  return Promise.resolve()
    .then(fn)
    .finally(() => {
      button.textContent = original;
      button.disabled = false;
    });
}

>>>>>>> spots-final
function getCardElement(cardData) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");

<<<<<<< HEAD
=======
  cardElement.dataset.id = cardData._id;
>>>>>>> spots-final
  cardImageEl.src = cardData.link;
  cardImageEl.alt = cardData.name;
  cardTitleEl.textContent = cardData.name;

<<<<<<< HEAD
=======
  if (cardData.isLiked) {
    cardLikeBtnEl.classList.add("card__like-btn_active");
  }

>>>>>>> spots-final
  cardImageEl.addEventListener("click", () => {
    modalCaption.textContent = cardData.name;
    modalImage.src = cardData.link;
    modalImage.alt = cardData.name;
    openModal(previewModal);
  });

  cardLikeBtnEl.addEventListener("click", () => {
<<<<<<< HEAD
    cardLikeBtnEl.classList.toggle("card__like-btn_active");
  });

  cardDeleteBtnEl.addEventListener("click", () => {
    cardDeleteBtnEl.closest(".card").remove();
=======
    const shouldLike = !cardLikeBtnEl.classList.contains(
      "card__like-btn_active"
    );
    api
      .changeLikeCardStatus(cardData._id, shouldLike)
      .then((updatedCard) => {
        if (updatedCard.isLiked) {
          cardLikeBtnEl.classList.add("card__like-btn_active");
        } else {
          cardLikeBtnEl.classList.remove("card__like-btn_active");
        }
      })
      .catch((err) => console.error("Like toggle failed:", err));
  });

  cardDeleteBtnEl.addEventListener("click", () => {
    if (window.confirm("Delete this card?")) {
      api
        .deleteCard(cardData._id)
        .then(() => cardElement.remove())
        .catch((err) => console.error("Delete failed:", err));
    }
>>>>>>> spots-final
  });

  return cardElement;
}

<<<<<<< HEAD
modalCloseBtn.addEventListener("click", () => closeModal(previewModal));

previewModal.addEventListener("mousedown", (e) => {
  if (e.target === previewModal) closeModal(previewModal);
});
=======
function appendCard(cardData) {
  const cardEl = getCardElement(cardData);
  cardsList.append(cardEl);
}

function prependCard(cardData) {
  const cardEl = getCardElement(cardData);
  cardsList.prepend(cardEl);
}
>>>>>>> spots-final

editProfileBtn.addEventListener("click", () => {
  openModal(editProfileModal);
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, validationConfig);
});
<<<<<<< HEAD

=======
>>>>>>> spots-final
editProfileCloseBtn.addEventListener("click", () =>
  closeModal(editProfileModal)
);
editProfileModal.addEventListener("mousedown", (e) => {
  if (e.target === editProfileModal) closeModal(editProfileModal);
});

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
<<<<<<< HEAD
  profileNameEl.textContent = editProfileNameInput.value.trim();
  profileDescriptionEl.textContent = editProfileDescriptionInput.value.trim();
  closeModal(editProfileModal);
=======
  const name = editProfileNameInput.value.trim();
  const about = editProfileDescriptionInput.value.trim();

  withLoading(profileSubmitBtn, "Saving...", () =>
    api
      .updateUserInfo({ name, about })
      .then((user) => {
        profileNameEl.textContent = user.name;
        profileDescriptionEl.textContent = user.about;
        closeModal(editProfileModal);
      })
      .catch((err) => console.error("Profile update failed:", err))
  );
>>>>>>> spots-final
});

newPostBtn.addEventListener("click", () => openModal(newPostModal));
newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));
newPostModal.addEventListener("mousedown", (e) => {
  if (e.target === newPostModal) closeModal(newPostModal);
});

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
<<<<<<< HEAD
  const newCardData = {
    name: newPostCaption.value.trim(),
    link: newPostLink.value.trim(),
  };
  const newCardElement = getCardElement(newCardData);
  cardsList.prepend(newCardElement);
  closeModal(newPostModal);
  newPostForm.reset();
  resetValidation(newPostForm, validationConfig);
});

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
});
=======
  const name = newPostCaption.value.trim();
  const link = newPostLink.value.trim();

  withLoading(newPostSubmitBtn, "Saving...", () =>
    api
      .addCard({ name, link })
      .then((newCard) => {
        prependCard(newCard);
        newPostForm.reset();
        resetValidation(newPostForm, validationConfig);
        closeModal(newPostModal);
      })
      .catch((err) => console.error("Add card failed:", err))
  );
});

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([user, cards]) => {
    profileNameEl.textContent = user.name;
    profileDescriptionEl.textContent = user.about;
    if (profileAvatarEl) {
      profileAvatarEl.src = user.avatar;
      profileAvatarEl.alt = `${user.name}'s avatar`;
    }

    cards.forEach(appendCard);
  })
  .catch((err) => console.error("Initial load failed:", err));
>>>>>>> spots-final

enableValidation(validationConfig);
