importScripts('../js/steuerrechner.js');

self.onmessage = function(e) {
    const { aktion, daten } = e.data;

    if (aktion === 'VERGLEICH') {
        const ergebnis = Steuerrechner.vergleichen(daten.einkommenA, daten.einkommenB);
        self.postMessage({
            typ: 'VERGLEICH',
            daten: ergebnis
        });
    }
};