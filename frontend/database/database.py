import psycopg2

conn = psycopg2.connect(database="g1727114_u", user = "g1727114_u", password = "nNrnFYebmJ", host = "db.doc.ic.ac.uk", port = "5432")

print("Connection successful")

cur = conn.cursor()

cur.execute("SELECT * from users")

rows = cur.fetchall()
for row in rows:
   print ("ID = ", row[0])
   print ("NAME = ", row[1])
   print ("ADDRESS = ", row[2])
   print ("SALARY = ", row[3], "\n")

print("Operation done successfully");
conn.close()
