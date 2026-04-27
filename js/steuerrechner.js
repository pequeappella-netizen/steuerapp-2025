const STEUERDATEN_2025 = {
    grundfreibetrag: 12096,
    kinderfreibetrag: 6672,
    kindergeldJaehrlich: 3060,
    zone1: { bis: 12096, satz: 0 },
    zone2: { von: 12097, bis: 17443, koeffizienten: { a: 980.14, b: 1400 } },
    zone3: { von: 17444, bis: 68481, koeffizienten: { a: 216.16, b: 2397, c: 1014 } },
    zone4: { von: 68482, bis: 277825, satz: 0.42, abzug: 10602.13 },
    zone5: { ab: 277826, satz: 0.45, abzug: 18936.88 },
    soliSchwelleEinzeln: 18610,
    soliSchwelleZusammen: 37220,
    soliSatz: 0.055,
    soliMilderungsfaktor: 0.119,
    kirchensteuerSaetze: { bayern: 0.08, standard: 0.09 }
};

class Steuerrechner {
    static berechneEinkommensteuer(zvE, splitting = false) {
        const d = STEUERDATEN_2025;
        if (splitting) {
            const steuerHalbe = this._berechneTarif2025(Math.floor(zvE / 2));
            const est = steuerHalbe * 2;
            const soli = this._soli(est, true);
            const kiSt = this._kiSt(est);
            return {
                methode: 'Splittingverfahren',
                veranlagungsjahr: 2025,
                zvE: zvE,
                einkommensteuer: Math.round(est * 100) / 100,
                grenzsteuersatz: this._grenz(Math.floor(zvE / 2)),
                solidaritaetszuschlag: Math.round(soli * 100) / 100,
                kirchensteuer: Math.round(kiSt * 100) / 100,
                gesamtbelastung: Math.round((est + soli + kiSt) * 100) / 100
            };
        } else {
            const x = Math.floor(zvE);
            const est = this._berechneTarif2025(x);
            const soli = this._soli(est, false);
            const kiSt = this._kiSt(est);
            return {
                methode: 'Grundtarif',
                veranlagungsjahr: 2025,
                zvE: zvE,
                einkommensteuer: Math.round(est * 100) / 100,
                grenzsteuersatz: this._grenz(x),
                solidaritaetszuschlag: Math.round(soli * 100) / 100,
                kirchensteuer: Math.round(kiSt * 100) / 100,
                gesamtbelastung: Math.round((est + soli + kiSt) * 100) / 100
            };
        }
    }

    static _berechneTarif2025(x) {
        const d = STEUERDATEN_2025;
        if (x <= d.zone1.bis) return 0;
        if (x <= d.zone2.bis) {
            const y = (x - d.zone1.bis) / 10000;
            return (d.zone2.koeffizienten.a * y + d.zone2.koeffizienten.b) * y;
        }
        if (x <= d.zone3.bis) {
            const y = (x - d.zone3.von) / 10000;
            return (d.zone3.koeffizienten.a * y + d.zone3.koeffizienten.b) * y + d.zone3.koeffizienten.c;
        }
        if (x <= d.zone4.bis) {
            return d.zone4.satz * x - d.zone4.abzug;
        }
        return d.zone5.satz * x - d.zone5.abzug;
    }

    static _grenz(x) {
        if (x <= 12096) return 0;
        if (x <= 17443) return 22;
        if (x <= 68481) return 38;
        if (x <= 277825) return 42;
        return 45;
    }

    static _soli(est, zusammen) {
        const d = STEUERDATEN_2025;
        const fg = zusammen ? d.soliSchwelleZusammen : d.soliSchwelleEinzeln;
        if (est <= fg) return 0;
        if (est <= fg * 1.25) {
            return Math.min(est * d.soliSatz, (est - fg) * d.soliMilderungsfaktor);
        }
        return est * d.soliSatz;
    }

    static _kiSt(est, bundesland = 'standard') {
        const satz = STEUERDATEN_2025.kirchensteuerSaetze[bundesland] || STEUERDATEN_2025.kirchensteuerSaetze.standard;
        return est * satz;
    }

    static vergleichen(einkA, einkB) {
        const ez = this.berechneEinkommensteuer(einkA + einkB, true);
        const ea = this.berechneEinkommensteuer(einkA, false);
        const eb = this.berechneEinkommensteuer(einkB, false);
        const sumEinzel = ea.gesamtbelastung + eb.gesamtbelastung;
        const vorteil = sumEinzel - ez.gesamtbelastung;
        return {
            zusammen: ez.gesamtbelastung,
            einzeln: Math.round(sumEinzel * 100) / 100,
            empfehlung: vorteil > 0 ? 'ZUSAMMEN' : 'EINZELN',
            vorteil: Math.round(Math.abs(vorteil) * 100) / 100,
            zusammenveranlagung: { details: ez },
            einzelveranlagung: { details: { gesamtbelastung: sumEinzel } }
        };
    }
}