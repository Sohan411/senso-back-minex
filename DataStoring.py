import serial
import mysql.connector

# Create a MySQL connection
db = mysql.connector.connect(
  host="localhost",
  user="root",
  password="0000",
  database="rsense"
)

cursor = db.cursor()

# Open the serial port
ser = serial.Serial('COM2', 9600)

while True:
    data = ser.readline().decode('utf-8').strip()
    # Parse the incoming data
    flowRate, totalVolume = data.split(',')

    # Insert the data into the MySQL database
    sql = "INSERT INTO actual_data (flowRate, totalVolume) VALUES (%s, %s)"
    val = (flowRate, totalVolume)
    cursor.execute(sql, val)

    db.commit()
    print(cursor.rowcount, "record inserted.")
