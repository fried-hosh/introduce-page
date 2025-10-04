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

/*
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
*/

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

// ----- モーダル関連の操作 -----

const likesContainer = document.querySelector(".likes-container");
const modal = document.getElementById("modal");
const modalCloseBtn = document.querySelector(".modal-close-btn");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");

// 親要素の .likes-containerにイベントリスナーを設定
likesContainer.addEventListener("click", (event) => {
  // クリックされた要素が.like-cardかを確認
  const clickedCard = event.target.closest(".like-card");

  if (clickedCard) {
    // クリックされたカードのh3とpのテキストを取得
    const title = clickedCard.querySelector("h3").textContent;
    const text = clickedCard.querySelector("p").textContent;

    // モーダルの内容を、取得したテキストで更新
    modalTitle.textContent = title;
    modalText.textContent = text;

    // モーダルを表示
    modal.classList.remove("is-hidden");
  }
});

// 閉じるボタンでモーダルを非表示にする
modalCloseBtn.addEventListener("click", () => {
  modal.classList.add("is-hidden");
});

// モーダルをクリックしても窓を消せるようにする
modal.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.classList.add("is-hidden");
  }
});

// ----- フォームバリデーション関連 -----

// nameInputとmessageInputは上のを使う
const form = document.querySelector(".contact-form");

// フォームが送信されたときの処理
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // --- 名前のバリデーション ---
  let isNameValid = false; // バリデーション成功フラグ
  // 1. inputから、エラーメッセージを表示するべきspanのID名を取得
  const nameErrorId = nameInput.getAttribute("aria-describedby");
  // 2. 取得したID名を使って、該当するspan要素を捕まえる
  const nameErrorElement = document.getElementById(nameErrorId);
  // 3. spanのエラーメッセージを一旦リセット
  nameErrorElement.textContent = "";

  if (nameInput.value.trim() === "") {
    nameErrorElement.textContent = "お名前を入力してください。";
  } else {
    isNameValid = true; // エラーがなければ成功フラグをtrueに
  }

  // --- メッセージのバリデーション ---
  let isMessageValid = false;
  const messageErrorId = messageInput.getAttribute("aria-describedby");
  const messageErrorElement = document.getElementById(messageErrorId);
  messageErrorElement.textContent = "";

  const messageValue = messageInput.value.trim();
  if (messageValue === "") {
    messageErrorElement.textContent = "メッセージを入力してください。";
  } else if (messageValue.length < 10) {
    messageErrorElement.textContent = "10文字以上入力してください。";
  } else {
    isMessageValid = true;
  }

  // --- 最終チェック ---
  // もし全てのバリデーションが成功していたら...
  if (isNameValid && isMessageValid) {
    console.log("バリデーション成功！送信処理に進みます。");
  } else return; // 失敗してたらreturnで送信を阻止

  // ----- fetchを使ってデータを送信する -----

  try {
    // 送信するデータをまとめる
    const postData = {
      name: nameInput.value,
      message: messageInput.value,
    };
    // 時間のかかる処理の前にawaitをつけて、結果を直接変数に入れる
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // JSONを送る時の定型分
      },
      body: JSON.stringify(postData), // 実際に送るデータ本体
    });

    if (!response.ok) {
      throw new Error(`サーバーエラー: ${response.status}`);
    }

    // response.jsonも時間がかかるため、awaitで待つ
    const data = await response.json();

    console.log("サーバーからの返信:", data);
    alert("メッセージが送信されました！");
  } catch (error) {
    console.error("送信に失敗しました:", error);
    alert("送信に失敗しました。もう一度お試しください。");
  }
});
