from flask import Flask, request, jsonify
import random
import hashlib


app = Flask(__name__)

# Function to compute modular exponentiation
def mod_exp(base, exponent, modulus):
    return pow(base, exponent, modulus)

import random
import hashlib

def fiat_shamir():
    random.seed(101)

    # Doc-B and Doc-A agree on p and G
    p = 701
    G = random.randint(1, p)

    # Doc-B hashes her password and computes her secret number s
    password = 'S3cr3t!'.encode('utf-8')
    digest = hashlib.md5(password).hexdigest()
    s = int(digest, 16) % p

    # Doc-B computes x and sends to Doc-A
    x = pow(G, s, p)

    print(f'Doc-B -> Doc-A: x = {x}')

    # Doc-B chooses a random t, computes y, and sends to Doc-A
    t = random.randint(1, p)
    y = pow(G, t, p)

    print(f'Doc-B -> Doc-A: y = {y}')

    # Doc-A chooses a random c and sends to Doc-B
    c = random.randint(1, p)

    print(f'Doc-A -> Doc-B: c = {c}')

    # Doc-B computes z and sends to Doc-A
    z = (t - c * s)

    print(f'Doc-B -> Doc-A: z = {z}')

    # Doc-A computes y using c, x, and z
    if z < 0:
        # Find the Multiplicative Inverse 
        tm = pow(G, -z, p)
        m = pow(tm, -1, p)
    else:
        m = pow(G, z, p)
    n = pow(x, c, p)
    doc_a_y = (m * n) % p

    print(f"Doc-A's computed y = {doc_a_y}")

    if y == doc_a_y:
        print('Success: Doc-B authenticated !!!')
    else:
        print('Failure: Doc-B not authenticated !!!')


@app.route('/auth_request', methods=['POST'])
def authenticate_request():
    data = request.json
    p = int(data['p'])
    g = int(data['g'])
    x = int(data['x'])

    v = mod_exp(g, x, p)

    # Send p, g, v to Doctor B (frontend)
    return jsonify({'v': v})

@app.route('/verify_auth', methods=['POST'])
def verify_authentication():
    data = request.json
    p = int(data['p'])
    g = int(data['g'])
    v = int(data['v'])
    y = int(data['y'])

    r = mod_exp(g, y, p)
    verification = (mod_exp(g, r, p) * mod_exp(v, y, p)) % p

    if verification == r:
        return jsonify({'authenticated': True})
    else:
        return jsonify({'authenticated': False})

if __name__ == '__main__':
    app.run(debug=True)
