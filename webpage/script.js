document.getElementById('calculate').addEventListener('click', function() {
    const fosc = parseFloat(document.getElementById('fosc').value);
    const ftarget = parseFloat(document.getElementById('ftarget').value);

    // Přepočet cílové frekvence na časový interval
    const T_target = 1 / ftarget;

    // Definice možných hodnot prescalerů a postscalerů
    const prescalers = [1, 4, 16];
    const postscalers = Array.from({length: 16}, (_, i) => i + 1); // 1-16

    let minError = Infinity;
    let bestPrescaler = 1;
    let bestPostscaler = 1;
    let bestPR2 = 0;
    let bestF_real = 0;

    // Procházíme všechny kombinace prescalerů, postscalerů a PR2
    for (let prescaler of prescalers) {
        for (let postscaler of postscalers) {
            for (let PR2 = 0; PR2 <= 255; PR2++) {
                const T_real = 4 * prescaler * (PR2 + 1) * postscaler / fosc;
                const f_real = 1 / T_real;
                const error = Math.abs(f_real - ftarget);

                if (error < minError) {
                    minError = error;
                    bestPrescaler = prescaler;
                    bestPostscaler = postscaler;
                    bestPR2 = PR2;
                    bestF_real = f_real;
                }
            }
        }
    }

    // Výstup nejlepších nalezených hodnot
    document.getElementById('result').innerText = 
        `Nejlepší nalezené hodnoty: 
        Prescaler: ${bestPrescaler}, 
        Postscaler: ${bestPostscaler}, 
        PR2: ${bestPR2}, 
        Skutečná frekvence: ${bestF_real.toFixed(4)} Hz, 
        Chyba: ${minError.toFixed(4)} Hz`;
});
