const AUSFUELLHILFE = {
    de: {
        veranlagungsart: {
            titel: 'Wahl der Veranlagungsart',
            text: 'Ehepaare und eingetragene Lebenspartner können zwischen Einzel- und Zusammenveranlagung wählen. Die Zusammenveranlagung mit Ehegattensplitting lohnt sich besonders bei unterschiedlich hohen Einkommen.',
            einzel: 'Jeder Ehegatte gibt eine eigene Steuererklärung ab. Vorteilhaft bei ähnlich hohen Einkommen oder wenn ein Partner hohe Verluste aus Gewerbebetrieb oder Vermietung hat.',
            zusammen: 'Beide Einkommen werden addiert, durch zwei geteilt und dann versteuert. Der Splitting-Vorteil ist umso größer, je weiter die Einkommen auseinanderliegen.'
        },
        einkommenA: {
            titel: 'Einkünfte Person A',
            text: 'Tragen Sie hier den Bruttoarbeitslohn aus Ihrer Lohnsteuerbescheinigung 2025 (Zeile 3) ein. Das System zieht automatisch den Arbeitnehmer-Pauschbetrag von 1.330 € ab oder berücksichtigt höhere Werbungskosten, falls Sie diese erfassen.',
            hinweis: 'Bei Steuerklasse 3/5 besteht eine gesetzliche Pflicht zur Abgabe der Steuererklärung!'
        },
        einkommenB: {
            titel: 'Einkünfte Person B',
            text: 'Gleiche Angabe wie bei Person A. Tragen Sie den Bruttoarbeitslohn aus Zeile 3 der Lohnsteuerbescheinigung ein.',
            hinweis: 'Die App vergleicht automatisch beide Veranlagungsarten und zeigt Ihnen die optimale Wahl.'
        },
        ergebnis: {
            titel: 'Steuerberechnung verstehen',
            text: 'Einkommensteuer: Berechnet nach dem progressiven Steuertarif 2025 (§32a EStG) mit dem Grundfreibetrag von 12.096 € pro Person.',
            soli: 'Solidaritätszuschlag: 5,5% auf die Einkommensteuer, aber nur wenn diese 18.610 € (einzeln) bzw. 37.220 € (zusammen) übersteigt.',
            kirchensteuer: 'Kirchensteuer: 8% oder 9% der Einkommensteuer, je nach Bundesland.'
        },
        empfehlung: {
            titel: 'Empfehlung des Steuerberaters',
            text: 'Die App führt automatisch eine Günstigerprüfung durch. Ein grüner Kasten bedeutet: Die aktuell gewählte Veranlagungsart ist optimal. Ein roter Kasten warnt: Die andere Variante wäre günstiger.',
            zusaetzlich: 'Zusätzlich prüft das System: Kinderfreibetrag vs. Kindergeld, Werbungskosten, haushaltsnahe Dienstleistungen und vieles mehr.'
        }
    },
    es: {
        veranlagungsart: {
            titel: 'Elección del tipo de tributación',
            text: 'Los matrimonios y parejas de hecho registradas pueden elegir entre declaración individual o conjunta. La declaración conjunta con Splitting es especialmente ventajosa cuando los ingresos son muy diferentes.',
            einzel: 'Cada cónyuge presenta su propia declaración por separado. Es ventajoso cuando los ingresos son similares o cuando uno de los cónyuges tiene pérdidas elevadas por actividad empresarial o alquileres.',
            zusammen: 'Ambos ingresos se suman, se dividen entre dos y se aplica la tarifa fiscal. Cuanto mayor sea la diferencia de ingresos, mayor será la ventaja del Splitting.'
        },
        einkommenA: {
            titel: 'Ingresos Persona A',
            text: 'Introduzca aquí el salario bruto de su certificado de retenciones (Lohnsteuerbescheinigung) de 2025, línea 3. El sistema descuenta automáticamente el mínimo exento de 1.330 € para empleados o aplica gastos reales si son mayores.',
            hinweis: 'Con clase fiscal 3/5 existe la obligación legal de presentar declaración de impuestos.'
        },
        einkommenB: {
            titel: 'Ingresos Persona B',
            text: 'Misma información que para la Persona A. Introduzca el salario bruto de la línea 3 del certificado de retenciones.',
            hinweis: 'La aplicación compara automáticamente ambos tipos de tributación y le muestra la opción óptima.'
        },
        ergebnis: {
            titel: 'Entender el cálculo de impuestos',
            text: 'Einkommensteuer (Impuesto sobre la renta): Calculado según la tarifa progresiva de 2025 (§32a EStG) con el mínimo exento de 12.096 € por persona.',
            soli: 'Solidaritätszuschlag (Recargo de solidaridad): 5,5% sobre el impuesto, pero solo si este supera 18.610 € (individual) o 37.220 € (conjunto).',
            kirchensteuer: 'Kirchensteuer (Impuesto eclesiástico): 8% o 9% del impuesto sobre la renta, según el estado federado.'
        },
        empfehlung: {
            titel: 'Recomendación del asesor fiscal',
            text: 'La aplicación realiza automáticamente una verificación de conveniencia. Un recuadro verde significa: la opción actual es la óptima. Un recuadro rojo advierte: la otra variante sería más favorable.',
            zusaetzlich: 'Además, el sistema verifica: exención por hijos vs. Kindergeld, gastos laborales, servicios domésticos y mucho más.'
        }
    }
};

class Ausfuellhilfe {
    constructor() {
        this.aktiveHilfe = null;
    }

    init() {
        this.erzeugeHilfeButtons();
    }

    erzeugeHilfeButtons() {
        const bereiche = [
            { id: 'veranlagungsart', selector: '.veranlagung-selector' },
            { id: 'einkommenA', selector: '.partner-a' },
            { id: 'einkommenB', selector: '.partner-b' },
            { id: 'ergebnis', selector: '#ergebnis-details' },
            { id: 'empfehlung', selector: '#empfehlung-box' }
        ];

        bereiche.forEach(bereich => {
            const element = document.querySelector(bereich.selector);
            if (!element) return;

            const btn = document.createElement('button');
            btn.className = 'hilfe-btn';
            btn.innerHTML = '?';
            btn.title = 'Hilfe / Ayuda';
            btn.setAttribute('aria-label', 'Hilfe anzeigen');
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.zeigeHilfe(bereich.id);
            });

            if (!element.style.position || element.style.position === 'static') {
                element.style.position = 'relative';
            }
            element.appendChild(btn);
        });
    }

    zeigeHilfe(id) {
        if (this.aktiveHilfe) {
            this.aktiveHilfe.remove();
            this.aktiveHilfe = null;
        }

        const sprache = (typeof I18N !== 'undefined' && I18N.sprache) ? I18N.sprache.toLowerCase() : 'de';
        const daten = AUSFUELLHILFE[sprache]?.[id] || AUSFUELLHILFE['de'][id];
        if (!daten) return;

        const popup = document.createElement('div');
        popup.className = 'hilfe-popup';
        popup.setAttribute('role', 'dialog');
        popup.setAttribute('aria-label', daten.titel);

        let bodyHTML = `<p>${daten.text}</p>`;

        if (daten.einzel) {
            bodyHTML += `<p><em>${sprache === 'es' ? 'Declaración individual:' : 'Einzelveranlagung:'}</em> ${daten.einzel}</p>`;
        }
        if (daten.zusammen) {
            bodyHTML += `<p><em>${sprache === 'es' ? 'Declaración conjunta:' : 'Zusammenveranlagung:'}</em> ${daten.zusammen}</p>`;
        }
        if (daten.soli) {
            bodyHTML += `<p>${daten.soli}</p>`;
        }
        if (daten.kirchensteuer) {
            bodyHTML += `<p>${daten.kirchensteuer}</p>`;
        }
        if (daten.hinweis) {
            bodyHTML += `<p style="background:#fff3e0;padding:8px;border-radius:6px;border-left:3px solid #ff9800;">⚠️ ${daten.hinweis}</p>`;
        }
        if (daten.zusaetzlich) {
            bodyHTML += `<p style="margin-top:8px;font-size:0.9rem;color:#555;">${daten.zusaetzlich}</p>`;
        }

        popup.innerHTML = `
            <div class="hilfe-popup-header">
                <strong>${daten.titel}</strong>
                <button class="hilfe-popup-close" aria-label="Schließen">&times;</button>
            </div>
            <div class="hilfe-popup-body">
                ${bodyHTML}
            </div>
        `;

        const closeBtn = popup.querySelector('.hilfe-popup-close');
        closeBtn.addEventListener('click', () => {
            popup.remove();
            this.aktiveHilfe = null;
        });

        document.body.appendChild(popup);
        this.aktiveHilfe = popup;

        setTimeout(() => {
            document.addEventListener('click', function schliessen(e) {
                if (!popup.contains(e.target) && !e.target.classList.contains('hilfe-btn')) {
                    popup.remove();
                    document.removeEventListener('click', schliessen);
                }
            });
        }, 100);
    }
}

const hilfe = new Ausfuellhilfe();