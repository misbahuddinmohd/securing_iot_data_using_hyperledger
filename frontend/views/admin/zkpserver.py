from flask import Flask, request
import random
import hashlib
import requests
from flask_cors import CORS

app = Flask(__name__)

CORS(app)  # Enable CORS for all routes

def retrieve_doc_data(doctor_id):
    couchdb_url = 'http://localhost:5984'
    database_name = 'doctorsb'
    retrieve_url = f'{couchdb_url}/{database_name}/{doctor_id}'

    try:
        response = requests.get(retrieve_url)
        result = response.json()

        if response.status_code == 200:
            print(result)
            return result
        else:
            print(f'Error retrieving data for ID {doctor_id}: {result}')
            return {}
    except requests.RequestException as error:
        print(f'Error retrieving data for ID {doctor_id}: {error}')
        return {}


def is_prime(n, k=5):
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0:
        return False

    # Write n as 2^r * d + 1
    d = n - 1
    r = 0
    while d % 2 == 0:
        d //= 2
        r += 1

    # Witness loop
    for _ in range(k):
        a = random.randint(2, n - 1)
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        for _ in range(r - 1):
            x = pow(x, 2, n)
            if x == n - 1:
                break
        else:
            return False
    return True

def generate_prime(bits):
    # Generate a random prime number with specified bit length
    while True:
        p = random.getrandbits(bits)
        if is_prime(p):
            return p

def fiat_shamir_zkp(docbId, docb_sent_AuthToken):

    # server generates p, G, and sends it to doc a and doc b
    p = generate_prime(32)  # Adjust the bit length as needed
    G = random.randint(1, p)
    print(f"p value: {p}")
    print(f"G value: {G}")

    # server uses original auth token of doc b and computes secret number s
    doctor_data = retrieve_doc_data(docbId)
    orginal_AuthToken = doctor_data['doctor_token'].encode('utf-8')
    digest = hashlib.sha256(orginal_AuthToken).hexdigest()
    original_s = int(digest, 16) % p

    # server computes x and sends to doc a
    x = pow(G, original_s, p)
    print(f'server -> doc a: x = {x}')

    # doc b chooses a random t, computes y, and sends to doc a
    t = random.randint(1, p)
    y = pow(G, t, p)
    print(f'doc b -> doc a: y = {y}')

    # doc a chooses a random c and sends to doc b
    c = random.randint(1, p)
    print(f'doc a -> doc b: c = {c}')

    # doc b computes z using docb_sent_AuthToken and sends to doc a
    sent_AuthToken = docb_sent_AuthToken.encode('utf-8')
    digest = hashlib.sha256(sent_AuthToken).hexdigest()
    sent_s = int(digest, 16) % p
    z = (t - c * sent_s)
    print(f'doc b -> doc a: z = {z}')

    # doc a computes y_docb using c, x, and z
    if z < 0:
        # Find the Multiplicative Inverse 
        tm = pow(G, -z, p)
        m = pow(tm, -1, p)
    else:
        m = pow(G, z, p)
    n = pow(x, c, p)
    y_docb = (m * n) % p

    print(f"doc a computed y = {y_docb}")

    if y == y_docb:
        print('Success: doc b is authenticated !!!')
        return str(1)
    else:
        print('Failure: doc b is not authenticated !!!')
        return str(0)


@app.route('/fs_agreed_params')
def fs_agreed_params():
    docbId = request.args.get('docbId')
    docbToken = request.args.get('docbToken')

    # Use the parameters as needed
    result = fiat_shamir_zkp(docbId, docbToken)
    return result

if __name__ == '__main__':
    app.run(debug=True, port=7771)
