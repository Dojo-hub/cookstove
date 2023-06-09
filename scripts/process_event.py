from decimal import Decimal, getcontext

getcontext().prec = 10
getcontext().rounding = 'ROUND_HALF_UP'

def event_calculations(device_id, event, event_id, cursor, cnx):
    cursor = cnx.cursor()

    start_date = event[0][1]
    end_date = event[-1][1]
    timestamp = start_date.strftime('%Y-%m-%d')

    query = "SELECT d.*, cp.* FROM devices AS d LEFT JOIN cooking_percentages AS cp ON d.id = cp.deviceId WHERE d.id = %s AND DATE(cp.startDate) <= %s AND DATE(cp.endDate) >= %s;"
    cursor.execute(query, (device_id, timestamp, timestamp))

    rows = cursor.fetchall()

    if len(rows) > 0:
        device = rows[0]
        if device[12] is None or device[11] is None or device[17] is None or device[27] is None or device[28] is None or device[29] is None:
            return
        max_load = float(device[12])
        efficiency = device[11] / 100
        baseline_efficiency = device[17] / 100
        food_mass = float(device[27]) * max_load + float(device[28]) * max_load * 0.667 + float(device[29]) * max_load * 0.5
        # time difference between start_date and end_date
        duration = end_date - start_date
        duration = duration.total_seconds() / 3600
        total_temp = 0
        max_temp = 0
        total_fuel_mass = float(event[0][9])
        for i, row in enumerate(event):
            total_temp += float(row[3])
            max_temp = max(max_temp, float(row[3]))
            
            if i != 0 and i != len(event) - 1:
                next_row = event[i + 1]
                if abs(float(next_row[9]) - float(row[9])) > 0.05:
                    fuel_mass = float(next_row[9]) - float(row[9])
                    total_fuel_mass += fuel_mass


        total_fuel_mass -= float(event[-1][9])

        average_temp = total_temp / len(event)
        energy_consumption = Decimal(food_mass) * Decimal(16) * Decimal(0.277778)
        power = energy_consumption / Decimal(duration)
        useful_energy = 0
        useful_thermal_power = 0
        if(efficiency is not None):
            useful_energy = energy_consumption * efficiency
            useful_thermal_power = power * efficiency
        energy_savings = (energy_consumption / baseline_efficiency) - energy_consumption

        query = "UPDATE cooking_events SET startDate = %s, endDate = %s, duration = %s, averageTemperature = %s, maximumTemperature = %s, totalFuelMass = %s, foodMass = %s, energyConsumption = %s, power = %s, usefulEnergy = %s, usefulThermalPower = %s, energySavings = %s WHERE id = %s"
        cursor.execute(query, (start_date, end_date, duration * 3600, average_temp, max_temp, total_fuel_mass, food_mass, energy_consumption, power, useful_energy, useful_thermal_power, energy_savings, event_id))
        cnx.commit()

        



