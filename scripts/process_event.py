from decimal import Decimal, getcontext
from datetime import datetime
import numpy as np

getcontext().prec = 10
getcontext().rounding = 'ROUND_HALF_UP'

def event_calculations(device_id, event, cursor, cnx):
    cursor = cnx.cursor()

    start_date = event[0][1]
    end_date = event[-1][1]
    timestamp = start_date.strftime('%Y-%m-%d')

    query = "SELECT \
            d.maximumCookingLoad, \
            d.stoveEfficiency, \
            d.baselineEfficiency, \
            cp.fullLoad, \
            cp.twoThirdsLoad, \
            cp.halfLoad, \
            cp.startDate, \
            cp.endDate \
            FROM \
            Devices AS d \
            LEFT JOIN \
            ( \
                SELECT \
                *, \
                COALESCE(LEAD(startDate) OVER (ORDER BY startDate), DATE('9999-12-31')) AS endDate \
                FROM \
                Cooking_Percentages \
            ) AS cp ON d.id = cp.deviceId \
            WHERE \
            d.id = %s \
            AND DATE(cp.startDate) <= %s \
            AND DATE(endDate) >= %s;"
    cursor.execute(query, (device_id, timestamp, timestamp))

    rows = cursor.fetchall()

    if len(rows) > 0:
        device = rows[0]
        if device[0] is None or device[1] is None or device[2] is None or device[3] is None or device[4] is None or device[5] is None:
            return
        max_load = float(device[0])
        efficiency = Decimal(device[1] / 100)
        baseline_efficiency = Decimal(device[2] / 100)
        food_mass = float(device[3]) / 100 * max_load + float(device[4]) / 100 * max_load * 0.667 + float(device[5])/ 100 * max_load * 0.5
        # time difference between start_date and end_date
        duration = end_date - start_date
        duration = duration.total_seconds() / 3600
        total_temp = 0
        max_temp = 0
        total_fuel_mass = float(event[0][9])
        for i, row in enumerate(event[0:-1]):
            total_temp += float(row[3])
            max_temp = max(max_temp, float(row[3]))

        for i, row in enumerate(event):
            if i != 0 and i != len(event) - 1:
                prev_row = event[i - 1]
                if abs(float(row[9]) - float(prev_row[9])) > 0.05:
                    fuel_mass = float(row[9]) - float(prev_row[9])
                    total_fuel_mass += fuel_mass


        total_fuel_mass -= float(event[-1][9])

        average_temp = total_temp / (len(event) - 1)
        energy_consumption = Decimal(total_fuel_mass) * Decimal(16) * Decimal(0.277778)
        power = energy_consumption / Decimal(duration)
        useful_energy = 0
        useful_thermal_power = 0
        if(efficiency is not None):
            useful_energy = energy_consumption * efficiency
            useful_thermal_power = power * efficiency
        energy_savings = (energy_consumption / baseline_efficiency) - energy_consumption

        # Replace nan values with 0
        average_temp = np.nan_to_num(average_temp)
        max_temp = np.nan_to_num(max_temp)
        total_fuel_mass = np.nan_to_num(total_fuel_mass)
        food_mass = np.nan_to_num(food_mass)
        energy_consumption = np.nan_to_num(energy_consumption)
        power = np.nan_to_num(power)
        useful_energy = np.nan_to_num(useful_energy)
        useful_thermal_power = np.nan_to_num(useful_thermal_power)
        energy_savings = np.nan_to_num(energy_savings)

        date = datetime.now()
        query ="INSERT INTO Cooking_Events \
            (deviceId, startDate, endDate, duration, averageTemperature, maximumTemperature, totalFuelMass, \
            foodMass, energyConsumption, power, usefulEnergy, usefulThermalPower, energySavings, createdAt, updatedAt) \
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(query, (device_id, start_date, end_date, duration * 3600, average_temp, max_temp, total_fuel_mass,
                               food_mass, energy_consumption, power, useful_energy, useful_thermal_power, energy_savings, date, date))
        cnx.commit()
        lastrowid = cursor.lastrowid

        query = "UPDATE Device_logs SET event = %s WHERE id IN (%s);"
        id_list = []
        for row in event[0:-1]:
            id_list.append(row[0])

        placeholders = ', '.join(['%s'] * len(id_list))
        formatted_query = query % (lastrowid, placeholders)
        
        cursor.execute(formatted_query, id_list)
        cnx.commit()

        



