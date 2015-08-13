//
//  processor.h
//

#ifndef __processor__
#define __processor__

#include <emscripten.h>
#include <stdint.h>

// -- oli: since WebAudioAPI uses always 32bit floats, I'm not sure if
// -- Processor class should be templated with the float definition. Plugin
// -- developer can use doubles or floats in his code as he likes, so
// -- maybe the template should be in a class which derives from Processor ?
#ifdef F64
typedef double tfloat;
#else
typedef float tfloat;
#endif

typedef unsigned char byte;
typedef struct
{
	float** inputs;
	float** outputs;
} AudioBus;


class Processor
{
// -- lifecycle
public:
	Processor() {}
	virtual const char* init(uint32_t bufsize, uint32_t sr, void* desc);
	virtual void terminate() {}
	virtual void resize(uint32_t bufsize) {}
	virtual ~Processor() {}

// -- audio and data streams
public:
	virtual void onProcess(AudioBus* audio, void* data) = 0;
	virtual void onMidi(byte status, byte data1, byte data2) {}
	virtual void onSysex(byte* msg, uint32_t size) {}
	virtual void onMessage(char* verb, char* res, double data) {}
	virtual void onMessage(char* verb, char* res, char* data) {}
	virtual void onParam(uint32_t idparam, double value) {}	// todo: other datatypes
	
// -- patches
public:
	virtual void onPatch(void* data, uint32_t size) {}
	
// -- controller interface
protected:
	void postMessage(const char* verb, const char* resource, void* data) {}
	
protected:
	uint32_t m_bufsize;
	uint32_t m_sr;
};

// for debugging
extern "C"
{
	void wam_logs(const char* s);
	void wam_logi(int i);
}

#endif
