var I18N = {};
I18N.sprache = 'de';
I18N.texte = {};
I18N.texte.de = {};
I18N.texte.de.appName = 'SteuerApp 2025';
I18N.texte.de.individual = 'Einzelveranlagung';
I18N.texte.de.conjunta = 'Zusammenveranlagung';
I18N.texte.de.veranlagungsartWahl = 'Wahl der Veranlagungsart';
I18N.texte.de.personA = 'Person A';
I18N.texte.de.personB = 'Person B';
I18N.texte.de.brutto = 'Bruttoarbeitslohn';
I18N.texte.de.lohnsteuer = 'Einbehaltene Lohnsteuer';
I18N.texte.de.fahrtkosten = 'Fahrtkosten (km einfache Strecke)';
I18N.texte.de.arbeitsmittel = 'Arbeitsmittel';
I18N.texte.de.kvBeitrag = 'Krankenversicherung';
I18N.texte.de.rvBeitrag = 'Rentenversicherung';
I18N.texte.de.kinder = 'Kinder / Hijos';
I18N.texte.de.anzahlKinder = 'Anzahl Kinder';
I18N.texte.de.ergebnis = 'Ergebnis';
I18N.texte.de.einkommensteuer = 'Einkommensteuer';
I18N.texte.de.soli = 'Solidaritatszuschlag';
I18N.texte.de.gesamt = 'Gesamtbelastung';
I18N.texte.de.scan = 'Scan / Escaneo';
I18N.texte.de.optimierung = 'Optimierung';
I18N.texte.de.elster = 'ELSTER Export';
I18N.texte.de.pdf = 'PDF Export';
I18N.texte.de.funcionalidad = 'Funcionalidad disponible proximamente.';
I18N.texte.es = {};
I18N.texte.es.appName = 'SteuerApp 2025';
I18N.texte.es.individual = 'Declaracion individual';
I18N.texte.es.conjunta = 'Declaracion conjunta';
I18N.texte.es.veranlagungsartWahl = 'Eleccion del tipo de tributacion';
I18N.texte.es.personA = 'Persona A';
I18N.texte.es.personB = 'Persona B';
I18N.texte.es.brutto = 'Salario bruto';
I18N.texte.es.lohnsteuer = 'Impuesto retenido';
I18N.texte.es.fahrtkosten = 'Desplazamiento (km ida)';
I18N.texte.es.arbeitsmittel = 'Herramientas de trabajo';
I18N.texte.es.kvBeitrag = 'Seguro medico';
I18N.texte.es.rvBeitrag = 'Seguro de pension';
I18N.texte.es.kinder = 'Hijos';
I18N.texte.es.anzahlKinder = 'Numero de hijos';
I18N.texte.es.ergebnis = 'Resultado';
I18N.texte.es.einkommensteuer = 'Impuesto sobre la renta';
I18N.texte.es.soli = 'Recargo de solidaridad';
I18N.texte.es.gesamt = 'Carga fiscal total';
I18N.texte.es.scan = 'Escaneo';
I18N.texte.es.optimierung = 'Optimizacion';
I18N.texte.es.elster = 'Exportacion ELSTER';
I18N.texte.es.pdf = 'Exportacion PDF';
I18N.texte.es.funcionalidad = 'Funcionalidad disponible proximamente.';

I18N.t = function(key) {
    if (I18N.texte[I18N.sprache] && I18N.texte[I18N.sprache][key]) {
        return I18N.texte[I18N.sprache][key];
    }
    return key;
};

I18N.setSprache = function(sprache) {
    if (sprache === 'de' || sprache === 'DE') I18N.sprache = 'de';
    if (sprache === 'es' || sprache === 'ES') I18N.sprache = 'es';
    var elementos = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elementos.length; i++) {
        var key = elementos[i].getAttribute('data-i18n');
        if (key) {
            var traduccion = I18N.texte[I18N.sprache][key];
            if (traduccion) elementos[i].textContent = traduccion;
        }
    }
};

