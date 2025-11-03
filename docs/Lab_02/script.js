window.addEventListener("load", () => {
  document.body.classList.add("page-loaded");
});

(function () {
  const KEY = "cookie_consent_v1";
  if (localStorage.getItem(KEY)) return;

  const bar = document.createElement("div");
  bar.className = "cookie-bar";
  bar.innerHTML = `
    Nasza strona używa plików cookies.
    <button data-accept>OK</button>
    <button data-more>Więcej</button>
  `;
  document.body.appendChild(bar);

  requestAnimationFrame(() => bar.classList.add("show"));

  bar.querySelector("[data-accept]").addEventListener("click", () => {
    localStorage.setItem(KEY, "1");
    bar.remove();
  });

  bar.querySelector("[data-more]").addEventListener("click", () => {
    alert(
      "To edukacyjna strona projektowa. Używamy wyłącznie podstawowych cookies do działania strony. Dane nie są profilowane ani wysyłane na serwer."
    );
  });
})();

(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const email = form.querySelector('input[name="email"]');
  const topic = form.querySelector('select[name="topic"]');
  const message = form.querySelector('textarea[name="message"]');

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function clearError(field) {
    const next = field.nextElementSibling;
    if (next && next.classList.contains("form-error")) next.remove();
  }
  function setError(field, msg) {
    clearError(field);
    const div = document.createElement("div");
    div.className = "form-error";
    div.textContent = msg;
    field.insertAdjacentElement("afterend", div);
  }

  form.addEventListener("submit", (e) => {
    let ok = true;
    clearError(email);
    clearError(topic);
    clearError(message);

    const ev = email.value.trim();
    const mv = message.value.trim();

    if (!ev || !emailRe.test(ev)) {
      setError(email, "Podaj poprawny e-mail.");
      ok = false;
    }
    if (!topic.value) {
      setError(topic, "Wybierz temat wiadomości.");
      ok = false;
    }
    if (!mv || mv.length < 5) {
      setError(message, "Napisz przynajmniej 5 znaków.");
      ok = false;
    }

    if (!ok) e.preventDefault();
    else {
      localStorage.removeItem("draft_email");
      localStorage.removeItem("draft_message");
      alert("Dzięki wielkie! Wiadomość wygląda poprawnie.");
    }
  });

  [email, topic, message].forEach((el) => {
    el.addEventListener("input", () => clearError(el));
    el.addEventListener("change", () => clearError(el));
  });
})();

(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const email = form.querySelector('input[name="email"]');
  const message = form.querySelector('textarea[name="message"]');

  const KEY_EMAIL = "draft_email";
  const KEY_MSG = "draft_message";

  const savedEmail = localStorage.getItem(KEY_EMAIL);
  const savedMsg = localStorage.getItem(KEY_MSG);
  if (savedEmail && !email.value) email.value = savedEmail;
  if (savedMsg && !message.value) message.value = savedMsg;

  const hint = document.createElement("div");
  hint.className = "form-hint";
  hint.textContent = "Szkic zapisywany automatycznie.";
  message.insertAdjacentElement("afterend", hint);

  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.className = "btn-link";
  clearBtn.textContent = "Usuń szkic";
  hint.insertAdjacentElement("afterend", clearBtn);

  clearBtn.addEventListener("click", () => {
    localStorage.removeItem(KEY_EMAIL);
    localStorage.removeItem(KEY_MSG);
    hint.textContent = "Szkic usunięty.";
  });

  function stampSaved() {
    const t = new Date().toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    });
    hint.textContent = `Szkic zapisany: ${t}`;
  }
  email.addEventListener("input", () => {
    localStorage.setItem(KEY_EMAIL, email.value);
    stampSaved();
  });
  message.addEventListener("input", () => {
    localStorage.setItem(KEY_MSG, message.value);
    stampSaved();
  });
})();
