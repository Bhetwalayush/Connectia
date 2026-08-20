import { gql } from "@apollo/client";

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      success
      message
      post {
        id
        content
        imageUrl
        createdAt
        updatedAt
        likeCount
        likedByMe
        commentCount
        author {
          id
          username
          email
        }
      }
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
      success
      message
      post {
        id
        content
        imageUrl
        createdAt
        updatedAt
        likeCount
        likedByMe
        commentCount
        author {
          id
          username
          email
        }
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($postId: Int!) {
    deletePost(postId: $postId) {
      success
      message
    }
  }
`;
