using System;

class Program
{
    static void Main(string[] args)
    {
        // Vstupní hodnoty
        Console.WriteLine("Zadejte frekvenci oscilátoru (Fosc v Hz):");
        double Fosc = double.Parse(Console.ReadLine());

        Console.WriteLine("Zadejte požadovanou výstupní frekvenci (v Hz):");
        double f_target = double.Parse(Console.ReadLine());

        // Přepočet cílové frekvence na časový interval
        double T_target = 1 / f_target;

        // Definice možných hodnot prescalerů a postscalerů
        int[] prescalers = { 1, 4, 16 };
        int[] postscalers = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 };

        // Inicializace minimální chyby
        double minError = double.MaxValue;
        int bestPrescaler = 1;
        int bestPostscaler = 1;
        int bestPR2 = 0;
        double bestT_real = 0;
        double bestF_real = 0;

        // Procházíme všechny kombinace prescalerů, postscalerů a PR2
        foreach (int prescaler in prescalers)
        {
            foreach (int postscaler in postscalers)
            {
                for (int PR2 = 0; PR2 <= 255; PR2++)
                {
                    // Výpočet skutečného času TIMER2
                    double T_real = 4 * prescaler * (PR2 + 1) * postscaler / Fosc;

                    // Přepočet skutečného času na frekvenci
                    double f_real = 1 / T_real;

                    // Výpočet chyby mezi skutečnou a požadovanou frekvencí
                    double error = Math.Abs(f_real - f_target);

                    // Pokud je chyba menší než doposud nalezená, uložíme tyto hodnoty
                    if (error < minError)
                    {
                        minError = error;
                        bestPrescaler = prescaler;
                        bestPostscaler = postscaler;
                        bestPR2 = PR2;
                        bestT_real = T_real;
                        bestF_real = f_real;
                    }
                }
            }
        }

        // Výstup nejlepších nalezených hodnot
        Console.WriteLine("Nejlepší nalezené hodnoty:");
        Console.WriteLine($"Prescaler: {bestPrescaler}");
        Console.WriteLine($"Postscaler: {bestPostscaler}");
        Console.WriteLine($"PR2: {bestPR2}");
        Console.WriteLine($"Skutečná frekvence: {bestF_real} Hz");
        Console.WriteLine($"Chyba: {minError} Hz");

        Console.WriteLine("Press any key to exit...");
        Console.ReadLine();
    }
}