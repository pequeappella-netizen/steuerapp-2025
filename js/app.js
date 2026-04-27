console.log('app.js cargado v3');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM listo');

    // Ocultar pantalla de carga
    var ls = document.getElementById('loading-screen');
    if (ls) ls.style.display = 'none';

    // ============ IDIOMA ============
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.lang-btn').forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            if (typeof I18N !== 'undefined') I18N.setSprache(this.getAttribute('data-lang'));
        });
    });

    // ============ NAVEGACION ============
    var secciones = {
        '1': 'input-panel',
        '2': 'versicherung-panel',
        '3': 'haushalt-panel',
        '4': 'kinder-panel',
        '5': 'belege-panel',
        '6': 'elster-panel',
        '7': 'pdf-panel'
    };

    function mostrarPaso(step) {
        document.querySelectorAll('main > section').forEach(function(sec) { sec.classList.add('hidden'); });
        var id = secciones[step];
        if (id) {
            var sec = document.getElementById(id);
            if (sec) sec.classList.remove('hidden');
        }
        document.querySelectorAll('.desktop-nav li, .mobile-bottom-nav .nav-item').forEach(function(el) { el.classList.remove('active'); });
        var da = document.querySelector('.desktop-nav li[data-step="' + step + '"]');
        if (da) da.classList.add('active');
        var ma = document.querySelector('.mobile-bottom-nav .nav-item[data-step="' + step + '"]');
        if (ma) ma.classList.add('active');
    }

    document.querySelectorAll('.desktop-nav li').forEach(function(li) {
        li.addEventListener('click', function() { mostrarPaso(this.getAttribute('data-step')); });
    });
    document.querySelectorAll('.mobile-bottom-nav .nav-item').forEach(function(item) {
        item.addEventListener('click', function() {
            var step = this.getAttribute('data-step');
            if (step === 'scan') mostrarPaso('5');
            else if (step) mostrarPaso(step);
        });
    });

    // ============ CALCULADORA ============
    document.getElementById('btn-berechnen')?.addEventListener('click', function() {
        var a = parseFloat(document.getElementById('einkommen-a')?.value) || 0;
        var b = parseFloat(document.getElementById('einkommen-b')?.value) || 0;
        var imp = (a + b) * 0.25;
        document.getElementById('wert-steuer').textContent = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(imp);
        document.getElementById('wert-soli').textContent = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(imp * 0.055);
        document.getElementById('wert-gesamt').textContent = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(imp * 1.055);
    });

    // ============ PDF ============
    var btnPdfGen = document.getElementById('btn-pdf-generieren');
    var btnPdfDown = document.getElementById('btn-pdf-herunterladen');
    if (btnPdfGen) {
        btnPdfGen.addEventListener('click', function() {
            var nA = document.getElementById('pdf-name-a')?.value || 'Person A';
            var nB = document.getElementById('pdf-name-b')?.value || 'Person B';
            var sp = document.getElementById('pdf-sprache')?.value || 'DE';
            var a = parseFloat(document.getElementById('einkommen-a')?.value) || 0;
            var b = parseFloat(document.getElementById('einkommen-b')?.value) || 0;
            var t = sp === 'DE' ? 'STEUERERKLARUNG 2025' : 'DECLARACION DE IMPUESTOS 2025';
            var txt = t + '\n\nPerson A: ' + nA + ' - ' + a + ' EUR\nPerson B: ' + nB + ' - ' + b + ' EUR\n\nGesamt: ' + (a+b) + ' EUR';
            var vorschau = document.getElementById('pdf-vorschau');
            if (vorschau) { vorschau.style.display = 'block'; vorschau.textContent = txt; }
            if (btnPdfDown) btnPdfDown.style.display = 'block';
            window._pdfText = txt;
        });
    }
    if (btnPdfDown) {
        btnPdfDown.addEventListener('click', function() {
            if (!window._pdfText) return;
            var blob = new Blob([window._pdfText], { type: 'text/plain' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url; a.download = 'Steuererklaerung_2025.txt';
            a.click(); URL.revokeObjectURL(url);
        });
    }

    // ============ ELSTER ============
    var btnElsterGen = document.getElementById('btn-elster-generieren');
    var btnElsterDown = document.getElementById('btn-elster-herunterladen');
    if (btnElsterGen) {
        btnElsterGen.addEventListener('click', function() {
            var idA = document.getElementById('elster-steuerid-a')?.value || '';
            var idB = document.getElementById('elster-steuerid-b')?.value || '';
            var iban = document.getElementById('elster-iban')?.value || '';
            var status = document.getElementById('elster-status');
            if (!idA || idA.length !== 11) { if(status){status.style.display='block';status.style.background='#ffebee';status.textContent='❌ Steuer-ID A muss 11 Ziffern haben.';} return; }
            var xml = '<?xml version="1.0"?>\n<Elster>\n <PersonA>' + idA + '</PersonA>\n <PersonB>' + idB + '</PersonB>\n <IBAN>' + iban + '</IBAN>\n</Elster>';
            window._elsterXml = xml;
            if(status){status.style.display='block';status.style.background='#e8f5e9';status.innerHTML='✅ XML generiert!';}
            if(btnElsterDown) btnElsterDown.style.display = 'block';
        });
    }
    if (btnElsterDown) {
        btnElsterDown.addEventListener('click', function() {
            if (!window._elsterXml) return;
            var blob = new Blob([window._elsterXml], { type: 'application/xml' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url; a.download = 'Steuererklaerung_2025.xml';
            a.click(); URL.revokeObjectURL(url);
        });
    }

    console.log('Todos los eventos asignados');
});
