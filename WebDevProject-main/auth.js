// auth.js

class Auth {
    constructor() {
        this.api = "http://localhost:4000/api";
    }

    async register(name, email, password) {
        const res = await fetch(`${this.api}/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name, email, password })
        });

        return await res.json();
    }

    async login(email, password) {
        const res = await fetch(`${this.api}/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email, password })
        });

        return await res.json();
    }
}

// =========================
// REGISTER PAGE HANDLER
// =========================
if (document.getElementById("register-btn")) {

    document.getElementById("register-btn").onclick = async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const auth = new Auth();
        const data = await auth.register(name, email, password);

        if (data.ok) {
            alert("تم إنشاء الحساب بنجاح!");
            window.location.href = "login.html";
        } else {
            alert("خطأ: " + data.msg);
        }
    };
}

// =========================
// LOGIN PAGE HANDLER
// =========================
if (document.getElementById("login-btn")) {

    document.getElementById("login-btn").onclick = async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const auth = new Auth();
        const data = await auth.login(email, password);

        if (data.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = "question.html";
        } else {
            alert("خطأ في تسجيل الدخول");
        }
    };
}
