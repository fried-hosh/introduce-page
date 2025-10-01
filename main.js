const nameInput = document.getElementById("name");

// 名前入力欄で押されたキーがEnterならフォームの送信をキャンセルする
nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
  }
});

// ----- CSSアニメーションの設定 -----

const fadeinTargets = document.querySelectorAll(".fade-in");

// 画面に入ったかどうかを判定するIntersection Observerを作成
// "visible"とfadeinTargets以外は全部定型文
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // 画面内に入ったら
    if (entry.isIntersecting) {
      // visibleクラスを追加
      entry.target.classList.add("visible");
    }
  });
});

// 各要素の監視を開始
fadeinTargets.forEach((target) => {
  observer.observe(target);
});

// ----- 文字数カウンターの設定 -----

const messageInput = document.getElementById("message");
const charCounter = document.querySelector(".char-counter");

messageInput.addEventListener("input", (event) => {
  const count = messageInput.value.length;
  charCounter.textContent = `${count}文字`;
});

// ----- 送信時のサンキューメッセージ -----

const form = document.querySelector(".contact-form");
const thanksMessage = document.getElementById("thanks-message");
// nameInputは上のやつを再利用

form.addEventListener("submit", (event) => {
  event.preventDefault();

  // もし名前とメッセージの両方が入力されていたら...
  if (nameInput.value != "" && messageInput.value != "") {
    thanksMessage.hidden = false; // サンキューメッセージを表示する
    // 入力フォームをクリア
    nameInput.value = "";
    messageInput.value = "";
  } else {
    alert("お名前とメッセージを入力してください。");
  }
});

// ----- スクロールでTOPボタンを表示 -----

const backToTopButton = document.querySelector(".back-to-top");

// スクロールイベントを監視
window.addEventListener("scroll", (event) => {
  // ページの上から300px以上スクロールされたら
  if (window.scrollY >= 300) {
    backToTopButton.classList.add("visible");
  } else {
    // 300px未満ならvisibleクラスを削除してボタンを隠す
    backToTopButton.classList.remove("visible");
  }
});
