let vakitZamanlari = {};

function konumuAlVeBaslat() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                namazVakitleriniGetir(lat, lng);
            },
            (error) => {
                console.warn("Konum izni reddedildi, varsayılan şehir yükleniyor.");
                namazVakitleriniGetirVarsayilan();
            }
        );
    } else {
        namazVakitleriniGetirVarsayilan();
    }
}

async function namazVakitleriniGetir(lat, lng) {
    const method = 13;
    const url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=${method}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        vakitleriEkranaBas(data.data.timings);
    } catch (error) {
        console.error("Vakitler yüklenemedi:", error);
    }
}

async function namazVakitleriniGetirVarsayilan() {
    const url = `https://api.aladhan.com/v1/timingsByCity?city=Istanbul&country=TR&method=13`;
    const response = await fetch(url);
    const data = await response.json();
    vakitleriEkranaBas(data.data.timings);
}

function vakitleriEkranaBas(timings) {
    const map = {
        "Fajr": "fajrVakti",
        "Sunrise": "sunriseVakti",
        "Dhuhr": "dhuhrVakti",
        "Asr": "asrVakti",
        "Maghrib": "maghribVakti",
        "Isha": "ishaVakti"
    };

    vakitZamanlari = {
        "İmsak": timings.Fajr,
        "Güneş": timings.Sunrise,
        "Öğle": timings.Dhuhr,
        "İkindi": timings.Asr,
        "Akşam": timings.Maghrib,
        "Yatsı": timings.Isha
    };

    Object.entries(map).forEach(([apiName, elementId]) => {
        document.getElementById(elementId).textContent = timings[apiName];
    });

    startTimer();
}

function startTimer() {
    if (window.vakitInterval) clearInterval(window.vakitInterval);

    window.vakitInterval = setInterval(() => {
        const simdi = new Date();
        let hedefVakit = null;
        let hedefIsim = "";
        let minFark = Infinity;

        Object.entries(vakitZamanlari).forEach(([isim, saat]) => {
            const [h, m] = saat.split(':');
            let vTarih = new Date();
            vTarih.setHours(parseInt(h), parseInt(m), 0);

            let fark = vTarih - simdi;
            if (fark < 0) {
                vTarih.setDate(vTarih.getDate() + 1);
                fark = vTarih - simdi;
            }

            if (fark < minFark) {
                minFark = fark;
                hedefIsim = isim;
            }
        });

        const saat = Math.floor(minFark / 3600000);
        const dakika = Math.floor((minFark % 3600000) / 60000);
        const saniye = Math.floor((minFark % 60000) / 1000);

        document.getElementById("vakitIsmi").textContent = `${hedefIsim} Vaktine Kalan`;
        document.getElementById("sayac").textContent = 
            `${saat.toString().padStart(2, '0')}:${dakika.toString().padStart(2, '0')}:${saniye.toString().padStart(2, '0')}`;
    }, 1000);
}

konumuAlVeBaslat();
