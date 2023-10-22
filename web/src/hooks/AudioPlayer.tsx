export class AudioPlayer {
  ctx: AudioContext;
  current_buffer_source: AudioBufferSourceNode | null;
  current_gain_node: GainNode | null;
  current_analyzer_node: AnalyserNode | null;
  record_ids: string[];
  is_loop: boolean;
  is_shuffle: boolean;
  volume = 0.11;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.current_buffer_source = null;
    this.current_gain_node = null;
    this.current_analyzer_node = null;
    this.record_ids = [];
    this.is_loop = false;
    this.is_shuffle = false;
  }

  async _loadAndPlay(video_id: string) {
    const response = await fetch(`/music/${video_id}.mp3`);
    const array_buffer = await response.arrayBuffer();
    const audio_buffer = await this.ctx.decodeAudioData(array_buffer);
    if (this.current_buffer_source !== null) {
      this.current_buffer_source.disconnect();
      this.current_gain_node?.disconnect();
      this.current_analyzer_node?.disconnect();
    }

    this.current_buffer_source = this.ctx.createBufferSource();
    this.current_buffer_source.connect(this.ctx.destination);

    this.current_gain_node = this.ctx.createGain();
    this.current_buffer_source.connect(this.current_gain_node);
    this.current_gain_node.connect(this.ctx.destination);
    this.current_gain_node.gain.setValueAtTime(0, this.ctx.currentTime);

    this.current_analyzer_node = this.ctx.createAnalyser();
    this.current_buffer_source.connect(this.current_analyzer_node);
    this.current_analyzer_node.connect(this.ctx.destination);
    this.current_analyzer_node.fftSize = 512;

    // analyzer_changed global event
    const changedEvent = new CustomEvent("analyzer_changed", {
      detail: {
        analyzer_node: this.current_analyzer_node,
      },
    });
    window.dispatchEvent(changedEvent);

    this.current_buffer_source.buffer = audio_buffer;
    this.current_buffer_source.start();

    this.current_buffer_source.onended = () => {
      const current_index = this.record_ids.findIndex((id) => id === video_id);
      let next_index = 0;
      if (this.is_shuffle) {
        next_index = Math.floor(Math.random() * this.record_ids.length);
      }
      if (current_index === this.record_ids.length - 1) {
        if (this.is_loop) {
          next_index = 0;
        } else {
          return;
        }
      } else {
        next_index = current_index + 1;
      }
      this.playAt(next_index);
      // audio_ended global event
      const endedEvent = new CustomEvent("audio_ended", {
        detail: {
          video_id: this.record_ids[next_index],
        },
      });
      window.dispatchEvent(endedEvent);
    };
    return this.current_analyzer_node;
  }

  async playAt(index: number) {
    const video_id = this.record_ids[index];
    return this._loadAndPlay(video_id);
  }

  cueVideoIds(video_ids: string[]) {
    this.record_ids = video_ids;
  }

  resume() {
    this.ctx.resume();
  }

  suspend() {
    this.ctx.suspend();
  }

  setLoop(is_loop: boolean) {
    this.is_loop = is_loop;
  }

  setShuffle(is_shuffle: boolean) {
    this.is_shuffle = is_shuffle;
  }

  setVolume(volume: number) {
    if (this.current_gain_node) {
      this.volume = volume / 100;
      this.current_gain_node.gain.setValueAtTime(
        this.volume,
        this.ctx.currentTime + 1
      );
    }
  }

  getFFTDataArray() {
    if (this.current_analyzer_node) {
      const buffer_length = this.current_analyzer_node.frequencyBinCount; // fftSize / 2
      const data_array = new Uint8Array(buffer_length);
      this.current_analyzer_node?.getByteTimeDomainData(data_array);
      return data_array;
    } else {
      return [];
    }
  }
}
