// profile.js

class Profile {
    constructor() {
        this.api = "http://localhost:4000/api";
    }

    async load() {
        const token = localStorage.getItem("token");

        const res = await fetch(`${this.api}/profile`, {
            headers: { Authorization: "Bearer " + token }
        });

        return await res.json();
    }
}

if (document.getElementById("user-name")) {
    window.onload = async () => {
        const p = new Profile();
        const data = await p.load();

        document.getElementById("user-name").innerText = data.name;
        document.getElementById("days-count").innerText = data.days;
        document.getElementById("honesty-rate").innerText = data.rate + "%";
        document.getElementById("avg-depth").innerText = data.avgDepth;
        document.getElementById("total-honesty").innerText = data.totalHonestyWords;
        document.getElementById("honesty-score").innerText = data.honestyScore + "%";

    };
}
