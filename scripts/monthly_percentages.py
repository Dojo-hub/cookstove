import mysql.connector
import os
from dotenv import load_dotenv
import datetime

load_dotenv()

db_host = os.getenv('DB_HOST')
db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')
db_name = os.getenv('DB_NAME')

# Establish the database connection
cnx = mysql.connector.connect(user=db_user, password=db_password, host=db_host, database=db_name)
cursor = cnx.cursor()

# Get all device ids
query = "SELECT id, createdAt FROM devices"
cursor.execute(query)
devices = cursor.fetchall()

def create_cooking_percentage(device_id, month, start_date, full_load=60, two_thirds_load=20, half_load=10):
    # Calculate the end date as 30 days after the start date
    end_date = start_date + datetime.timedelta(days=30)
    
    # Insert the cooking percentage into the table
    query = "INSERT INTO cooking_percentages (deviceId, month, fullLoad, twoThirdsLoad, halfLoad, startDate, endDate, createdAt, updatedAt) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    values = (device_id, month, full_load, two_thirds_load, half_load, start_date, end_date, datetime.datetime.now(), datetime.datetime.now())
    cursor.execute(query, values)
    cnx.commit()

    return end_date

for device_id, start_date in devices:
    # Get the last row from cooking_percentages for the device
    query = "SELECT * FROM cooking_percentages WHERE deviceId = %s ORDER BY id DESC LIMIT 1"
    cursor.execute(query, (device_id,))
    rows = cursor.fetchall()

    if len(rows) > 0:
        last_start_date = rows[0][7]
        if last_start_date < datetime.datetime.now() - datetime.timedelta(days=1):
            # Calculate the next month and retrieve the load values from the last row
            i = int(rows[0][2][-1]) + 1
            full_load = rows[0][3]
            two_thirds_load = rows[0][4]
            half_load = rows[0][5]
            create_cooking_percentage(device_id, f"Month {i}", last_start_date, full_load, two_thirds_load, half_load)
        else:
            print(f"Device {device_id} already has cooking percentages up to {last_start_date}")
    else:
        i = 0
        # Add 30 days continuously until it is greater than today
        while start_date < datetime.datetime.now():
            i += 1
            start_date = create_cooking_percentage(device_id, f"Month {i}", start_date)

cursor.close()
cnx.close()
