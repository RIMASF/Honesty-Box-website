// timeline.js

class Timeline {
    constructor() {
        this.api = "http://localhost:4000/api";
    }

    async getAll() {
        const token = localStorage.getItem("token");

        if (!token) {
            // لو ما في توكن، رجّع المستخدم لتسجيل الدخول
            alert("انتهت الجلسة، فضلاً سجلي الدخول من جديد.");
            window.location.href = "login.html";
            return { ok: false, answers: [] };
        }

        const res = await fetch(`${this.api}/answers`, {
            headers: { Authorization: "Bearer " + token }
        });

        return await res.json();
    }
}

// نشغل الكود بعد ما الصفحة تجهز
document.addEventListener("DOMContentLoaded", async () => {
    const box = document.getElementById("timeline-container");
    if (!box) return;

    const t = new Timeline();

    try {
        const data = await t.getAll();

        // لو صار خطأ في الـ API
        if (!data || data.ok === false) {
            box.innerHTML = `<p class="text-danger small">تعذر تحميل سجل الاعترافات.</p>`;
            return;
        }

        if (!Array.isArray(data.answers) || data.answers.length === 0) {
            box.innerHTML = `<p class="small text-secondary">لا توجد اعترافات حتى الآن 🩷</p>`;
            return;
        }

        // إنشاء الكروت
        data.answers.forEach(item => {
            const card = document.createElement("div");
            // نستخدم نفس ستايل المثال في HTML
            card.className = "card-glass-light p-3";

            card.innerHTML = `
                <div class="d-flex justify-content-between mb-1">
                    <span class="small text-secondary">التاريخ</span>
                    <span class="small text-secondary">${item.date}</span>
                </div>
                <p class="mb-1 fw-semibold timeline-question">${item.question}</p>
                <p class="mb-0 small timeline-answer">${item.answer}</p>
                <div class="text-secondary small mt-2">
                    <strong>عمق الإجابة:</strong> ${item.depth} <br>
                    <strong>كلمات صريحة:</strong> ${item.honestyCount}
                </div>
            `;

            box.appendChild(card);
        });

    } catch (err) {
        console.error("Error loading timeline:", err);
        box.innerHTML = `<p class="text-danger small">حدث خطأ أثناء تحميل السجل.</p>`;
    }
});
