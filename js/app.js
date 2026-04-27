console.log('app.js v5 - completo con ayuda');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM listo');

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
        if (id) { var sec = document.getElementById(id); if (sec) sec.classList.remove('hidden'); }
        var resultPanel = document.getElementById('result-panel');
        if (resultPanel) resultPanel.classList.remove('hidden');
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

    // ============ AYUDA ============
    document.getElementById('btn-ayuda')?.addEventListener('click', function() {
        document.querySelectorAll('main > section').forEach(function(sec) { sec.classList.add('hidden'); });
        document.getElementById('ayuda-panel')?.classList.remove('hidden');
        document.getElementById('result-panel')?.classList.remove('hidden');
        document.querySelectorAll('.desktop-nav li, .mobile-bottom-nav .nav-item').forEach(function(el) { el.classList.remove('active'); });
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

    // ============ BELEGE ============
    var fileInput = document.getElementById('file-input');
    var cameraInput = document.getElementById('camera-input');
    var belegeContainer = document.getElementById('belege-container');
    var belegeTitel = document.querySelector('#belege-liste h3');
    var belegeListe = [];

    function actualizarLista() {
        if (belegeContainer) {
            belegeContainer.innerHTML = '';
            belegeListe.forEach(function(doc, index) {
                var div = document.createElement('div');
                div.className = 'beleg-eintrag';
                div.innerHTML = '<span>' + doc.icon + ' ' + doc.name + ' (' + doc.groesse + ')</span><button class="btn-entfernen" data-index="' + index + '">✕</button>';
                belegeContainer.appendChild(div);
            });
            if (belegeTitel) belegeTitel.textContent = 'Dokumente (' + belegeListe.length + ')';
            document.querySelectorAll('.btn-entfernen').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    belegeListe.splice(parseInt(this.getAttribute('data-index')), 1);
                    actualizarLista();
                });
            });
        }
    }

    function agregarArchivo(file) {
        if (file.size > 10485760) { alert('Datei zu gro\u00df. Max 10 MB.'); return; }
        var icon = file.type.includes('pdf') ? '📄' : '🖼️';
        var groesse = (file.size / 1024).toFixed(1) + ' KB';
        belegeListe.push({ name: file.name, groesse: groesse, icon: icon, file: file });
        actualizarLista();
    }

    document.getElementById('btn-cargar-archivo')?.addEventListener('click', function() { fileInput?.click(); });
    document.getElementById('btn-escanear')?.addEventListener('click', function() { cameraInput?.click(); });

    fileInput?.addEventListener('change', function() {
        for (var i = 0; i < this.files.length; i++) agregarArchivo(this.files[i]);
        this.value = '';
    });
    cameraInput?.addEventListener('change', function() {
        for (var i = 0; i < this.files.length; i++) agregarArchivo(this.files[i]);
        this.value = '';
    });

    var dropzone = document.getElementById('dropzone');
    if (dropzone) {
        dropzone.addEventListener('dragover', function(e) { e.preventDefault(); this.classList.add('dragover'); });
        dropzone.addEventListener('dragleave', function() { this.classList.remove('dragover'); });
        dropzone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            for (var i = 0; i < e.dataTransfer.files.length; i++) agregarArchivo(e.dataTransfer.files[i]);
        });
    }

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
            var txt = t + '\n\nPerson A: ' + nA + ' - ' + a.toLocaleString('de-DE') + ' EUR\nPerson B: ' + nB + ' - ' + b.toLocaleString('de-DE') + ' EUR\n\nGesamt: ' + (a+b).toLocaleString('de-DE') + ' EUR';
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

    console.log('Todos los eventos asignados correctamente');
});
