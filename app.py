from flask import Flask, render_template, url_for, redirect, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/send_results', methods=['POST'])
def send_results():
    print('here')

    data = request.get_json(force=True)
    print(data)

    return "success"

if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0", port=8080, threaded=True)