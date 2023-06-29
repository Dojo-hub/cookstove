import mysql.connector
import os
from dotenv import load_dotenv
import sys

args = sys.argv

load_dotenv()

db_host = os.getenv('DB_HOST')
db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')
try:
    if args[1] == 'test':
        db_name = os.getenv('DB_NAME_TEST')
    else:
        db_name = os.getenv('DB_NAME')
except IndexError:
    db_name = os.getenv('DB_NAME')

# Establish the database connection
cnx = mysql.connector.connect(user=db_user, password=db_password, host=db_host, database=db_name)
cursor = cnx.cursor()

# Find all events that have been updated in the last 30 seconds
query = "SELECT cp.id, \
            cp.deviceId, \
            cp.fullLoad, \
            cp.twoThirdsLoad, \
            cp.halfLoad, \
            cp.startDate, \
            COALESCE( \
                (SELECT startDate \
                FROM Cooking_Percentages \
                WHERE \
                startDate > cp.startDate \
                AND updatedAt > NOW() - INTERVAL 2 DAY \
                ORDER BY startDate \
                LIMIT 1), \
                DATE('9999-12-31') \
            ) AS endDate, \
            devices.maximumCookingLoad \
            FROM Cooking_Percentages AS cp \
            LEFT JOIN Devices ON devices.id = cp.deviceId \
            WHERE \
            cp.updatedAt > UTC_TIMESTAMP() - INTERVAL 30 SECOND;"

cursor.execute(query)
rows = cursor.fetchall()

print(str(len(rows)) + " rows found for device " )

for row in rows:
    # update food_mass
    device_id = row[1]
    start_date = row[5]
    end_date = row[6]
    max_load = float(row[7])
    food_mass = float(row[2]) / 100 * max_load + float(row[3]) / 100 * max_load * 0.667 + float(row[4])/ 100 * max_load * 0.5
    query = "UPDATE Cooking_Events SET foodMass = %s WHERE deviceId = %s AND startDate >= %s AND startDate <= %s;"
    cursor.execute(query, (food_mass, device_id, start_date, end_date))
    cnx.commit()

cursor.close()
cnx.close()
