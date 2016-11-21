from flask import Flask, render_template, url_for, redirect, request
import pprint
from xml.etree.ElementTree import Element, SubElement, tostring, ElementTree
import datetime
import json
import os

app = Flask(__name__)
pprint = pprint.PrettyPrinter(indent=4)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/send_results', methods=['POST'])
def send_results():
    data = request.get_json(force=True)

    raw_data_path = os.path.join('raw_data', str(int(datetime.datetime.now().timestamp())) + '.json')
    with open(raw_data_path, 'w') as raw_file:
        json.dump(data, raw_file)
    
    parsed = parse_data(data)
    export_xml(parsed)

    return "success"


def convert_keycode(string):
    if string != "&#x8;":
        return str(ord(string))

    return "8"


def parse_data(data):
    trials = []
    version = {"version": "2.7.2",
                "trials": str(data['count']),
                "ticks": str(data['results'][0]['keysPressed'][0]['ticksVanilla'] - 5000),
                "seconds": str(data['results'][0]['keysPressed'][0]['secondsVanilla'] - 5),
                "date": 'Tuesday, November 8, 2016 12:36:25'}

    for i, t in enumerate(data['results']):
        trial = {"number": str(i + 1),
                "testing": str(t['isTest'] == True).lower(),
                "entries": str(len(t['keysPressed']) - 1)}
        
        entries = []
        t['keysPressed'].pop()
        for e in t['keysPressed']:
            entry = {"char": e['keyString'],
                    "value": convert_keycode(e['keyString']),
                    "ticks": str(e['ticksVanilla']),
                    "seconds": str(e['secondsVanilla'])}

            entries.append(entry)
        
        trials.append([trial,
                        t['orgString'].replace('\r', ''),
                        entries,
                        t['compiledString'].replace('\n', '')])

    return [version, trials]


def export_xml(p):
    root = Element('TextTest', p[0])
    for x in p[1]:
        trial = SubElement(root, "Trial", x[0])
        presented = SubElement(trial, "Presented")
        presented.text = x[1]

        for e in x[2]:
            entry = SubElement(trial, "Entry", e)

        transcribed = SubElement(trial, "Transcribed")
        transcribed.text = x[3]

    tree = ElementTree(root)
    current_date = datetime.datetime.now()
    req_date_values = [current_date.month, current_date.day, current_date.hour, format(current_date.minute, '02d')]

    export_filename = str(req_date_values[0])

    for i in range(1, len(req_date_values)):
        export_filename += "-" + str(req_date_values[i])

    xml_path = os.path.join('xml', export_filename + '.xml')

    tree.write(xml_path, encoding="utf-8")
    with open(xml_path, 'r+') as xml_file:
        data = xml_file.read()
        xml_file.seek(0)
        data = data.replace('amp;', '')
        xml_file.write(data)
        xml_file.truncate()


if __name__ == "__main__":
    app.debug = True    
    app.run(host="0.0.0.0", port=8080, threaded=True)