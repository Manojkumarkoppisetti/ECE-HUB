// ===== Edit this file to change the site's content. No other file needs to change. =====

// Category name -> colour used for filter chips and component cards
const CATEGORIES = {
  "Passive": "#2563eb",
  "Semiconductor": "#7c3aed",
  "Display & opto": "#d97706",
  "Analog IC": "#db2777",
  "Digital IC": "#0d9488",
  "Sensors": "#16a34a",
  "Electromechanical": "#ea580c",
  "Power": "#dc2626",
  "Microcontroller": "#4f46e5"
};

// sym = short badge text, use = what it does, val = typical value or part number
const PARTS = [
  { name: "Resistor", sym: "R", cat: "Passive", use: "Limits current and divides voltage.", val: "1 Ω – 10 MΩ" },
  { name: "Potentiometer", sym: "VR", cat: "Passive", use: "Adjustable resistor for volume and tuning controls.", val: "1 kΩ – 1 MΩ" },
  { name: "Capacitor", sym: "C", cat: "Passive", use: "Stores charge. Filters noise and smooths supply rails.", val: "1 pF – 1000 µF" },
  { name: "Inductor", sym: "L", cat: "Passive", use: "Stores energy in a magnetic field. Used in filters and converters.", val: "1 µH – 1 H" },
  { name: "Crystal oscillator", sym: "X", cat: "Passive", use: "Gives a stable clock reference for digital circuits.", val: "8 MHz – 100 MHz" },
  { name: "Transformer", sym: "T", cat: "Passive", use: "Steps AC voltage up or down through magnetic coupling.", val: "Turns ratio 1:1 to 10:1" },

  { name: "Diode", sym: "D", cat: "Semiconductor", use: "Conducts in one direction. Used in rectifiers.", val: "Si drop ≈ 0.7 V" },
  { name: "Zener diode", sym: "DZ", cat: "Semiconductor", use: "Holds a fixed voltage in reverse breakdown.", val: "3.3 V, 5.1 V, 12 V" },
  { name: "BJT (NPN)", sym: "Q", cat: "Semiconductor", use: "Current-controlled switch or amplifier.", val: "2N3904" },
  { name: "MOSFET", sym: "M", cat: "Semiconductor", use: "Voltage-controlled switch. The core device in CMOS.", val: "IRF540, 2N7000" },
  { name: "IGBT", sym: "IG", cat: "Semiconductor", use: "High-power switch for motor drives and inverters.", val: "IRG4PC40" },
  { name: "SCR (thyristor)", sym: "SCR", cat: "Semiconductor", use: "Latching switch for controlling AC power.", val: "BT151" },

  { name: "LED", sym: "LED", cat: "Display & opto", use: "Emits light when forward-biased. Needs a series resistor.", val: "Red ≈ 2 V" },
  { name: "7-segment display", sym: "7S", cat: "Display & opto", use: "Shows digits by lighting selected segments.", val: "Common cathode" },
  { name: "16×2 LCD", sym: "LCD", cat: "Display & opto", use: "Character display for microcontroller projects.", val: "HD44780 controller" },
  { name: "Optocoupler", sym: "OC", cat: "Display & opto", use: "Isolates two circuits using light.", val: "PC817" },

  { name: "Op-amp", sym: "U", cat: "Analog IC", use: "High-gain amplifier for signal conditioning.", val: "LM358, µA741" },
  { name: "555 timer", sym: "555", cat: "Analog IC", use: "Builds timers, oscillators, and PWM signals.", val: "NE555" },
  { name: "Comparator", sym: "CMP", cat: "Analog IC", use: "Compares two voltages and outputs a digital level.", val: "LM393" },
  { name: "Voltage regulator", sym: "REG", cat: "Analog IC", use: "Holds a steady output voltage despite input changes.", val: "7805 (5 V), LM317" },

  { name: "Flip-flop", sym: "FF", cat: "Digital IC", use: "Stores one bit. The basis of registers and counters.", val: "7474, 74HC74" },
  { name: "Shift register", sym: "SR", cat: "Digital IC", use: "Moves bits serially and adds extra output pins.", val: "74HC595" },
  { name: "Multiplexer", sym: "MUX", cat: "Digital IC", use: "Selects one of several inputs to pass on.", val: "74HC153" },
  { name: "Decoder", sym: "DEC", cat: "Digital IC", use: "Turns a binary code into one active output line.", val: "74HC138" },

  { name: "Thermistor (NTC)", sym: "TH", cat: "Sensors", use: "Resistance falls as temperature rises.", val: "10 kΩ at 25 °C" },
  { name: "LDR", sym: "LDR", cat: "Sensors", use: "Resistance falls as light intensity rises.", val: "Light-dependent resistor" },
  { name: "Hall-effect sensor", sym: "HE", cat: "Sensors", use: "Detects magnetic fields, for example to measure speed.", val: "SS49E" },
  { name: "Ultrasonic sensor", sym: "US", cat: "Sensors", use: "Measures distance using sound pulses.", val: "HC-SR04" },

  { name: "Relay", sym: "RLY", cat: "Electromechanical", use: "Switches a high-power load with a low-power signal.", val: "5 V coil, SPDT" },
  { name: "Push button", sym: "SW", cat: "Electromechanical", use: "Momentary switch for user input.", val: "Tactile, 4-pin" },
  { name: "Buzzer", sym: "BZ", cat: "Electromechanical", use: "Turns an electrical signal into sound.", val: "Active, 5 V" },
  { name: "Servo motor", sym: "SV", cat: "Electromechanical", use: "Rotates to a set angle using position feedback.", val: "SG90, 0–180°" },

  { name: "Bridge rectifier", sym: "BR", cat: "Power", use: "Converts AC to pulsating DC using four diodes.", val: "KBP206" },
  { name: "Fuse", sym: "F", cat: "Power", use: "Breaks the circuit when current gets too high.", val: "1 A to 20 A" },
  { name: "Li-ion cell", sym: "BAT", cat: "Power", use: "Rechargeable source for portable electronics.", val: "3.7 V nominal" },

  { name: "8051 MCU", sym: "51", cat: "Microcontroller", use: "Classic 8-bit microcontroller from embedded courses.", val: "AT89C51" },
  { name: "ATmega328P", sym: "328", cat: "Microcontroller", use: "The chip inside the Arduino Uno.", val: "8-bit AVR, 16 MHz" },
  { name: "Raspberry Pi Pico", sym: "PICO", cat: "Microcontroller", use: "Dual-core ARM board with PIO for custom protocols.", val: "RP2040" },
  { name: "FPGA", sym: "FPGA", cat: "Microcontroller", use: "Reconfigurable chip for building custom digital hardware.", val: "Xilinx, Intel, Lattice" }
];

// Logic gates. n = number of inputs, fn = the gate's logic function.
const GATES = [
  { name: "AND", n: 2, expr: "Y = A · B", use: "Output is 1 only when every input is 1.", ex: "Example: a motor runs only when the key is on AND the button is pressed.", fn: (a, b) => a & b },
  { name: "OR", n: 2, expr: "Y = A + B", use: "Output is 1 when at least one input is 1.", ex: "Example: an alarm sounds if the door OR the window is open.", fn: (a, b) => a | b },
  { name: "NOT", n: 1, expr: "Y = A'", use: "Inverts its input: 0 becomes 1 and 1 becomes 0.", ex: "Example: turns an active-high signal into an active-low one.", fn: (a) => 1 - a },
  { name: "NAND", n: 2, expr: "Y = (A · B)'", use: "Inverted AND. NAND gates alone can build every other gate.", ex: "Example: the basic building block of most memory chips.", fn: (a, b) => 1 - (a & b) },
  { name: "NOR", n: 2, expr: "Y = (A + B)'", use: "Inverted OR. NOR gates alone can also build every other gate.", ex: "Example: used in control logic and some memory circuits.", fn: (a, b) => 1 - (a | b) },
  { name: "XOR", n: 2, expr: "Y = A ⊕ B", use: "Output is 1 when the two inputs are different.", ex: "Example: the sum bit of a half adder.", fn: (a, b) => a ^ b },
  { name: "XNOR", n: 2, expr: "Y = (A ⊕ B)'", use: "Output is 1 when the two inputs are the same.", ex: "Example: a simple equality comparator.", fn: (a, b) => 1 - (a ^ b) }
];

// VLSI roadmap. Each step has its own colour.
const ROADMAP = [
  {
    title: "Digital logic", c: "#2563eb", sum: "How bits become circuits.",
    topics: ["Boolean algebra and K-maps", "Gates, adders, and multiplexers", "Flip-flops, counters, and state machines"],
    tools: "Logisim Evolution"
  },
  {
    title: "Semiconductors and CMOS", c: "#7c3aed", sum: "The transistor that every chip is built from.",
    topics: ["PN junctions and diodes", "MOS operation and threshold voltage", "CMOS inverter, NAND, and NOR", "Delay and power"],
    tools: "LTspice"
  },
  {
    title: "Hardware description language", c: "#db2777", sum: "Describe hardware in code.",
    topics: ["Verilog or SystemVerilog", "RTL design and synchronous reset", "Testbenches and waveforms"],
    tools: "Icarus Verilog, GTKWave"
  },
  {
    title: "FPGA and synthesis", c: "#ea580c", sum: "Turn your code into working hardware.",
    topics: ["Logic synthesis", "Timing constraints", "Place and route", "Testing on a real board"],
    tools: "Yosys with nextpnr, or Vivado"
  },
  {
    title: "ASIC design flow", c: "#16a34a", sum: "From RTL code to a chip layout.",
    topics: ["Gate-level netlist", "Floorplanning, placement, and routing", "Clock tree synthesis", "Static timing, DRC, and LVS"],
    tools: "OpenLane, OpenROAD, Magic, KLayout"
  },
  {
    title: "Verification and test", c: "#0d9488", sum: "Prove the design works, then make it testable.",
    topics: ["Coverage-driven verification", "UVM or cocotb testbenches", "Scan insertion and ATPG"],
    tools: "Verilator, cocotb"
  }
];
