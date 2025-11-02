class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl.replace(/\/$/, "");
    this._headers = headers;
  }
  _handleResponse(res) {
    if (res.ok) return res.json();
    return res.text().then((t) => {
      throw new Error(t || `HTTP ${res.status}`);
    });
  }
  _request(path, { method = "GET", headers, body } = {}) {
    return fetch(`${this._baseUrl}${path}`, {
      method,
      headers: {
        ...this._headers,
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body,
    }).then(this._handleResponse);
  }

  getUserInfo() {
    return this._request(`/users/me`);
  }
  updateUserInfo(data) {
    return this._request(`/users/me`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
  updateAvatar(avatar) {
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
  deleteCard(id) {
    return this._request(`/cards/${id}`, { method: "DELETE" });
  }

  likeCard(id) {
    return this._request(`/cards/${id}/likes`, { method: "PUT" });
  }
  unlikeCard(id) {
    return this._request(`/cards/${id}/likes`, { method: "DELETE" });
  }

  getAppData() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }
}
export default Api;
