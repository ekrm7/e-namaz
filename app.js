async function namazVakitleriniGetir() {
    const city = "Istanbul";
    const country = "TR";
    const method = 13;

    const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`;

    try {
        const response = await fetch(url);
        const fullData = await response.json();

        const vakitler = fullData.data.timings;

        const anaVakitler = {
            "Fajr": "İmsak",
            "Sunrise": "Güneş",
            "Dhuhr": "Öğle",
            "Asr": "İkindi",
            "Maghrib": "Akşam",
            "Isha": "Yatsı"
        };

        Object.entries(vakitler).forEach(([vakitAd, saat]) => {
            if (anaVakitler[vakitAd]) {
                const id = `${vakitAd.toLowerCase()}Vakti`

                const element = document.querySelector(`#${id}`);
                
                if (element) {
                    element.textContent = saat;
                }
            }
        })

    } catch (error) {
        console.error("Vakitler alınırken bir hata oluştu.", error);
    }
}

namazVakitleriniGetir();