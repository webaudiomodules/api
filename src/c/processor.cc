//
//  processor.cc
//

#include "processor.h"


const char* Processor::init(uint32_t bufsize, uint32_t sr, void* desc)
{
	m_bufsize = bufsize;
	m_sr = sr;
	return 0;	// custom descriptor not defined at DSP side
}

// JavaScript glue
extern "C"
{
	const char* wam_init(Processor* proc, uint32_t bufsize, uint32_t sr, void* desc) { return proc->init(bufsize,sr,desc); }
	void wam_terminate(Processor* proc) { proc->terminate(); }
	void wam_resize(Processor* proc, uint32_t bufsize) { proc->resize(bufsize); }
	void wam_onparam(Processor* proc, uint32_t idparam, float value) { proc->onParam(idparam, value); }
	void wam_onmidi(Processor* proc, byte status, byte data1, byte data2) { proc->onMidi(status, data1, data2); }
	void wam_onsysex(Processor* proc, byte* msg, uint32_t size) { proc->onSysex(msg, size); }
	void wam_onprocess(Processor* proc, AudioBus* audio, void* data) { proc->onProcess(audio, data); }
	void wam_onpatch(Processor* proc, void* data, uint32_t size) { proc->onPatch(data, size); }
	void wam_onmessageN(Processor* proc, char* verb, char* res, double data) { proc->onMessage(verb, res, data); }
	void wam_onmessageS(Processor* proc, char* verb, char* res, char* data) { proc->onMessage(verb, res, data); }
}

// for debugging
extern "C"
{
	void wam_logs(const char* s) { EM_ASM_INT(Module.print(Pointer_stringify($0)), s); }
	void wam_logi(int i) { EM_ASM_INT(Module.print($0), i); }
}
