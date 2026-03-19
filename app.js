let vakitZamanlari = {};

async function namazVakitleriniGetir() {
    const city = "Istanbul";
    const country = "TR";
    const method = 13;
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`;

    try {
        const response = await fetch(url);
        const fullData = await response.json();
        const vakitler = fullData.data.timings;

        vakitZamanlari = {
            "İmsak": vakitler.Fajr,
            "Güneş": vakitler.Sunrise,
            "Öğle": vakitler.Dhuhr,
            "İkindi": vakitler.Asr,
            "Akşam": vakitler.Maghrib,
            "Yatsı": vakitler.Isha
        };

        // Kartları doldur
        document.getElementById("fajrVakti").textContent = vakitler.Fajr;
        document.getElementById("sunriseVakti").textContent = vakitler.Sunrise;
        document.getElementById("dhuhrVakti").textContent = vakitler.Dhuhr;
        document.getElementById("asrVakti").textContent = vakitler.Asr;
        document.getElementById("maghribVakti").textContent = vakitler.Maghrib;
        document.getElementById("ishaVakti").textContent = vakitler.Isha;

        // Sayacı başlat
        sayaciGuncelle();
        setInterval(sayaciGuncelle, 1000);

    } catch (error) {
        console.error("Hata:", error);
    }
}

function sayaciGuncelle() {
    const simdi = new Date();
    let enYakinVakit = null;
    let enYakinIsim = "";
    let minFark = Infinity;

    Object.entries(vakitZamanlari).forEach(([isim, saat]) => {
        const [h, m] = saat.split(':');
        const vakitTarihi = new Date();
        vakitTarihi.setHours(h, m, 0);

        let fark = vakitTarihi - simdi;

        // Eğer vakit geçtiyse yarına at (Yatsıdan sonra İmsak için)
        if (fark < 0) {
            vakitTarihi.setDate(vakitTarihi.getDate() + 1);
            fark = vakitTarihi - simdi;
        }

        if (fark < minFark) {
            minFark = fark;
            enYakinIsim = isim;
        }
    });

    // Farkı saat:dakika:saniye formatına çevir
    const saat = Math.floor(minFark / 3600000);
    const dakika = Math.floor((minFark % 3600000) / 60000);
    const saniye = Math.floor((minFark % 60000) / 1000);

    document.getElementById("vakitIsmi").textContent = `${enYakinIsim} Vaktine Kalan`;
    document.getElementById("sayac").textContent = 
        `${saat.toString().padStart(2, '0')}:${dakika.toString().padStart(2, '0')}:${saniye.toString().padStart(2, '0')}`;
}

namazVakitleriniGetir();
