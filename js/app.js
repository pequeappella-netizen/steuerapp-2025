console.log('app.js v6 FINAL con OCR');

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
    window.belegeListe = [];
    window.handleFiles = function(files) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file.size > 10485760) { alert('Archivo demasiado grande. Max 10 MB.'); continue; }
            var icon = file.type.includes('image') ? '🖼️' : '📄';
            var groesse = (file.size / 1024).toFixed(1) + ' KB';
            window.belegeListe.push({ name: file.name, groesse: groesse, icon: icon });
        }
        actualizarListaBelege();
    };

    function actualizarListaBelege() {
        var container = document.getElementById('belege-container');
        var titel = document.querySelector('#belege-liste h3');
        if (!container) return;
        container.innerHTML = '';
        for (var i = 0; i < window.belegeListe.length; i++) {
            var doc = window.belegeListe[i];
            var div = document.createElement('div');
            div.className = 'beleg-eintrag';
            div.innerHTML = '<span>' + doc.icon + ' ' + doc.name + ' (' + doc.groesse + ')</span><button class="btn-entfernen" data-index="' + i + '">✕</button>';
            container.appendChild(div);
        }
        if (titel) titel.textContent = 'Dokumente (' + window.belegeListe.length + ')';
        var btns = document.querySelectorAll('.btn-entfernen');
        for (var j = 0; j < btns.length; j++) {
            btns[j].onclick = function() {
                var idx = parseInt(this.getAttribute('data-index'));
                window.belegeListe.splice(idx, 1);
                actualizarListaBelege();
            };
        }
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

    // ============ OCR SMART SCAN ============
    window.escanearParaPanel = function(panel) {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.onchange = function(e) {
            var file = e.target.files[0];
            if (!file) return;
            mostrarProgresoOCR();
            reconocerTexto(file, panel);
        };
        input.click();
    };

    function mostrarProgresoOCR() {
        var div = document.createElement('div');
        div.id = 'ocr-progress';
        div.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:2rem;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.2);z-index:9999;text-align:center;';
        div.innerHTML = '<div class="spinner"></div><p style="margin-top:1rem;">Analizando documento...</p>';
        document.body.appendChild(div);
    }

    function ocultarProgresoOCR() {
        var el = document.getElementById('ocr-progress');
        if (el) el.remove();
    }

    function reconocerTexto(file, panel) {
        var reader = new FileReader();
        reader.onload = function() {
            var imgData = reader.result;
            Tesseract.recognize(imgData, 'deu', {
                logger: function(info) {
                    if (info.status === 'recognizing text') {
                        var prog = document.querySelector('#ocr-progress p');
                        if (prog) prog.textContent = 'Analizando... ' + Math.round(info.progress * 100) + '%';
                    }
                }
            }).then(function(result) {
                ocultarProgresoOCR();
                var texto = result.data.text;
                console.log('Texto OCR:', texto);
                var datos = analizarTexto(panel, texto);
                if (datos) {
                    rellenarCampos(panel, datos);
                    alert('✅ Datos extraídos y cargados en el panel ' + panel);
                } else {
                    mostrarTextoExtraido(texto, panel);
                }
            }).catch(function(err) {
                ocultarProgresoOCR();
                alert('Error OCR: ' + err.message);
            });
        };
        reader.readAsDataURL(file);
    }

    function analizarTexto(panel, texto) {
        texto = texto || '';
        var datos = {};
        if (panel === 'einkommen') {
            var br = texto.match(/Brutto[\s\S]*?([\d.,]+)\s*(?:€|EUR)/i);
            var ls = texto.match(/Lohnsteuer[\s\S]*?([\d.,]+)\s*(?:€|EUR)/i);
            if (br) datos.brutto = parseFloat(br[1].replace(/\./g, '').replace(',', '.'));
            if (ls) datos.lohnsteuer = parseFloat(ls[1].replace(/\./g, '').replace(',', '.'));
        } else if (panel === 'versicherung') {
            var kv = texto.match(/Kranken[\s\S]*?([\d.,]+)\s*(?:€|EUR)/i);
            var rv = texto.match(/Renten[\s\S]*?([\d.,]+)\s*(?:€|EUR)/i);
            if (kv) datos.kv = parseFloat(kv[1].replace(/\./g, '').replace(',', '.'));
            if (rv) datos.rv = parseFloat(rv[1].replace(/\./g, '').replace(',', '.'));
        } else if (panel === 'haushalt') {
            var hw = texto.match(/Handwerker[\s\S]*?([\d.,]+)\s*(?:€|EUR)/i);
            var hh = texto.match(/Haushalts[\s\S]*?([\d.,]+)\s*(?:€|EUR)/i);
            if (hw) datos.handwerker = parseFloat(hw[1].replace(/\./g, '').replace(',', '.'));
            if (hh) datos.haushalt = parseFloat(hh[1].replace(/\./g, '').replace(',', '.'));
        } else if (panel === 'kinder') {
            var betr = texto.match(/Betreuung[\s\S]*?([\d.,]+)\s*(?:€|EUR)/i);
            var schul = texto.match(/Schulgeld[\s\S]*?([\d.,]+)\s*(?:€|EUR)/i);
            var uh = texto.match(/Unterhalt[\s\S]*?([\d.,]+)\s*(?:€|EUR)/i);
            if (betr) datos.kinderbetreuung = parseFloat(betr[1].replace(/\./g, '').replace(',', '.'));
            if (schul) datos.schulgeld = parseFloat(schul[1].replace(/\./g, '').replace(',', '.'));
            if (uh) datos.unterhalt = parseFloat(uh[1].replace(/\./g, '').replace(',', '.'));
        }
        return Object.keys(datos).length > 0 ? datos : null;
    }

    function rellenarCampos(panel, datos) {
        if (panel === 'einkommen') {
            if (datos.brutto) document.getElementById('einkommen-a').value = datos.brutto;
            if (datos.lohnsteuer) document.getElementById('lohnsteuer-a').value = datos.lohnsteuer;
        } else if (panel === 'versicherung') {
            if (datos.kv) document.getElementById('kv-a').value = datos.kv;
            if (datos.rv) document.getElementById('rv-a').value = datos.rv;
        } else if (panel === 'haushalt') {
            if (datos.handwerker) document.getElementById('handwerker').value = datos.handwerker;
            if (datos.haushalt) document.getElementById('haushalt-dienst').value = datos.haushalt;
        } else if (panel === 'kinder') {
            if (datos.kinderbetreuung) document.getElementById('kinderbetreuung').value = datos.kinderbetreuung;
            if (datos.schulgeld) document.getElementById('schulgeld').value = datos.schulgeld;
            if (datos.unterhalt) document.getElementById('unterhalt').value = datos.unterhalt;
        }
    }

    function mostrarTextoExtraido(texto, panel) {
        var div = document.createElement('div');
        div.style.cssText = 'position:fixed;top:10%;left:5%;right:5%;bottom:10%;background:white;padding:1rem;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.2);z-index:9999;overflow-y:auto;';
        div.innerHTML = '<h3>Texto extraído (OCR)</h3><p style="color:#666;">No se detectaron automáticamente los campos. Puede copiar los valores manualmente.</p><pre style="white-space:pre-wrap;background:#f5f5f5;padding:1rem;border-radius:8px;margin:1rem 0;">' + texto + '</pre><button onclick="this.parentElement.remove()" style="background:#1a237e;color:white;border:none;padding:0.7rem 1.5rem;border-radius:30px;font-weight:600;cursor:pointer;">Cerrar</button>';
        document.body.appendChild(div);
    }

    console.log('✅ Todos los eventos asignados');
});
