export class VoiceWebSocket {
  private socket: WebSocket;

  constructor(url: string, onMessage: (data: Blob) => void) {
    this.socket = new WebSocket("ws://localhost:8080/ws");
    this.socket.binaryType = "arraybuffer";

    this.socket.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        const blob = new Blob([event.data], { type: "audio/wav" });
        onMessage(blob);
      }
    };
  }

  sendAudio(blob: Blob) {
    if (this.socket.readyState === WebSocket.OPEN) {
      blob.arrayBuffer().then((buffer) => {
        this.socket.send(buffer);
      });
    }
  }
}
