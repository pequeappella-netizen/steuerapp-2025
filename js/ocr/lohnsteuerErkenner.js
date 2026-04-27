class LohnsteuerErkenner {
    constructor() {
        this.felder = {
            3: { de: 'Bruttoarbeitslohn', regex: /Bruttoarbeitslohn[:\s]*([\d.,]+)/i },
            4: { de: 'Einbehaltene Lohnsteuer', regex: /Einbehaltene Lohnsteuer[:\s]*([\d.,]+)/i },
            5: { de: 'Solidaritatszuschlag', regex: /Solidaritatszuschlag[:\s]*([\d.,]+)/i },
            6: { de: 'Kirchensteuer', regex: /Kirchensteuer[:\s]*([\d.,]+)/i },
            23: { de: 'RV-Beitrag Arbeitnehmer', regex: /Rentenversicherung.*Arbeitnehmer[:\s]*([\d.,]+)/i },
            25: { de: 'KV-Beitrag Arbeitnehmer', regex: /Krankenversicherung.*Arbeitnehmer[:\s]*([\d.,]+)/i }
        };
    }

    analysieren(ocrText) {
        const ergebnis = {
            gefundeneFelder: {},
            konfidenz: {},
            fehlendeFelder: []
        };

        for (const [nummer, feld] of Object.entries(this.felder)) {
            const match = ocrText.match(feld.regex);
            if (match && match[1]) {
                ergebnis.gefundeneFelder[nummer] = {
                    wert: this._parseWaehrung(match[1]),
                    bezeichnung: feld.de
                };
                ergebnis.konfidenz[nummer] = 0.9;
            } else {
                ergebnis.fehlendeFelder.push({ nummer, bezeichnung: feld.de });
            }
        }

        ergebnis.plausibilitaet = this._plausibilitaetspruefung(ergebnis);
        return ergebnis;
    }

    _parseWaehrung(text) {
        let sauber = text.replace(/[€EUR\s]/g, '');
        sauber = sauber.replace(/\./g, '').replace(',', '.');
        return parseFloat(sauber) || 0;
    }

    _plausibilitaetspruefung(ergebnis) {
        const pruefungen = [];
        const f = ergebnis.gefundeneFelder;
        if (f[3] && f[4]) {
            pruefungen.push({
                test: 'Lohnsteuer < Brutto',
                bestanden: f[4].wert < f[3].wert
            });
        }
        if (f[3] && f[23]) {
            const erwartet = f[3].wert * 0.093;
            pruefungen.push({
                test: 'RV-Beitrag ca. 9,3% Brutto',
                bestanden: Math.abs(f[23].wert - erwartet) / erwartet < 0.1
            });
        }
        return pruefungen;
    }
}