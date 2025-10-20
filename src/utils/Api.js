export default class Api {
  #baseUrl;
  #headers;

  constructor({ baseUrl, headers }) {
    this.#baseUrl = baseUrl;
    this.#headers = headers;
  }

  _request(path, options = {}) {
    const url = `${this.#baseUrl}${path}`;

    const hasBody = options.body !== undefined && options.body !== null;
    const headers = {
      ...this.#headers,
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    };

    const opts = { ...options, headers };

    return fetch(url, opts).then(async (res) => {
      if (!res.ok) {
        let detail = "";
        try {
          const ct = res.headers.get("content-type") || "";
          if (ct.includes("application/json")) {
            const j = await res.json();
            detail = typeof j === "string" ? j : JSON.stringify(j);
          } else {
            detail = await res.text();
          }
        } catch (_) {}
        return Promise.reject(
          `Error ${res.status} ${res.statusText}${detail ? ` — ${detail}` : ""}`
        );
      }

      const contentLength = res.headers.get("content-length");
      const contentType = res.headers.get("content-type") || "";

      if (res.status === 204 || contentLength === "0") return null;
      if (!contentType.includes("application/json")) return null;

      return res.json();
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
