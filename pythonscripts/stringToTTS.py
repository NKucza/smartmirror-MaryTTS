#!/usr/bin/python
# coding: utf8
import httplib, urllib


# A basic mary client in Python,
# kindly donated to the MARY TTS project
# by Hugh Sasse. Thanks Hugh!

# A very basic Python class for accessing
# the MARY TTS system using the modern 
# HTTP server.
# Warning, this is probably ghastly Python,
# most of my time of late has been with 
# other languages, so I'm not up to date
# with all the stylistic conventions of 
# modern Python.
# This does seem to work OK though.

class maryclient:
	"""A basic handler for MARY-TTS HTTP clients
	At present, there is no checking for
	allowed voices, locales, and so on.
	Most of the useful parameters can be
	accessed by get_ and set_ methods.
	Relying on winsound, this is Windows
	specific.
	"""
	def __init__(self):
		"""Set up useful defaults (for
		people in England, anyway)"""
		self.host = "127.0.0.1"
		self.port = 59125
		self.input_type = "TEXT"
		self.output_type = "AUDIO"
		self.audio = "WAVE"
		self.locale = "de"
		self.voice = "dfki-pavoque-neutral-hsmm"

	def generate(self, message):
		"""Given a message in message,
		return a response in the appropriate
		format."""
		raw_params = {"INPUT_TEXT": message,
				"INPUT_TYPE": self.input_type,
				"OUTPUT_TYPE": self.output_type,
				"LOCALE": self.locale,
				"AUDIO": self.audio,
				"VOICE": self.voice,
				}
		params = urllib.urlencode(raw_params)
		headers = {}

		# Open connection to self.host, self.port.
		conn = httplib.HTTPConnection(self.host, self.port)

		# conn.set_debuglevel(5)
        
		conn.request("POST", "/process", params, headers)
		response = conn.getresponse()
		if response.status != 200:
			print (response.getheaders())
			raise RuntimeError("{0}: {1}".format(response.status,
				response.reason))
		return response.read()


if __name__ == "__main__":

	# For handling command line arguments:
	import sys
	import platform
	import pyaudio
	import wave
	import signal
	import json
	from io import StringIO, BytesIO
	import time

	def to_node(type, message):
		# convert to json and print (node helper will read from stdout)
		try:
			print(json.dumps({type: message}))
		except Exception:
			pass
		# stdout has to be flushed manually to prevent delays in the node helper communication
		sys.stdout.flush()
	
	to_node("status", "TTS starting...")

	p = pyaudio.PyAudio()

	german_client = maryclient()
	german_client.audio = "WAVE_FILE"  # for example
	english_client = maryclient()
	english_client.voice = "dfki-prudence"
	english_client.locale = "en_GB"


	#define stream chunk   
	chunk = 1024

	def shutdown(self, signum):
		to_node("status", 'Shutdown: closing all streams')
		p.terminate()
		if 'stream' in locals():
			stream.stop_stream()
			stream.close()
		exit()

	signal.signal(signal.SIGINT, shutdown)


	while True:

		lines = sys.stdin.readline()
		data = json.loads(lines)
		if 'ger' in data:
			sentence = data['ger'].encode('UTF8')
			the_sound = german_client.generate(sentence)
		if 'en' in data:
			sentence = data['en'].encode('UTF8')
			the_sound = english_client.generate(sentence)

		
		wav = wave.open(BytesIO(the_sound))

		if not 'stream' in locals():
			stream = p.open(format = p.get_format_from_width(wav.getsampwidth()),  
							channels = wav.getnchannels(),  
							rate = wav.getframerate(),  
							output = True)
		else:
			stream.start_stream()
				


		data = wav.readframes(chunk)  

		#play stream  
		while data:  
			stream.write(data)  
			data = wav.readframes(chunk)

		stream.stop_stream()
		time.sleep(0.25)



	"""
	if len(sys.argv) > 1:
		stuffToSay = sys.argv[1:]
		for item in stuffToSay:
			the_sound = client.generate(item)
			wav = wave.open(BytesIO(the_sound))
   
			stream = p.open(format = p.get_format_from_width(wav.getsampwidth()),  
							channels = wav.getnchannels(),  
							rate = wav.getframerate(),  
							output = True)

			#read data  
			data = wav.readframes(chunk)  

			#play stream  
			while data:  
				stream.write(data)  
				data = wav.readframes(chunk)  


	"""	


	




