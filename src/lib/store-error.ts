export class OwnerStoreError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "OwnerStoreError";
    this.status = status;
  }
}

/** @deprecated Use OwnerStoreError */
export { OwnerStoreError as CustomerStoreError };
