import mysql.connector
import os
from dotenv import load_dotenv
from process_event import event_calculations
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

def find_event(cursor, device_id, start_id, sn, limit=1000):
    query = "SELECT * FROM Device_logs WHERE id > %s AND temperature IS NOT NULL AND weight IS NOT NULL AND deviceSerialNumber = %s ORDER BY timestamp ASC LIMIT %s;"
    cursor.execute(query, (start_id, sn, limit))

    rows = cursor.fetchall()

    first_above_80 = None
    first_below_80 = None

    for row in rows:
        if float(row[3]) > 80 and first_above_80 is None:
            first_above_80 = row[0]
        elif float(row[3]) < 80 and first_above_80 is not None:
            first_below_80 = row[0]
            break

    event = []
    if first_above_80 is not None and first_below_80 is not None:
        above_80 = False
        for row in rows:
            if row[0] == first_above_80:
                above_80 = True
            if above_80:
                event.append(row)
            if row[0] == first_below_80:
                break
                    
        if len(event) > 5:
            event_calculations(device_id, event, cursor, cnx)
        else:
            print("Range too small")

    return first_below_80, len(rows) < limit, event

def find_all_events(device):
    events_count = 0
    limit = 1000
    start_id = 0

    query = "SELECT start_id FROM cookstovemeta WHERE device_id = %s LIMIT 1"
    cursor.execute(query, (device[0],))

    rows = cursor.fetchall()

    if len(rows) > 0:
        start_id = rows[0][0]
    else:
        query = "INSERT INTO cookstovemeta (start_id, device_id) VALUES (0, %s)"
        cursor.execute(query, (device[0],))
        cnx.commit()
        start_id = 0   

    while True:
        start_at, end, event = find_event(cursor, device[0], start_id, device[3], limit)
        if len(event) > 0:
            limit = 1000
            events_count += 1
            start_id = start_at
        else:
            limit += 1000
        if end:
            break
    cursor.execute("UPDATE cookstovemeta SET start_id = %s WHERE device_id = %s", (start_id, device[0]))
    cnx.commit()
    print("Total events found: " + str(events_count))


query = "SELECT * FROM Devices WHERE serialNumber IN (SELECT DISTINCT deviceSerialNumber FROM Device_logs) AND maximumCookingLoad IS NOT NULL;"
cursor.execute(query)

rows = cursor.fetchall()

# get all events for each device
for row in rows:
    find_all_events(row)

cursor.close()
cnx.close()
