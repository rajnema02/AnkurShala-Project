import pyaudio

def list_audio_devices(p):
    info = p.get_host_api_info_by_index(0)
    numdevices = info.get('deviceCount')
    for i in range(0, numdevices):
        device_info = p.get_device_info_by_host_api_device_index(0, i)
        print(f"Device ID {i}: {device_info.get('name')} - Max Input Channels: {device_info.get('maxInputChannels')}, Max Output Channels: {device_info.get('maxOutputChannels')}")

def get_device_id(prompt):
    try:
        device_id = int(input(prompt))
    except ValueError:
        print("Invalid input. Please enter a number.")
        return get_device_id(prompt)
    return device_id

# Audio settings
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
RECORD_SECONDS = 5

# Initialize PyAudio
p = pyaudio.PyAudio()

# List devices
print("Available audio devices:")
list_audio_devices(p)

# Get user's choice for microphone and speakers
mic_device_id = get_device_id("Enter the device ID for the microphone: ")
system_speaker_id = get_device_id("Enter the device ID for the system speaker: ")
bluetooth_speaker_id = get_device_id("Enter the device ID for the Bluetooth speaker: ")

# Open stream for recording
input_stream = p.open(format=FORMAT,
                      channels=CHANNELS,
                      rate=RATE,
                      input=True,
                      input_device_index=mic_device_id,
                      frames_per_buffer=CHUNK)

print("Recording...")

frames = []

# Record for a few seconds
for _ in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
    data = input_stream.read(CHUNK)
    frames.append(data)

print("Finished recording.")

# Stop and close the input stream
input_stream.stop_stream()
input_stream.close()

def play_back(device_id):
    output_stream = p.open(format=FORMAT,
                           channels=CHANNELS,
                           rate=RATE,
                           output=True,
                           output_device_index=device_id)
    print(f"Playing back on device ID {device_id}...")
    for frame in frames:
        output_stream.write(frame)
    output_stream.stop_stream()
    output_stream.close()

# Play back on system speaker
play_back(system_speaker_id)

# Play back on Bluetooth speaker
#play_back(bluetooth_speaker_id)

# Terminate the PyAudio session
p.terminate()