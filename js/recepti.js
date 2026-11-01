"use strict";

document.querySelectorAll("article[data-porcije]").forEach(function (recept) {
    const osnovnePorcije = Number(recept.dataset.porcije);
    const vnos = recept.querySelector(".porcije");
    const sestavine = recept.querySelectorAll("[data-kolicina]");

    vnos.addEventListener("input", function () {
        const vrednost = vnos.value.trim();

        if (!/^\d+$/.test(vrednost)) {
            return;
        }
        const porcije = Number(vrednost);
        if (porcije < 1 || porcije > 12) {
            return;
        }

        sestavine.forEach(function (el) {
            const original = Number(el.dataset.kolicina);
            const nova = Math.round(original * porcije / osnovnePorcije * 10) / 10;
            el.textContent = String(nova).replace(".", ",");
        });
    });
});