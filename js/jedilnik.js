// Polje objektov z jedmi
const jedi = [
    {
        naziv: 'Pomladni zavitki',
        opis: 'Hrustljavi zavitki z zelenjavo in steklenimi rezanci, s sladko-pekočo omako.',
        kategorija: 'Predjedi',
        alergeni: 'Gluten, soja, sezam',
        cena: 6.50
    },
    {
        naziv: 'Gyoza',
        opis: 'Japonski cmoki s svinjskim nadevom, popečeni na ponvi, s sojino omako.',
        kategorija: 'Predjedi',
        alergeni: 'Gluten, soja, sezam',
        cena: 7.90
    },
    {
        naziv: 'Miso juha',
        opis: 'Lahka juha iz fermentirane sojine paste s tofujem, morskimi algami in mladim čebulčkom.',
        kategorija: 'Predjedi',
        alergeni: 'Soja',
        cena: 4.90
    },
    {
        naziv: 'Edamame',
        opis: 'Mladi sojini stroki, kuhani na pari in posuti z morsko soljo.',
        kategorija: 'Predjedi',
        alergeni: 'Soja',
        cena: 4.50
    },
    {
        naziv: 'Pho bo',
        opis: 'Vietnamska goveja juha z riževimi rezanci, tankimi rezinami govedine in svežimi zelišči.',
        kategorija: 'Glavne jedi',
        alergeni: 'Soja, ribe',
        cena: 12.90
    },
    {
        naziv: 'Pad thai s kozicami',
        opis: 'Ocvrti riževi rezanci s kozicami, jajcem, kalčki in praženimi arašidi.',
        kategorija: 'Glavne jedi',
        alergeni: 'Raki, jajca, arašidi, soja, ribe',
        cena: 13.50
    },
    {
        naziv: 'Zeleni tajski curry',
        opis: 'Piščanec v kremni kokosovi omaki z bazilikom, bambusom in jasminovim rižem.',
        kategorija: 'Glavne jedi',
        alergeni: 'Ribe, raki',
        cena: 13.90
    },
    {
        naziv: 'Teriyaki losos',
        opis: 'Na žaru pečen losos v glazuri teriyaki, s sezamom in zelenjavo na pari.',
        kategorija: 'Glavne jedi',
        alergeni: 'Ribe, gluten, soja, sezam',
        cena: 16.90
    },
    {
        naziv: 'Tofu s sezamom in zelenjavo',
        opis: 'Hrustljavi tofu z woka zelenjavo in sezamovo omako. Vegansko.',
        kategorija: 'Glavne jedi',
        alergeni: 'Soja, sezam',
        cena: 11.90
    },
    {
        naziv: 'Mochi sladoled',
        opis: 'Mehki riževi žepki, polnjeni s sladoledom iz zelenega čaja matcha.',
        kategorija: 'Sladice',
        alergeni: 'Mleko',
        cena: 6.50
    },
    {
        naziv: 'Mango z lepljivim rižem',
        opis: 'Sladek kokosov riž s svežim mangom. Brez glutena in vegansko.',
        kategorija: 'Sladice',
        alergeni: 'Brez alergenov',
        cena: 6.90
    },
    {
        naziv: 'Dorayaki',
        opis: 'Japonske palačinke, polnjene s sladko pasto iz rdečega fižola.',
        kategorija: 'Sladice',
        alergeni: 'Gluten, jajca, mleko',
        cena: 5.50
    },
    {
        naziv: 'Banane v testu',
        opis: 'Ocvrte banane v lahkem testu z medom in sezamom.',
        kategorija: 'Sladice',
        alergeni: 'Gluten, jajca, sezam',
        cena: 5.90
    }
];

// Funkcija formatira ceno v niz z vejico in simbolom za evro
function formatirajCeno(cena) {
    return cena.toFixed(2).replace('.', ',') + ' €';
}

//Funkcija ustvari HTML odsek s tabelo jedi za določeno kategorijo
function ustvariOdsekKategorije(imeKategorije, seznamJedi) {
    const section = document.createElement('section');

    const naslov = document.createElement('h2');
    naslov.textContent = imeKategorije;
    section.appendChild(naslov);

    const tabelaOvoj = document.createElement('div');
    tabelaOvoj.className = 'tabela-ovoj';

    const tabela = document.createElement('table');

    const caption = document.createElement('caption');
    caption.textContent = imeKategorije;
    tabela.appendChild(caption);

    const thead = document.createElement('thead');
    const glavaVrstica = document.createElement('tr');

    const stolpci = ['Jed', 'Opis', 'Alergeni', 'Cena'];
    stolpci.forEach(stolpec => {
        const th = document.createElement('th');
        th.textContent = stolpec;
        glavaVrstica.appendChild(th);
    });
    thead.appendChild(glavaVrstica);
    tabela.appendChild(thead);

    const tbody = document.createElement('tbody');
    seznamJedi.forEach(jed => {
        const vrstica = document.createElement('tr');

        const tdNaziv = document.createElement('td');
        tdNaziv.textContent = jed.naziv;
        vrstica.appendChild(tdNaziv);

        const tdOpis = document.createElement('td');
        tdOpis.textContent = jed.opis;
        vrstica.appendChild(tdOpis);

        const tdAlergeni = document.createElement('td');
        tdAlergeni.textContent = jed.alergeni;
        vrstica.appendChild(tdAlergeni);

        const tdCena = document.createElement('td');
        tdCena.textContent = formatirajCeno(jed.cena);
        vrstica.appendChild(tdCena);

        tbody.appendChild(vrstica);
    });

    tabela.appendChild(tbody);
    tabelaOvoj.appendChild(tabela);
    section.appendChild(tabelaOvoj);

    return section;
}

// Funkcija počisti vsebino jedilnika in glede na izbran filter zgradi ter prikaže ustrezne kategorije
function izrisiJedilnik(izbranaKategorija) {
    const vsebnik = document.getElementById('jedilnik');
    if (!vsebnik) {
        return;
    }

    while (vsebnik.firstChild) {
        vsebnik.removeChild(vsebnik.firstChild);
    }

    const seznamKategorij = ['Predjedi', 'Glavne jedi', 'Sladice'];

    seznamKategorij.forEach(kat => {
        if (izbranaKategorija === 'Vse' || izbranaKategorija === kat) {
            const jediVKategoriji = jedi.filter(j => j.kategorija === kat);
            if (jediVKategoriji.length > 0) {
                const odsek = ustvariOdsekKategorije(kat, jediVKategoriji);
                vsebnik.appendChild(odsek);
            }
        }
    });
}

// Funkcija nastavi poslušalce klikov na filtrirne gumbe in ob kliku posodobi prikaz jedilnika
function nastaviFiltre() {
    const gumbi = document.querySelectorAll('.gumb-filter');
    gumbi.forEach(gumb => {
        gumb.addEventListener('click', () => {

            gumbi.forEach(g => g.classList.remove('aktivno'));
            gumb.classList.add('aktivno');

            const kategorija = gumb.getAttribute('data-kategorija');
            izrisiJedilnik(kategorija);
        });
    });
}

// Funkcija zažene začetni izris jedilnika in nastavi gumbe za filtriranje
function inicializiraj() {
    izrisiJedilnik('Vse');
    nastaviFiltre();
}

document.addEventListener('DOMContentLoaded', inicializiraj);
