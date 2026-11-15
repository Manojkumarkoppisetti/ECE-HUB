// Edit this file to add or change content. No other file needs to change.

const PARTS = [
  { name: "Resistor", symbol: "R", category: "Passive", use: "Limits current and sets voltage levels by dividing voltage.", typical: "1 Ω to 10 MΩ" },
  { name: "Capacitor", symbol: "C", category: "Passive", use: "Stores charge. Filters noise and smooths power supply rails.", typical: "1 pF to 1000 µF" },
  { name: "Inductor", symbol: "L", category: "Passive", use: "Stores energy in a magnetic field. Used in filters and DC-DC converters.", typical: "1 nH to 1 H" },
  { name: "Crystal oscillator", symbol: "X", category: "Timing", use: "Provides a stable clock reference for microcontrollers and digital logic.", typical: "32.768 kHz to 100 MHz" },
  { name: "Diode", symbol: "D", category: "Semiconductor", use: "Passes current in one direction. Used in rectifiers and protection circuits.", typical: "Silicon forward drop about 0.7 V" },
  { name: "LED", symbol: "LED", category: "Optoelectronic", use: "Emits light when forward-biased. Always use a series resistor.", typical: "Red about 1.8 to 2.2 V forward" },
  { name: "BJT transistor", symbol: "Q", category: "Semiconductor", use: "Current-controlled switch or amplifier.", typical: "e.g. 2N3904" },
  { name: "MOSFET", symbol: "M", category: "Semiconductor", use: "Voltage-controlled switch. The basic device in CMOS and VLSI.", typical: "e.g. 2N7000" },
  { name: "Op-amp", symbol: "U", category: "IC", use: "High-gain differential amplifier for signal conditioning.", typical: "e.g. LM358" },
  { name: "555 timer", symbol: "U", category: "IC", use: "Builds timers and oscillators with a few external parts.", typical: "e.g. NE555" },
  { name: "Microcontroller", symbol: "MCU", category: "IC", use: "A small computer on one chip: CPU, memory, and peripherals.", typical: "e.g. ATmega328P, STM32" }
];

const ROADMAP = [
  {
    title: "Digital logic",
    summary: "Learn how bits become circuits.",
    topics: ["Boolean algebra and K-maps", "Logic gates, adders, and multiplexers", "Flip-flops, counters, and state machines"],
    tools: "Logisim Evolution"
  },
  {
    title: "Semiconductor and CMOS basics",
    summary: "Understand the transistor that every chip is built from.",
    topics: ["PN junctions and diodes", "MOS operation and threshold voltage", "CMOS inverter, NAND, and NOR gates", "Propagation delay and power"],
    tools: "LTspice"
  },
  {
    title: "Hardware description language",
    summary: "Describe hardware in code.",
    topics: ["Verilog or SystemVerilog syntax", "RTL design and synchronous reset", "Testbenches and waveforms"],
    tools: "Icarus Verilog, GTKWave"
  },
  {
    title: "FPGA and synthesis",
    summary: "Turn your code into working hardware.",
    topics: ["Logic synthesis", "Timing constraints", "Place and route on an FPGA", "Testing on a real development board"],
    tools: "Yosys with nextpnr, or Vivado"
  },
  {
    title: "ASIC design flow",
    summary: "Take a design from RTL to a chip layout.",
    topics: ["Synthesis to a gate-level netlist", "Floorplanning, placement, and routing", "Clock tree synthesis", "Static timing analysis, DRC, and LVS"],
    tools: "OpenLane, OpenROAD, Magic, KLayout"
  },
  {
    title: "Verification and test",
    summary: "Prove the design works and can be tested after fabrication.",
    topics: ["Coverage-driven verification", "UVM or cocotb testbenches", "Scan insertion and ATPG", "Pick a specialty: front-end, back-end, DFT, or analog"],
    tools: "Verilator, cocotb"
  }
];
