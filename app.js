let vakitZamanlari = {};

window.onload = () => {
    namazVakitleriniGetir("Istanbul");
};

async function sehirDegisti() {
    const secilenSehir = document.getElementById("sehirSecici").value;
    await namazVakitleriniGetir(secilenSehir);
}

async function namazVakitleriniGetir(sehir) {
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${sehir}&country=TR&method=13`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const timings = data.data.timings;

        document.getElementById("fajrVakti").textContent = timings.Fajr;
        document.getElementById("sunriseVakti").textContent = timings.Sunrise;
        document.getElementById("dhuhrVakti").textContent = timings.Dhuhr;
        document.getElementById("asrVakti").textContent = timings.Asr;
        document.getElementById("maghribVakti").textContent = timings.Maghrib;
        document.getElementById("ishaVakti").textContent = timings.Isha;

        vakitZamanlari = {
            "İmsak": timings.Fajr,
            "Güneş": timings.Sunrise,
            "Öğle": timings.Dhuhr,
            "İkindi": timings.Asr,
            "Akşam": timings.Maghrib,
            "Yatsı": timings.Isha
        };

        startTimer();

    } catch (error) {
        console.error("Hata:", error);
    }
}

function startTimer() {
    if (window.vakitInterval) clearInterval(window.vakitInterval);

    window.vakitInterval = setInterval(() => {
        const simdi = new Date();
        let enYakinFark = Infinity;
        let hedefIsim = "";

        Object.entries(vakitZamanlari).forEach(([isim, saat]) => {
            const [h, m] = saat.split(':');
            let vTarih = new Date();
            vTarih.setHours(parseInt(h), parseInt(m), 0);

            let fark = vTarih - simdi;
            if (fark < 0) {
                vTarih.setDate(vTarih.getDate() + 1);
                fark = vTarih - simdi;
            }

            if (fark < enYakinFark) {
                enYakinFark = fark;
                hedefIsim = isim;
            }
        });

        const saat = Math.floor(enYakinFark / 3600000);
        const dakika = Math.floor((enYakinFark % 3600000) / 60000);
        const saniye = Math.floor((enYakinFark % 60000) / 1000);

        document.getElementById("vakitIsmi").textContent = `${hedefIsim} Vaktine Kalan`;
        document.getElementById("sayac").textContent = 
            `${saat.toString().padStart(2, '0')}:${dakika.toString().padStart(2, '0')}:${saniye.toString().padStart(2, '0')}`;
    }, 1000);
}
