"""
Fixed values used by SOLARIS.

These are no longer asked from the user: the backend always uses them.
"""

# Typical system losses (inverter, wiring, dust, temperature, ...)
PERFORMANCE_RATIO = 0.75

# Electricity prices in ₹/kWh
GRID_TARIFF = 8
EXPORT_TARIFF = 5

# Direction the panels face -> azimuth angle used by the Open-Meteo API.
# Open-Meteo convention: 0 = south, -90 = east, 90 = west, +/-180 = north.
# The user only ever picks a direction name; the angle stays on the backend.
FACING_TO_AZIMUTH = {
    "S": 0,
    "SW": 45,
    "W": 90,
    "NW": 135,
    "N": 180,
    "NE": -135,
    "E": -90,
    "SE": -45,
}
