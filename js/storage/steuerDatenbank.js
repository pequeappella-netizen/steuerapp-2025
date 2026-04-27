class SteuerDatenbank {
    constructor() {
        this.db = null;
        this.DB_NAME = 'SteuerApp2025_DB';
        this.DB_VERSION = 1;
    }

    async initialisieren() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('erklaerungen')) {
                    db.createObjectStore('erklaerungen', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('personen')) {
                    db.createObjectStore('personen', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('berechnungen')) {
                    db.createObjectStore('berechnungen', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('backups')) {
                    db.createObjectStore('backups', { keyPath: 'id' });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async speichern(storeName, daten) {
        await this._ensureDB();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            if (!daten.metadata) daten.metadata = {};
            daten.metadata.letzteAenderung = new Date().toISOString();
            const request = store.put(daten);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async laden(storeName, id) {
        await this._ensureDB();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }

    async neueErklaerungErstellen(daten) {
        const erklaerungId = crypto.randomUUID();
        const erklaerung = {
            id: erklaerungId,
            veranlagungsjahr: daten.jahr || 2025,
            veranlagungsart: daten.veranlagungsart || 'ZUSAMMEN',
            status: 'ENTWURF',
            metadata: {
                erstelltAm: new Date().toISOString(),
                letzteAenderung: new Date().toISOString(),
                version: 1
            }
        };
        await this.speichern('erklaerungen', erklaerung);
        return erklaerungId;
    }

    async personSpeichern(erklaerungId, personKey, personDaten) {
        const personId = `${erklaerungId}_PERSON_${personKey}`;
        const person = {
            id: personId,
            erklaerungId: erklaerungId,
            personKey: personKey,
            ...personDaten
        };
        await this.speichern('personen', person);
        return personId;
    }

    async berechnungSpeichern(erklaerungId, berechnungsDaten) {
        const berechnungId = crypto.randomUUID();
        const berechnung = {
            id: berechnungId,
            erklaerungId: erklaerungId,
            zeitstempel: new Date().toISOString(),
            ...berechnungsDaten
        };
        await this.speichern('berechnungen', berechnung);
        return berechnungId;
    }

    async _ensureDB() {
        if (!this.db) {
            await this.initialisieren();
        }
    }
}