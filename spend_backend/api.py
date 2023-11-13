from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import psycopg2

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Function to get a connection to the database
def getConnection():
    conn = None
    try:
        conn = psycopg2.connect(host="localhost", database="spend_analysis", user="postgres", port="5432")
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        return conn

# Function to commit the changes and close the connection
def closeConnection(conn):
    conn.commit()
    conn.close()

# Function to get data from Database
def getDataFromDB(conn, query):
    val = None
    try:
        cur = conn.cursor()
        cur.execute(query)
        val = cur.fetchall()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        return val

@app.route('/get_data', methods=['GET'])
def getData():
    conn = getConnection()
    data = getDataFromDB(conn, "SELECT * FROM statements;")
    return data

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5002)