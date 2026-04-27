console.log('app.js v6 FINAL');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM listo');

    var ls = document.getElementById('loading-screen');
    if (ls) ls.style.display = 'none';

    // ============ IDIOMA ============
    var langBtns = document.querySelectorAll('.lang-btn');
    for (var i = 0; i < langBtns.length; i++) {
        langBtns[i].addEventListener('click', function() {
            var allBtns = document.querySelectorAll('.lang-btn');
            for (var j = 0; j < allBtns.length; j++) {
                allBtns[j].classList.remove('active');
            }
            this.classList.add('active');
            var lang = this.getAttribute('data-lang');
            console.log('Cambiando idioma a:', lang);
            if (typeof I18N !== 'undefined') {
                I18N.setSprache(lang);
            }
        });
    }

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
        var todas = document.querySelectorAll('main > section');
        for (var i = 0; i < todas.length; i++) {
            todas[i].classList.add('hidden');
        }
        var id = secciones[step];
        if (id) {
            var sec = document.getElementById(id);
            if (sec) sec.classList.remove('hidden');
        }
        var resultPanel = document.getElementById('result-panel');
        if (resultPanel) resultPanel.classList.remove('hidden');

        var items = document.querySelectorAll('.desktop-nav li, .mobile-bottom-nav .nav-item');
        for (var j = 0; j < items.length; j++) {
            items[j].classList.remove('active');
        }
        var da = document.querySelector('.desktop-nav li[data-step="' + step + '"]');
        if (da) da.classList.add('active');
        var ma = document.querySelector('.mobile-bottom-nav .nav-item[data-step="' + step + '"]');
        if (ma) ma.classList.add('active');
    }

    var desktopBtns = document.querySelectorAll('.desktop-nav li');
    for (var k = 0; k < desktopBtns.length; k++) {
        desktopBtns[k].addEventListener('click', function() {
            mostrarPaso(this.getAttribute('data-step'));
        });
    }

    var mobileBtns = document.querySelectorAll('.mobile-bottom-nav .nav-item');
    for (var m = 0; m < mobileBtns.length; m++) {
        mobileBtns[m].addEventListener('click', function() {
            var step = this.getAttribute('data-step');
            if (step === 'scan') {
                mostrarPaso('5');
            } else if (step) {
                mostrarPaso(step);
            }
        });
    }

    // ============ AYUDA ============
    var btnAyuda = document.getElementById('btn-ayuda');
    if (btnAyuda) {
        btnAyuda.addEventListener('click', function() {
            var todas = document.querySelectorAll('main > section');
            for (var i = 0; i < todas.length; i++) {
                todas[i].classList.add('hidden');
            }
            var ayuda = document.getElementById('ayuda-panel');
            if (ayuda) ayuda.classList.remove('hidden');
            var result = document.getElementById('result-panel');
            if (result) result.classList.remove('hidden');
        });
    }

    // ============ CALCULADORA ============
    var btnCalc = document.getElementById('btn-berechnen');
    if (btnCalc) {
        btnCalc.addEventListener('click', function() {
            var a = parseFloat(document.getElementById('einkommen-a')?.value) || 0;
            var b = parseFloat(document.getElementById('einkommen-b')?.value) || 0;
            var imp = (a + b) * 0.25;
            var fmt = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
            var elSteuer = document.getElementById('wert-steuer');
            var elSoli = document.getElementById('wert-soli');
            var elGesamt = document.getElementById('wert-gesamt');
            if (elSteuer) elSteuer.textContent = fmt.format(imp);
            if (elSoli) elSoli.textContent = fmt.format(imp * 0.055);
            if (elGesamt) elGesamt.textContent = fmt.format(imp * 1.055);
        });
    }

    // ============ BELEGE ============
    var belegeListe = [];
    var belegeContainer = document.getElementById('belege-container');
    var belegeTitel = document.querySelector('#belege-liste h3');

    function actualizarListaBelege() {
        if (!belegeContainer) return;
        belegeContainer.innerHTML = '';
        for (var i = 0; i < belegeListe.length; i++) {
            var doc = belegeListe[i];
            var div = document.createElement('div');
            div.className = 'beleg-eintrag';
            div.innerHTML = '<span>' + doc.icon + ' ' + doc.name + ' (' + doc.groesse + ')</span><button class="btn-entfernen" data-index="' + i + '">✕</button>';
            belegeContainer.appendChild(div);
        }
        if (belegeTitel) belegeTitel.textContent = 'Dokumente (' + belegeListe.length + ')';
        var btnsX = document.querySelectorAll('.btn-entfernen');
        for (var j = 0; j < btnsX.length; j++) {
            btnsX[j].addEventListener('click', function() {
                var idx = parseInt(this.getAttribute('data-index'));
                belegeListe.splice(idx, 1);
                actualizarListaBelege();
            });
        }
    }

    function agregarArchivo(file) {
        if (file.size > 10485760) { alert('Archivo demasiado grande. Max 10 MB.'); return; }
        var icon = '📄';
        if (file.type.includes('image')) icon = '🖼️';
        var groesse = (file.size / 1024).toFixed(1) + ' KB';
        belegeListe.push({ name: file.name, groesse: groesse, icon: icon });
        actualizarListaBelege();
    }

    var btnCargar = document.getElementById('btn-cargar-archivo');
    var btnEscanear = document.getElementById('btn-escanear');
    var fileInput = document.getElementById('file-input');
    var cameraInput = document.getElementById('camera-input');

    if (btnCargar) {
        btnCargar.addEventListener('click', function() {
            console.log('Botón cargar clickeado');
            if (fileInput) fileInput.click();
        });
    }
    if (btnEscanear) {
        btnEscanear.addEventListener('click', function() {
            console.log('Botón escanear clickeado');
            if (cameraInput) cameraInput.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', function() {
            for (var i = 0; i < this.files.length; i++) {
                agregarArchivo(this.files[i]);
            }
            this.value = '';
        });
    }
    if (cameraInput) {
        cameraInput.addEventListener('change', function() {
            for (var i = 0; i < this.files.length; i++) {
                agregarArchivo(this.files[i]);
            }
            this.value = '';
        });
    }

    var dropzone = document.getElementById('dropzone');
    if (dropzone) {
        dropzone.addEventListener('dragover', function(e) { e.preventDefault(); });
        dropzone.addEventListener('drop', function(e) {
            e.preventDefault();
            for (var i = 0; i < e.dataTransfer.files.length; i++) {
                agregarArchivo(e.dataTransfer.files[i]);
            }
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
            var txt = t + '\n\nPerson A: ' + nA + ' - ' + a.toLocaleString('de-DE') + ' EUR\nPerson B: ' + nB + ' - ' + b.toLocaleString('de-DE') + ' EUR';
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
            if (!idA || idA.length !== 11) {
                if (status) { status.style.display = 'block'; status.style.background = '#ffebee'; status.textContent = '❌ Steuer-ID A muss 11 Ziffern haben.'; }
                return;
            }
            var xml = '<?xml version="1.0"?>\n<Elster>\n <PersonA>' + idA + '</PersonA>\n <PersonB>' + idB + '</PersonB>\n <IBAN>' + iban + '</IBAN>\n</Elster>';
            window._elsterXml = xml;
            if (status) { status.style.display = 'block'; status.style.background = '#e8f5e9'; status.innerHTML = '✅ XML generiert!'; }
            if (btnElsterDown) btnElsterDown.style.display = 'block';
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

    console.log('✅ Todos los eventos asignados');
});
