from flask import Flask, request, jsonify, render_template
import random
import hashlib
from flask_cors import CORS

app = Flask(__name__)

CORS(app)  # Enable CORS for all routes


def fiat_shamir(prime, generator, docbToken):
    # random.seed(101)

    #####################  FROM PROVER TO VERIFIER  #####################
    #####################################################################

    # Doc-B and Doc-A agree on p and G
    # p = 701
    # G = random.randint(1, p)
    p = int(prime)
    G = int(generator)


    # Doc-B hashes her password and computes her secret number s
    password = 'S3cr3t!'.encode('utf-8')
    digest = hashlib.md5(password).hexdigest()
    s = int(digest, 16) % p
    # digest = docbToken
    # s = int(digest, 16) % p

    # Doc-B computes x and sends to Doc-A
    x = pow(G, s, p)

    print(f'Doc-B -> Doc-A: x = {x}')

    # Doc-B chooses a random t, computes y, and sends to Doc-A
    t = random.randint(1, p)
    y = pow(G, t, p)

    print(f'Doc-B -> Doc-A: y = {y}')

    #####################  FROM VERIFIER TO PROVER  #####################
    #####################################################################

    # Doc-A chooses a random c and sends to Doc-B
    c = random.randint(1, p)

    print(f'Doc-A -> Doc-B: c = {c}')

    #####################  FROM PROVER TO VERIFIER  #####################
    #####################################################################

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
    app.run(debug=True, port=7777)
