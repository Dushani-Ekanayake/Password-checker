function checkPassword() {
  const pwd = document.getElementById("password").value;
  const strengthMood = document.getElementById("strengthMood");
  const suggestion = document.getElementById("suggestion");

  function togglePasswordVisibility() {
  const passwordInput = document.getElementById("passwordInput");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}


  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  let mood = "", color = "";

  if (score <= 1) {
    mood = " Sleepy password. Anyone can guess it.";
    color = "#e74c3c";
  } else if (score == 2) {
    mood = " Still very guessable.";
    color = "#e67e22";
  } else if (score == 3) {
    mood = "You’re getting there!";
    color = "#f1c40f";
  } else if (score == 4) {
    mood = " Warrior password!";
    color = "#2ecc71";
  } else {
    mood = " Hacker-proof genius!";
    color = "#3498db";
  }

  strengthMood.innerHTML = mood;
  strengthMood.style.color = color;

  suggestion.innerHTML = getSmartSuggestion(pwd);
}

function getSmartSuggestion(password) {
  const commonEndings = ['123', '1234', '2023', '2024', 'admin'];
  let newPass = password;

  if (!/[A-Z]/.test(password)) newPass += 'A';
  if (!/[a-z]/.test(password)) newPass += 'b';
  if (!/[0-9]/.test(password)) newPass += '7';
  if (!/[^A-Za-z0-9]/.test(password)) newPass += '@';

  for (let word of commonEndings) {
    if (password.endsWith(word)) {
      newPass = password.replace(word, '') + 'Secure!';
      break;
    }
  }

  if (password === newPass) return "Nice work! This looks strong.";
  else return `Try: <b>${newPass}</b> for better security.`;
}

async function checkBreach(pwd) {
  const breachCard = document.getElementById("breachCard");
  const breachStatus = document.getElementById("breachStatus");

  breachCard.classList.remove("hidden", "success", "warning");
  breachStatus.textContent = "Checking...";

  const hash = CryptoJS.SHA1(pwd).toString().toUpperCase();
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  try {
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await response.text();
    const found = text.includes(suffix);

    if (found) {
      breachStatus.textContent = " This password has been found in known data breaches!";
      breachCard.classList.add("warning");
    } else {
      breachStatus.textContent = " No known breach found for this password.";
      breachCard.classList.add("success");
    }
  } catch (error) {
    breachStatus.textContent = "⚠️ Could not connect to the breach database.";
    breachCard.classList.add("warning");
  }
}

document.getElementById("password").addEventListener("input", checkPassword);
document.getElementById("password").addEventListener("blur", () => {
  const pwd = document.getElementById("password").value;
  if (pwd.length > 0) checkBreach(pwd);
});
