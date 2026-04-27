class SyncManager {
    constructor(datenbank) {
        this.db = datenbank;
    }

    async transferPaketErstellen(erklaerungId, passwort) {
        const erklaerung = await this.db.laden('erklaerungen', erklaerungId);
        if (!erklaerung) throw new Error('Erklarung nicht gefunden');
        const paket = {
            version: '1.0',
            erstelltAm: new Date().toISOString(),
            erklaerungId: erklaerungId,
            daten: { erklaerung: erklaerung }
        };
        const serialisiert = JSON.stringify(paket);
        return {
            format: 'STEUERAPP2025_TRANSFER',
            paket: serialisiert,
            checksumme: await this._sha256(serialisiert)
        };
    }

    async transferPaketEmpfangen(paketDaten) {
        const paket = JSON.parse(paketDaten.paket);
        if (paket.daten.erklaerung) {
            await this.db.speichern('erklaerungen', paket.daten.erklaerung);
        }
        return { status: 'ERFOLG', erklaerungId: paket.erklaerungId };
    }

    async _sha256(text) {
        const encoder = new TextEncoder();
        const daten = encoder.encode(text);
        const hash = await crypto.subtle.digest('SHA-256', daten);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
}