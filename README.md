# PIC16F690 TIMER2 CALCULATOR #
This program can easily calculate the right settings to Prescaler, PR2, and Postscaler for microcontroller PIC16F690 in which is TIMER2 programmable "oscilator frequency divider" which is used to generate longer wait intervals using interrupt flag.

# How to use #
The program will ask you to set an oscilator frequency, which is frequency usually provided by internal oscilator, but yiu can have external oscilator for clocking the timers. 
After that, you will be asked to enter final frequency value such as 200 Hz. That frequency is calculated to output of timer with interrupt flag. 