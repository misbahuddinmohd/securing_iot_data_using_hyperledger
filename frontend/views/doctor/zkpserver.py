from flask import Flask, request, jsonify, render_template, session
import random
import hashlib
import requests
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def getxy(prime, generator):
    response = requests.get(f'http://localhost:7772/getxy?prime={prime}&generator={generator}')
    data = response.json()
    x = data['x']
    y = data['y']
    s = data['s']
    t = data['t']
    return x, y, s, t

def sendc(c):
    response = requests.get(f'http://localhost:7772/getc?c={c}')
    data = response.json()
    c = data['C']
    return c


def getz(s, t, c):
    response = requests.get(f'http://localhost:7772/getz?s={s}&t={t}&c={c}')
    data = response.json()
    z = data['z']
    return z


def fiat_shamir(prime, generator, docbToken):
    p=int(prime)
    G=int(generator)
    # random.seed(101)

    #####################  FROM PROVER TO VERIFIER  #####################
    #####################################################################

    # Doc-B computes x, y and sends to Doc-A
    x, y, s, t = getxy(prime, generator, )
    print(f'Doc-B -> Doc-A: x = {x}')
    print(f'Doc-B -> Doc-A: y = {y}')


    #####################  FROM VERIFIER TO PROVER  #####################
    #####################################################################

    # Doc-A chooses a random c and sends to Doc-B
    c = random.randint(1, p)
    print(f'Doc-A -> Doc-B: c = {c}')
    tp = sendc(c)

    #####################  FROM PROVER TO VERIFIER  #####################
    #####################################################################
    print(t, c, s)
    z = getz(s, t, c)
    z = int(z)
    print(f'Doc-B -> Doc-A: z = {z}')

    ######################  VERIFICATION PROCESS   ######################
    #####################################################################

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
        return str(1)
    else:
        print('Failure: Doc-B not authenticated !!!')
        return str(0)


@app.route('/fs_agreed_params')
def fs_agreed_params():
    prime = request.args.get('prime')
    generator = request.args.get('generator')
    docbToken = request.args.get('docbToken')

    # Use the parameters as needed
    result = fiat_shamir(prime, generator, docbToken)
    return result

if __name__ == '__main__':
    app.run(debug=True, port=7771)
