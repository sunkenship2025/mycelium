export interface CompletionOptions {
  temperature?: number;
  maxTokens?: number;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  stream?: boolean;
}

export interface AIProvider {
  /**
   * Generates vector embeddings for a list of strings.
   */
  embed(text: string[]): Promise<number[][]>;

  /**
   * Generates a single completion for a prompt.
   */
  complete(prompt: string, options?: CompletionOptions): Promise<string>;

  /**
   * Conducts a chat completion, returning an async iterable for streaming responses.
   */
  chat(messages: Message[], options?: ChatOptions): AsyncIterable<string>;
}
