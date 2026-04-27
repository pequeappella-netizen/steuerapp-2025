class DokumentenScanner {
    constructor() {
        this.erkenner = new LohnsteuerErkenner();
    }

    async scanDokument(bildDaten) {
        this.updateStatus('scannend', 0);
        await this._sleep(500);
        this.updateStatus('ocr', 50);
        await this._sleep(500);
        this.updateStatus('analysiere', 80);

        const simulierterText = 'Bruttoarbeitslohn: 65.000,00\nEinbehaltene Lohnsteuer: 14.500,00\nSolidaritatszuschlag: 0,00\nRentenversicherung Arbeitnehmer: 6.045,00\nKrankenversicherung Arbeitnehmer: 4.800,00';

        const ergebnis = this.erkenner.analysieren(simulierterText);
        this.updateStatus('fertig', 100);

        return {
            erfolg: true,
            daten: ergebnis,
            text: simulierterText
        };
    }

    updateStatus(status, prozent) {
        const statusEl = document.getElementById('scan-status');
        const progressEl = document.getElementById('scan-progress');
        if (statusEl) statusEl.textContent = status;
        if (progressEl) progressEl.style.width = prozent + '%';
    }

    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}