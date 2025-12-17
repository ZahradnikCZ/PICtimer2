// ========================================
// THEME TOGGLE
// ========================================

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

initTheme();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
});

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// ========================================
// CALCULATOR
// ========================================

function calculateTimerValues(fosc, ftarget) {
    const prescalers = [1, 4, 16];
    const postscalers = Array.from({ length: 16 }, (_, i) => i + 1);

    let minError = Infinity;
    let best = { prescaler: 1, postscaler: 1, pr2: 0, realFrequency: 0 };

    for (const prescaler of prescalers) {
        for (const postscaler of postscalers) {
            for (let PR2 = 0; PR2 <= 255; PR2++) {
                const T_real = (4 * prescaler * (PR2 + 1) * postscaler) / fosc;
                const f_real = 1 / T_real;
                const error = Math.abs(f_real - ftarget);

                if (error < minError) {
                    minError = error;
                    best = { prescaler, postscaler, pr2: PR2, realFrequency: f_real };
                }
            }
        }
    }

    return { ...best, error: minError, errorPercent: (minError / ftarget) * 100 };
}

function displayResults(results) {
    const resultSection = document.getElementById('result');

    resultSection.innerHTML = `
        <div class="result-card">
            <h3 class="result-title">
                <svg class="result-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Nalezené hodnoty
            </h3>
            <div class="result-grid">
                <div class="result-item">
                    <div class="result-item-label">Prescaler</div>
                    <div class="result-item-value">${results.prescaler}</div>
                </div>
                <div class="result-item">
                    <div class="result-item-label">Postscaler</div>
                    <div class="result-item-value">${results.postscaler}</div>
                </div>
                <div class="result-item">
                    <div class="result-item-label">PR2</div>
                    <div class="result-item-value">${results.pr2}</div>
                </div>
                <div class="result-item">
                    <div class="result-item-label">Chyba</div>
                    <div class="result-item-value">${results.errorPercent.toFixed(2)}%</div>
                </div>
                <div class="result-item result-full">
                    <div class="result-item-label">Skutečná frekvence</div>
                    <div class="result-item-value">${formatFrequency(results.realFrequency)}</div>
                </div>
            </div>
        </div>
    `;
}

function displayError(message) {
    const resultSection = document.getElementById('result');

    resultSection.innerHTML = `
        <div class="result-card result-error">
            <h3 class="result-title">
                <svg class="result-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                Chyba
            </h3>
            <p style="font-size: 0.8125rem;">${message}</p>
        </div>
    `;
}

function formatFrequency(freq) {
    if (freq >= 1000000) return (freq / 1000000).toFixed(4) + ' MHz';
    if (freq >= 1000) return (freq / 1000).toFixed(4) + ' kHz';
    return freq.toFixed(4) + ' Hz';
}

function handleSubmit(event) {
    event.preventDefault();

    const foscInput = document.getElementById('fosc');
    const ftargetInput = document.getElementById('ftarget');

    const fosc = parseFloat(foscInput.value);
    const ftarget = parseFloat(ftargetInput.value);

    if (isNaN(fosc) || fosc <= 0) {
        displayError('Zadej platnou frekvenci oscilátoru.');
        foscInput.focus();
        return;
    }

    if (isNaN(ftarget) || ftarget <= 0) {
        displayError('Zadej platnou cílovou frekvenci.');
        ftargetInput.focus();
        return;
    }

    const results = calculateTimerValues(fosc, ftarget);
    displayResults(results);
}

const form = document.getElementById('calculator-form');
if (form) {
    form.addEventListener('submit', handleSubmit);
}
