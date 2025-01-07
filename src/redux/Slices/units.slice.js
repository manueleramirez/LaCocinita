import { createSlice } from "@reduxjs/toolkit";

// Create a measurement units object
const measurementUnits = {
  units: [
    // Weight
    {
      code: "g", // abreviatura de "gram"
      singularName: "gramo",
      pluralName: "gramos",
      conversions: [],
    },
    {
      code: "kg", // abreviatura de "kilogram"
      singularName: "kilogramo",
      pluralName: "kilogramos",
      conversions: [],
    },
    {
      code: "t", // abreviatura de "ton"
      singularName: "tonelada",
      pluralName: "toneladas",
      conversions: [],
    },
    {
      code: "mg", // abreviatura de "milligram"
      singularName: "miligramo",
      pluralName: "miligramos",
      conversions: [],
    },
    {
      code: "oz", // abreviatura de "ounce"
      singularName: "onza",
      pluralName: "onzas",
      conversions: [],
    },
    {
      code: "lb", // abreviatura de "pound"
      singularName: "libra",
      pluralName: "libras",
      conversions: [],
    },
    // Volume
    {
      code: "l", // abreviatura de "liter"
      singularName: "litro",
      pluralName: "litros",
      conversions: [],
    },
    {
      code: "ml", // abreviatura de "milliliter"
      singularName: "mililitro",
      pluralName: "mililitros",
      conversions: [],
    },
    {
      code: "m3", // abreviatura de "cubic meter"
      singularName: "metro cubico",
      pluralName: "metros cúbicos",
      conversions: [],
    },
    {
      code: "gal", // abreviatura de "gallon"
      singularName: "galon",
      pluralName: "galones",
      conversions: [],
    },
    {
      code: "pt", // abreviatura de "pint"
      singularName: "pinta",
      pluralName: "pintas",
      conversions: [],
    },
    {
      code: "cup", // abreviatura de "cup"
      singularName: "taza",
      pluralName: "tazas",
      conversions: [],
    },
    {
      code: "unit", // abreviatura de "unit"
      singularName: "unidad",
      pluralName: "unidades",
      conversions: [],
    },
  ],
};

// Define weight conversions
measurementUnits.units[0].conversions = [
  { code: "kg", factor: 0.001 }, // grams to kilograms
  { code: "t", factor: 0.000001 }, // grams to tons
  { code: "mg", factor: 1000 }, // grams to milligrams
  { code: "oz", factor: 0.035274 }, // grams to ounces
  { code: "lb", factor: 0.00220462 }, // grams to pounds
];
measurementUnits.units[1].conversions = [
  { code: "g", factor: 1000 }, // kilograms to grams
  { code: "t", factor: 0.001 }, // kilograms to tons
  { code: "oz", factor: 35.274 }, // kilograms to ounces
  { code: "lb", factor: 2.20462 }, // kilograms to pounds
  { code: "cup", factor: 4.226752838 }, // kilograms to pounds
];
measurementUnits.units[2].conversions = [
  { code: "g", factor: 1000000 }, // tons to grams
  { code: "kg", factor: 1000 }, // tons to kilograms
];
measurementUnits.units[3].conversions = [
  { code: "g", factor: 0.001 }, // milligrams to grams
];
measurementUnits.units[4].conversions = [
  { code: "g", factor: 28.3495 }, // ounces to grams
];
measurementUnits.units[5].conversions = [
  { code: "g", factor: 453.592 }, // pounds to grams
];

// Define volume conversions
measurementUnits.units[6].conversions = [
  { code: "ml", factor: 1000 }, // liters to milliliters
  { code: "m3", factor: 0.001 }, // liters to cubic meters
  { code: "gal", factor: 0.264172 }, // liters to gallons
  { code: "pt", factor: 2.11338 }, // liters to pints
  { code: "cup", factor: 4.22675 }, // liters to cups
];
measurementUnits.units[7].conversions = [
  { code: "l", factor: 0.001 }, // milliliters to liters
];
measurementUnits.units[8].conversions = [
  { code: "l", factor: 1000 }, // cubic meters to liters
];
measurementUnits.units[9].conversions = [
  { code: "l", factor: 3.78541 }, // gallons to liters
];
measurementUnits.units[10].conversions = [
  { code: "l", factor: 0.473176 }, // pints to liters
];
measurementUnits.units[11].conversions = [
  { code: "l", factor: 0.236588 }, // cups to liters
  { code: "kg", factor: 10 }, // cups to kg
];

const unitsSlice = createSlice({
  name: "units",
  initialState: {
    units: measurementUnits.units,
  },
  reducers: {
    transform: (state, action) => {
      const { sourceUnit, targetUnit, value } = action.payload;
      const source = state.units.find((u) => u.id === sourceUnit);
      if (!source) throw new Error("La unidad de origen no existe.");

      const conversion = source.conversions.find((c) => c.id === targetUnit);
      if (!conversion)
        throw new Error("No existe una conversión para la unidad de destino.");

      state.transformedValue = value * conversion.factor;
    },
  },
});

export const { transform } = unitsSlice.actions;
export default unitsSlice.reducer;
