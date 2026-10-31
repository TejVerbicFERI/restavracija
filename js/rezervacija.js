"use strict";

const DELOVNI_CAS = {
    0: { od: "12:00", do: "19:00" }, 
    2: { od: "11:00", do: "21:00" }, 
    3: { od: "11:00", do: "21:00" },
    4: { od: "11:00", do: "21:00" },
    5: { od: "11:00", do: "21:00" },
    6: { od: "12:00", do: "22:00" }  
};

const REGEX_EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const REGEX_TELEFON = /^(0[1-9]\d \d{3} \d{3}|0[1-9]\d{7})$/;
const REGEX_BESEDA = /^\p{L}[\p{L}'-]*\p{L}$/u;

const form = document.querySelector("form");
const polja = {
    ime: document.getElementById("ime"),
    email: document.getElementById("email"),
    telefon: document.getElementById("telefon"),
    datum: document.getElementById("datum"),
    ura: document.getElementById("ura"),
    osebe: document.getElementById("osebe"),
    soglasje: document.getElementById("soglasje")
};

function preveriIme(vrednost) {
    const besede = vrednost.trim().split(/\s+/).filter(b => b !== "");
    if (besede.length < 2 || !besede.every(b => REGEX_BESEDA.test(b))) {
        return "Vnesite ime in priimek (vsaka beseda naj ima vsaj dve črki).";
    }
    return "";
}

function preveriEmail(vrednost) {
    return REGEX_EMAIL.test(vrednost.trim()) ? "" : "Vnesite veljaven e-poštni naslov, npr. janez.novak@primer.si.";
}

function preveriTelefon(vrednost) {
    return REGEX_TELEFON.test(vrednost.trim()) ? "" : "Vnesite telefonsko številko v obliki 040 123 456 ali 040123456.";
}

function preveriDatum(vrednost) {
    if (vrednost === "") {
        return "Izberite datum.";
    }
    const izbran = new Date(vrednost + "T00:00:00");
    const danes = new Date();
    danes.setHours(0, 0, 0, 0);

    if (isNaN(izbran.getTime())) {
        return "Izberite veljaven datum.";
    }
    if (izbran < danes) {
        return "Datum ne sme biti v preteklosti.";
    }
    if (izbran.getDay() === 1) {
        return "Ob ponedeljkih je restavracija zaprta. Izberite drug dan.";
    }
    return "";
}

function preveriUro(vrednost) {
    if (vrednost === "") {
        return "Izberite uro.";
    }
    if (polja.datum.value === "") {
        return "";
    }
    const dan = new Date(polja.datum.value + "T00:00:00").getDay();
    const cas = DELOVNI_CAS[dan];
    if (!cas) {
        return "";
    }
    if (vrednost < cas.od || vrednost > cas.do) {
        return "Ura mora biti med " + cas.od + " in " + cas.do + " (za ta dan).";
    }
    return "";
}

function preveriOsebe(vrednost) {
    const v = vrednost.trim();
    if (!/^\d+$/.test(v) || Number(v) < 1 || Number(v) > 12) {
        return "Število oseb mora biti celo število med 1 in 12.";
    }
    return "";
}

function preveriSoglasje() {
    return polja.soglasje.checked ? "" : "Za pošiljanje se morate strinjati z obdelavo osebnih podatkov.";
}

const preverjanja = {
    ime: () => preveriIme(polja.ime.value),
    email: () => preveriEmail(polja.email.value),
    telefon: () => preveriTelefon(polja.telefon.value),
    datum: () => preveriDatum(polja.datum.value),
    ura: () => preveriUro(polja.ura.value),
    osebe: () => preveriOsebe(polja.osebe.value),
    soglasje: () => preveriSoglasje()
};

function pobrisiNapako(polje) {
    polje.classList.remove("napaka");
    const sporocilo = document.getElementById("napaka-" + polje.id);
    if (sporocilo) {
        sporocilo.remove();
    }
    if (polje.type === "checkbox") {
        const oznaka = document.querySelector('label[for="' + polje.id + '"]');
        if (oznaka) oznaka.classList.remove("napaka");
    }
}

function prikaziNapako(polje, besedilo) {
    pobrisiNapako(polje);
    polje.classList.add("napaka");

    const sporocilo = document.createElement("span");
    sporocilo.className = "sporocilo-napaka";
    sporocilo.id = "napaka-" + polje.id;
    sporocilo.textContent = besedilo;

    let mesto = polje;
    if (polje.type === "checkbox") {
        const oznaka = document.querySelector('label[for="' + polje.id + '"]');
        if (oznaka) {
            oznaka.classList.add("napaka");
            mesto = oznaka;
        }
    }
    mesto.insertAdjacentElement("afterend", sporocilo);
}

function validirajPolje(ime) {
    const napaka = preverjanja[ime]();
    if (napaka) {
        prikaziNapako(polja[ime], napaka);
        return false;
    }
    pobrisiNapako(polja[ime]);
    return true;
}

Object.keys(polja).forEach(function (ime) {
    polja[ime].addEventListener("input", function () {
        validirajPolje(ime);
        if (ime === "datum" && polja.ura.value !== "") {
            validirajPolje("ura");
        }
    });
});

function formatirajDatum(vrednost) {
    const [l, m, d] = vrednost.split("-");
    return Number(d) + ". " + Number(m) + ". " + l;
}

function pobrisiPovzetek() {
    const star = document.getElementById("povzetek");
    if (star) star.remove();
}

form.addEventListener("submit", function (e) {
    e.preventDefault(); 
    pobrisiPovzetek();

    let vseVeljavno = true;
    Object.keys(polja).forEach(function (ime) {
        if (!validirajPolje(ime)) {
            vseVeljavno = false;
        }
    });

    if (!vseVeljavno) {
        return;
    }

    const povzetek = document.createElement("section");
    povzetek.id = "povzetek";
    povzetek.setAttribute("role", "status");

    const naslov = document.createElement("h2");
    naslov.textContent = "Povzetek rezervacije";

    const seznam = document.createElement("ul");
    const vrstice = [
        ["Ime in priimek", polja.ime.value.trim().replace(/\s+/g, " ")],
        ["Datum", formatirajDatum(polja.datum.value)],
        ["Ura", polja.ura.value],
        ["Število oseb", String(Number(polja.osebe.value))]
    ];
    vrstice.forEach(function (par) {
        const li = document.createElement("li");
        const krepko = document.createElement("strong");
        krepko.textContent = par[0] + ": ";
        li.appendChild(krepko);
        li.appendChild(document.createTextNode(par[1]));
        seznam.appendChild(li);
    });

    povzetek.appendChild(naslov);
    povzetek.appendChild(seznam);
    form.insertAdjacentElement("afterend", povzetek);
});


form.addEventListener("reset", function () {
    Object.values(polja).forEach(pobrisiNapako);
    pobrisiPovzetek();
});