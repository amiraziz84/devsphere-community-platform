export class NotificationEvent {
  constructor(
    public readonly recipientId: string,
    public readonly title: string,
    public readonly message: string,
    public readonly type: string, // e.g. 'POST', 'COMMENT', 'REACTION'
  ) {}
}
