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
  _request(path, options = {}) {
    return fetch(`${this._baseUrl}${path}`, {
      headers: this._headers,
      ...options,
    }).then(this._handleResponse);
  }
  getUserInfo() {
    return this._request(`/users/me`, { method: "GET" });
  }
  updateUserInfo({ name, about }) {
    return this._request(`/users/me`, {
      method: "PATCH",
      headers: { ...this._headers, "Content-Type": "application/json" },
      body: JSON.stringify({ name, about }),
    });
  }
  updateAvatar(avatar) {
    return this._request(`/users/me/avatar`, {
      method: "PATCH",
      headers: { ...this._headers, "Content-Type": "application/json" },
      body: JSON.stringify({ avatar }),
    });
  }
  getInitialCards() {
    return this._request(`/cards`, { method: "GET" });
  }
  addCard({ name, link }) {
    return this._request(`/cards`, {
      method: "POST",
      headers: { ...this._headers, "Content-Type": "application/json" },
      body: JSON.stringify({ name, link }),
    });
  }
  deleteCard(id) {
    return this._request(`/cards/${id}`, { method: "DELETE" });
  }
  changeLikeCardStatus(id, like) {
    return this._request(`/cards/${id}/likes`, {
      method: like ? "PUT" : "DELETE",
    });
  }
}
export default Api;
