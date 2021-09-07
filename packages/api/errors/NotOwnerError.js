export default class NotOwnerError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotOwnerError";
  }
}
