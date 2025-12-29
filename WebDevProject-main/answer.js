/// answer.js

class Answer {
    constructor() {
        // Backend API base URL
        this.api = "http://localhost:4000/api";
    }

    async submit(question, answer, depth, honestyCount) {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("انتهت صلاحية الجلسة، سجلي الدخول من جديد.");
            window.location.href = "login.html";
            return { ok: false };
        }

        try {
            const res = await fetch(`${this.api}/answer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify({
                    question,
                    answer,
                    depth,
                    honestyCount
                })
            });

            return await res.json();
        } catch (err) {
            console.error("Error sending answer:", err);
            alert("حدث خطأ في الاتصال بالسيرفر.");
            return { ok: false };
        }
    }
}

// =======================
// زر إرسال الإجابة
// =======================
if (document.getElementById("submit-answer")) {
    document.getElementById("submit-answer").onclick = async () => {
        const questionEl = document.getElementById("question-text");
        const answerEl = document.getElementById("answer-input");
        const resultEl = document.getElementById("result-msg");

        const question = questionEl ? questionEl.innerText.trim() : "";
        const answer = answerEl ? answerEl.value.trim() : "";

        if (!answer) {
            alert("اكتبي إجابة أولاً.");
            return;
        }

        // حساب عمق الإجابة (عدد الحروف)
        const depth = answer.length;

        // قائمة الكلمات الدالة على الصراحة
        const honestyWords = [
            // صراحة مباشرة
            "بصراحة", "صراحه", "صراحةً", "الحقيقة", "أقول الحقيقة",
            "أكون صريحة", "بأكون صريحة", "بكون صريحة", "خليني أكون صريحة",

            // الاعتراف
            "أعترف", "اعترف", "اعتراف", "اعترافي",
            "لازم أعترف", "ودي أعترف",

            // الفضفضة/فتح القلب
            "بفتح قلبي", "بفضفض", "خل أفضفض", "ودي أفضفض",
            "أقول شعور", "ودي أقول شيء",
            "خل أكون واضحة", "أكون واضحة", "خليني أكون واضحة",

            // الأمانة/الصدق
            "صادقة", "صدق", "أقول صدق", "أكون صادقة", "بكون صادقة",

            // الاعترافات الجريئة
            "شي ما قلت لأحد", "ما قلت لأحد",
            "أول مرة أقول", "أول مرة أذكر",
            "شي أخبيه", "كنت أخبيه",
            "ما أبغى أقوله بس", "ودي أقوله"
        ];

        // حساب عدد الكلمات الصريحة
        let honestyCount = 0;
        honestyWords.forEach(word => {
            if (answer.includes(word)) honestyCount++;
        });

        const a = new Answer();
        const data = await a.submit(question, answer, depth, honestyCount);

        if (data && data.ok) {
            resultEl.innerText = "تم حفظ إجابتك 💗";
            answerEl.value = "";
        } else {
            resultEl.innerText = "ما تم إرسال الإجابة. حاولي مرة أخرى.";
        }
    };
}
