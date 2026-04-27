const APP = {
    version: '2.0.0',
    steuerjahr: 2025,
    sprache: 'DE',
    datenbank: null,
    optimierer: null,
    aktiveId: null,
    letzteBerechnung: null,
    steuerWorker: null
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        APP.datenbank = new SteuerDatenbank();
        await APP.datenbank.initialisieren();

        APP.steuerWorker = new Worker('workers/steuerWorker.js');
        APP.steuerWorker.onmessage = (e) => {
            const { daten } = e.data;
            if (daten) {
                APP.letzteBerechnung = daten;
                updateUI(daten);
            }
        };

        APP.optimierer = new SteuerOptimierer();
        initEvents();

        if (typeof hilfe !== 'undefined' && hilfe.init) {
            hilfe.init();
        }

        const id = localStorage.getItem('aktive_erklaerung_id_2025');
        if (id) {
            APP.aktiveId = id;
        } else {
            APP.aktiveId = await APP.datenbank.neueErklaerungErstellen({ jahr: 2025 });
            localStorage.setItem('aktive_erklaerung_id_2025', APP.aktiveId);
        }

        document.getElementById('loading-screen')?.classList.add('hidden');
    } catch (error) {
        console.error('Fehler bei Initialisierung:', error);
        document.getElementById('loading-screen')?.classList.add('hidden');
    }
});

function initEvents() {
    document.getElementById('einkommen-a')?.addEventListener('input', () => berechnen());
    document.getElementById('einkommen-b')?.addEventListener('input', () => berechnen());

    document.getElementById('btn-zusammen')?.addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('btn-einzeln')?.classList.remove('active');
        berechnen();
    });

    document.getElementById('btn-einzeln')?.addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('btn-zusammen')?.classList.remove('active');
        berechnen();
    });

    document.querySelectorAll('.lang-btn').forEach(b => {
        b.addEventListener('click', () => {
            const sprache = b.dataset.lang;
            if (typeof I18N !== 'undefined') {
                I18N.setSprache(sprache);
            }
            APP.sprache = sprache;
        });
    });
}

function berechnen() {
    const a = parseFloat(document.getElementById('einkommen-a')?.value) || 0;
    const b = parseFloat(document.getElementById('einkommen-b')?.value) || 0;
    if (a === 0 && b === 0) return;

    if (APP.steuerWorker) {
        APP.steuerWorker.postMessage({
            aktion: 'VERGLEICH',
            daten: { einkommenA: a, einkommenB: b }
        });
    }
}

function updateUI(vergleich) {
    const istZusammen = document.getElementById('btn-zusammen')?.classList.contains('active');
    const daten = istZusammen ? vergleich.zusammenveranlagung : vergleich.einzelveranlagung;

    const format = (wert) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(wert || 0);
    };

    const elSteuer = document.getElementById('wert-steuer');
    const elSoli = document.getElementById('wert-soli');
    const elGesamt = document.getElementById('wert-gesamt');

    if (elSteuer) elSteuer.textContent = format(daten.details?.einkommensteuer);
    if (elSoli) elSoli.textContent = format(daten.details?.solidaritaetszuschlag);
    if (elGesamt) elGesamt.textContent = format(daten.details?.gesamtbelastung);

    const box = document.getElementById('empfehlung-box');
    const text = document.getElementById('empfehlung-text');

    if (box && text) {
        if (vergleich.vorteil > 50) {
            box.classList.remove('hidden');
            text.textContent = 'Zusammenveranlagung spart ca. ' + Math.round(vergleich.vorteil) + ' EUR (2025).';
        } else if (vergleich.vorteil < -50) {
            box.classList.remove('hidden');
            box.classList.add('warnung');
            text.textContent = 'Einzelveranlagung ist um ca. ' + Math.round(Math.abs(vergleich.vorteil)) + ' EUR gunstiger.';
        } else {
            box.classList.add('hidden');
        }
    }
}