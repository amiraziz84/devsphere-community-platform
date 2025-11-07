import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
    @ApiProperty({example: 'this is a comment', description: 'comments conten'})
    content: string;
    @ApiProperty({example: 'post-id-uuid', description: 'id of the post being commented on'})
    postId: string;
    @ApiProperty({example: 'parent-comment-id', required: false, description: 'parent comment id (for replies)'})
    parentId: string;
}
