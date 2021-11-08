export class WarningException extends Error {
  constructor(args) {
    super(args);
    this.name = "WarningException";
  }
}
