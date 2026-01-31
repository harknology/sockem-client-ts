/** The result type returned by internals. */
export type ResultResponse<T> = T | { __success: string } | { error: string };

/** Connect to a Sockem WebSocket server. */
export class Sockem {
  #ws: WebSocket;

  /**
   * Create a new Sockem client.
   * @param endpoint The endpoint (https://my.host/ws) of the server.
   */
  constructor(private endpoint: string) {
    this.#ws = new WebSocket(endpoint);
  }

  /**
   * Send an authentication message to a Sockem server.
   * @param key The secret key (for server-side requests) or client key (for client-side requests from an authorized origin).
   * @returns The success or failure response.
   */
  async authenticate(key: string): Promise<ResultResponse<{}>> {
    this.send("__sockem:authenticate", key);
    return await this.receiveOne<{}>();
  }

  /**
   * Tell the server to subscribe to a channel.
   * @param channel The channel to subscribe to.
   * @returns The success or failure response.
   */
  async listen(channel: string): Promise<ResultResponse<{}>> {
    this.send("__sockem:listen", channel);
    return await this.receiveOne<{}>();
  }

  /**
   * Send an event.
   * @param channel The channel of the event.
   * @param data The data to send.
   */
  send(channel: string, data: unknown) {
    this.#ws.send(JSON.stringify({ name: channel, data }));
  }

  /**
   * Receive one event from the WebSocket.
   * @returns The event received.
   */
  receiveOneEvent(): Promise<MessageEvent<string>> {
    return new Promise((res) =>
      this.#ws.addEventListener("message", res, { once: true }),
    );
  }

  /**
   * Receive one (parsed) event from the WebSocket.
   * @returns The data of the event.
   */
  async receiveOne<T>(): Promise<ResultResponse<T>> {
    return <ResultResponse<T>>JSON.parse((await this.receiveOneEvent()).data);
  }

  /**
   * Indefinitely receive events from the server.
   */
  async *receive(): AsyncGenerator<unknown, void, unknown> {
    try {
      while (true) {
        yield await this.receiveOne();
      }
    } finally {
    }
  }
}
