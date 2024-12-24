from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route('/save_message', methods=['POST'])
def save_message():
    data = request.get_json()
    message = data.get('message')
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    with open('chat_log.txt', 'a', encoding='utf-8') as f:
        f.write(f'{timestamp} - {message}\n')

    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True)
