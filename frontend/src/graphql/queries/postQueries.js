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
