from flask import Flask, render_template, jsonify
import threading
import scapy.all as scapy

app = Flask(__name__)

allowed_ips = ['192.168.1.1', '192.168.1.2']  # Define allowed IPs
traffic_data = []  # List to store traffic data
shutdown_triggered = False

def packet_handler(packet):
    global shutdown_triggered
    ip_src = packet[scapy.IP].src
    ip_dst = packet[scapy.IP].dst
    allowed = ip_src in allowed_ips

    traffic_data.append((ip_src, ip_dst, allowed))

    # Check for unknown IP access
    if not allowed and not shutdown_triggered:
        shutdown_triggered = True
        print(f"Unknown IP detected: {ip_src}")
        shutdown_system()

def shutdown_system():
    print("Shutting down the system due to unknown IP access...")

def start_sniffing():
    scapy.sniff(prn=packet_handler)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/traffic_data')
def get_traffic_data():
    allowed_count = sum(1 for _, _, allowed in traffic_data if allowed)
    disallowed_count = len(traffic_data) - allowed_count
    return jsonify({'allowed': allowed_count, 'disallowed': disallowed_count})

if __name__ == '__main__':
    # Start sniffing in a separate thread
    threading.Thread(target=start_sniffing, daemon=True).start()
    app.run(debug=True, host='0.0.0.0')
