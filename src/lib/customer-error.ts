export class CustomerStoreError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "CustomerStoreError";
    this.status = status;
  }
}
