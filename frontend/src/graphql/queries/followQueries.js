import { gql } from "@apollo/client";

export const GET_FOLLOWERS = gql`
  query GetFollowers($userId: Int!) {
    followers(userId: $userId) {
      id
      username
    }
  }
`;

export const GET_FOLLOWING = gql`
  query GetFollowing($userId: Int!) {
    following(userId: $userId) {
      id
      username
    }
  }
`;
