export class CommentCreatedEvent {
  constructor(
    public readonly commentId: string,
    public readonly postId: string,
    public readonly authorId: string,
  ) {}
}
