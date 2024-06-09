from flask import Flask, request, jsonify, render_template
import random
import hashlib
from flask_cors import CORS
from datetime import timedelta


app = Flask(__name__)


CORS(app)  # Enable CORS for all routes

@app.route('/getxy')
def getxy():
    # Retrieve parameters from the URL query string
    prime = request.args.get('prime')
    generator = request.args.get('generator')

    # Generate values for x and y
    # Doc-B and Doc-A agree on p and G
    # p = 701
    # G = random.randint(1, p)
    p = int(prime)
    G = int(generator)


    # Doc-B hashes his password and computes his secret number s
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

    # You can use the parameters as needed
    # For demonstration, concatenate the parameters with x and y
    response_data = {
        'x': x,
        'y': y,
        's': s,
        't': t,
    }
    return jsonify(response_data)


@app.route('/getc')
def getc():
    # Retrieve parameters from the URL query string
    C = request.args.get('c')
    response_data = {
        'C': C,
    }
    return jsonify(response_data)


@app.route('/getz')
def getz():
    S = request.args.get('s')
    T = request.args.get('t')
    C = request.args.get('c')
    t=int(T)
    c=int(C)
    s=int(S)
    print(t, c, s)
     # Doc-B computes z and sends to Doc-A (****** chnage  ********)
    z = (t - c * s) 
    # z = 100
    print(f'Doc-B -> Doc-A: z = {z}')

    # You can use the parameters as needed
    # For demonstration, concatenate the parameters with z
    response_data = {
        'z': z,
    }
    return jsonify(response_data)


if __name__ == '__main__':
    app.run(debug=True, port=7772)
