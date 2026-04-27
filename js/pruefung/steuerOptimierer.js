class SteuerOptimierer {
    constructor() {
        this.wissensbasis = {
            grenzen: {
                werbungskostenPauschbetrag: 1330,
                unterhaltshoechstbetrag: 11196,
                kinderbetreuungMax: 4000,
                riesterGrundzulage: 200,
                riesterKinderzulage: 360
            }
        };
    }

    async vollstaendigePruefung(steuerDaten) {
        const ergebnisse = {
            gefundeneOptimierungen: [],
            warnungen: [],
            fehler: [],
            potenzielleErsparnis: 0
        };

        const einkommen = (steuerDaten.A?.einkommen || 0) + (steuerDaten.B?.einkommen || 0);
        const unterschied = Math.abs((steuerDaten.A?.einkommen || 0) - (steuerDaten.B?.einkommen || 0));

        if (unterschied > 10000) {
            const vorteil = Math.round(unterschied * 0.08);
            ergebnisse.gefundeneOptimierungen.push({
                typ: 'OPTIMIERUNG',
                prioritaet: 'KRITISCH',
                titel: { de: 'Splitting-Vorteil prufen', es: 'Revisar ventaja de Splitting' },
                potenzielleErsparnis: vorteil
            });
            ergebnisse.potenzielleErsparnis += vorteil;
        }

        if (!steuerDaten.haushalt) {
            ergebnisse.gefundeneOptimierungen.push({
                typ: 'HINWEIS',
                titel: { de: 'Haushaltsnahe Dienstleistungen', es: 'Servicios domesticos' },
                potenzielleErsparnis: 2000
            });
            ergebnisse.potenzielleErsparnis += 2000;
        }

        if (steuerDaten.unterhaltszahlungen && steuerDaten.unterhaltszahlungen.zahlungsart !== 'BANKUEBERWEISUNG') {
            ergebnisse.warnungen.push({
                typ: 'WARNUNG',
                prioritaet: 'KRITISCH',
                titel: { de: 'Unterhalt 2025: Nur Bankuberweisung!', es: 'Manutencion 2025: Solo transferencia!' }
            });
        }

        return ergebnisse;
    }
}