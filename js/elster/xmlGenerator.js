class ElsterXMLGenerator {
    constructor() {
        this.version = '2025';
    }

    generiereXML(steuerDaten, ehepartnerA, ehepartnerB) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<ElsterErklaerung xmlns="http://www.elster.de/2002/XMLSchema" version="' + this.version + '">\n';

        xml += '  <TransferHeader>\n';
        xml += '    <Version>37.4.1</Version>\n';
        xml += '    <Erklaerungsart>' + (steuerDaten.veranlagungsart === 'ZUSAMMEN' ? 'Z' : 'E') + '</Erklaerungsart>\n';
        xml += '    <Veranlagungsjahr>2025</Veranlagungsjahr>\n';
        xml += '  </TransferHeader>\n';

        xml += '  <Mantelbogen>\n';
        xml += '    <Steuerpflichtiger Person="A">\n';
        xml += '      <SteuerID>' + (ehepartnerA.steuerId || '') + '</SteuerID>\n';
        xml += '      <Name>' + (ehepartnerA.name || '') + '</Name>\n';
        xml += '    </Steuerpflichtiger>\n';

        if (steuerDaten.veranlagungsart === 'ZUSAMMEN') {
            xml += '    <Steuerpflichtiger Person="B">\n';
            xml += '      <SteuerID>' + (ehepartnerB.steuerId || '') + '</SteuerID>\n';
            xml += '      <Name>' + (ehepartnerB.name || '') + '</Name>\n';
            xml += '    </Steuerpflichtiger>\n';
        }

        if (steuerDaten.bankverbindung) {
            xml += '    <Bankverbindung>\n';
            xml += '      <IBAN>' + (steuerDaten.bankverbindung.iban || '') + '</IBAN>\n';
            xml += '      <BIC>' + (steuerDaten.bankverbindung.bic || '') + '</BIC>\n';
            xml += '    </Bankverbindung>\n';
        }

        xml += '  </Mantelbogen>\n';
        xml += '</ElsterErklaerung>';

        return xml;
    }
}