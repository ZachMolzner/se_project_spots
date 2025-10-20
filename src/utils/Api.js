export default class Api {
  #baseUrl;
  #headers;

  constructor({ baseUrl, headers }) {
    this.#baseUrl = baseUrl;
    this.#headers = headers;
  }

  _request(path, options = {}) {
    const url = `${this.#baseUrl}${path}`;
    const opts = {
      headers: this.#headers,
      ...options,
    };
    return fetch(url, opts).then((res) => {
      if (res.ok) return res.json();
      return Promise.reject(`Error: ${res.status} ${res.statusText}`);
    });
  }

  getUser() {
    return this._request(`/users/me`);
  }

  editUserInfo({ name, about }) {
    return this._request(`/users/me`, {
      method: "PATCH",
      body: JSON.stringify({ name, about }),
    });
  }

  updateAvatar({ avatar }) {
    return this._request(`/users/me/avatar`, {
      method: "PATCH",
      body: JSON.stringify({ avatar }),
    });
  }

  getInitialCards() {
    return this._request(`/cards`);
  }

  addCard({ name, link }) {
    return this._request(`/cards`, {
      method: "POST",
      body: JSON.stringify({ name, link }),
    });
  }

  removeCard(cardId) {
    return this._request(`/cards/${cardId}`, { method: "DELETE" });
  }

  likeCard(cardId) {
    return this._request(`/cards/${cardId}/likes`, { method: "PUT" });
  }

  unlikeCard(cardId) {
    return this._request(`/cards/${cardId}/likes`, { method: "DELETE" });
  }

  getAppData() {
    return Promise.all([this.getUser(), this.getInitialCards()]);
  }
}
