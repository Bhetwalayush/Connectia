import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query GetPosts {
    posts {
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
`;

export const GET_POSTS_BY_USER = gql`
  query GetPostsByUser($userId: Int!) {
    postsByUser(userId: $userId) {
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
`;

export const GET_POST = gql`
  query GetPost($postId: Int!) {
    post(postId: $postId) {
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
`;
