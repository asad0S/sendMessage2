// تابع به‌روزرسانی نمایش لپتاب فعلی
function updateCurrentLaptopDisplay() {
  const select = document.getElementById("laptopSelect");
  const selectedText = select.options[select.selectedIndex].text;
  document.getElementById("currentLaptopDisplay").innerText = `شما در ${selectedText} هستید`;
}

// وقتی صفحه لود شد
window.onload = function() {
  const savedLaptopId = localStorage.getItem("selectedLaptopId");
  if (savedLaptopId) {
    document.getElementById("laptopSelect").value = savedLaptopId;
  }
  updateCurrentLaptopDisplay();
  listenForMessages();
}

// دکمه ذخیره شناسه لپتاب
document.getElementById("saveDefault").addEventListener("click", function() {
  const selectedLaptopId = document.getElementById("laptopSelect").value;
  localStorage.setItem("selectedLaptopId", selectedLaptopId);
  alert("شناسه لپتاب ذخیره شد!");
  updateCurrentLaptopDisplay();
  listenForMessages();
});

// 🚫 حذف ارسال خودکار هنگام نوشتن یا پیست کردن

// ✅ دکمه‌ی جدید ارسال پیام
document.getElementById("sendMessage").addEventListener("click", function() {
  const messageText = document.getElementById("messageInput").value.trim();
  if (messageText === "") return;

  const laptopId = document.getElementById("laptopSelect").value;
  const message = {
    sender: "لپتاب من",
    text: messageText,
    laptopId: laptopId,
    timestamp: Date.now()
  };

  firebase.database().ref("messages").push(message);
  document.getElementById("messageInput").value = "";
});

// تابع دریافت پیام‌ها فقط برای شناسه لپتاب فعلی
let messagesListener = null;

function listenForMessages() {
  const laptopId = document.getElementById("laptopSelect").value;
  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = "";

  if (messagesListener) {
    messagesListener.off();
  }

  const query = firebase.database().ref("messages").orderByChild("laptopId").equalTo(laptopId);
  messagesListener = query;

  query.on("child_added", function(snapshot) {
    const message = snapshot.val();
    const messageElement = document.createElement("div");
    messageElement.innerText = `${message.text}`;
    messagesDiv.appendChild(messageElement);

    setTimeout(() => {
      messageElement.remove();
    }, 60000);
  });
}

// دکمه ریست پیام‌ها
document.getElementById("resetMessages").addEventListener("click", function() {
  const confirmReset = confirm("آیا مطمئن هستید می‌خواهید همه پیام‌ها را حذف کنید؟");
  if (confirmReset) {
    firebase.database().ref("messages").remove().then(function() {
      document.getElementById("messages").innerHTML = "";
    }).catch(function(error) {
      alert("خطا در حذف پیام‌ها: " + error.message);
    });
  }
});

document.getElementById('sendHelloMessage').addEventListener('click', function() {
  const messageInput = document.getElementById('messageInput');
  messageInput.value = 'بسته شد صفحات';

  const messageText = messageInput.value.trim();
  if (messageText === "") return;

  const laptopId = document.getElementById("laptopSelect").value;
  const message = {
    sender: "لپتاب من",
    text: messageText,
    laptopId: laptopId,
    timestamp: Date.now()
  };

  firebase.database().ref("messages").push(message);
  messageInput.value = '';
});
