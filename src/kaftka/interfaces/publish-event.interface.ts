export interface PublishEvent<T> {
  topic: string;
  key?: string;
  value: T;
  headers?: Record<string, string>;
}
