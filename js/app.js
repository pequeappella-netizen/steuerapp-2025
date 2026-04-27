console.log('app.js cargado');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM listo');

    // Ocultar pantalla de carga
    var ls = document.getElementById('loading-screen');
    if (ls) ls.style.display = 'none';

    // Secciones
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
        var items = document.querySelectorAll('.desktop-nav li, .mobile-bottom-nav .nav-item');
        for (var j = 0; j < items.length; j++) {
            items[j].classList.remove('active');
        }
        var a = document.querySelector('.desktop-nav li[data-step="' + step + '"]');
        if (a) a.classList.add('active');
        var b = document.querySelector('.mobile-bottom-nav .nav-item[data-step="' + step + '"]');
        if (b) b.classList.add('active');
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
            if (step && step !== 'scan') mostrarPaso(step);
        });
    }

    // Botón calcular
    var btnCalc = document.getElementById('btn-berechnen');
    if (btnCalc) {
        btnCalc.addEventListener('click', function() {
            var a = parseFloat(document.getElementById('einkommen-a')?.value) || 0;
            var b = parseFloat(document.getElementById('einkommen-b')?.value) || 0;
            var impuesto = (a + b) * 0.25;
            document.getElementById('wert-steuer').textContent = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(impuesto);
            document.getElementById('wert-soli').textContent = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(impuesto * 0.055);
            document.getElementById('wert-gesamt').textContent = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(impuesto * 1.055);
        });
    }

    console.log('Eventos asignados');
});
