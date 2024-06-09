import random
import hashlib

def fiat_shamir():
    # random.seed(101)

    # Doc-B and Doc-A agree on p and G
    p = 701
    G = 3

    # Doc-B hashes her password and computes her secret number s
    password = 'S3cr3t!'.encode('utf-8')
    digest = hashlib.md5(password).hexdigest()
    s = int(digest, 16) % p


    # Doc-B computes x and sends to Doc-A
    x = pow(G, s, p)

    print(f'Doc-B -> Doc-A: x = {x}')

    # Doc-B chooses a random t, computes y, and sends to Doc-A
    t = random.randint(1, p)
    print(G, t, p)
    y = pow(G, t, p)

    print(f'Doc-B -> Doc-A: y = {y}')

    # Doc-A chooses a random c and sends to Doc-B
    c = random.randint(1, p)

    print(f'Doc-A -> Doc-B: c = {c}')

    # Doc-B computes z and sends to Doc-A
    print(t, c, s)
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
        print('Success: Doc-B verified !!!')
    else:
        print('Failure: Doc-B imposter !!!')

fiat_shamir()
