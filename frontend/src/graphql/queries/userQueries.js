import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql`
  query Me {
    me {
      id
      email
      username
    }
  }
`;

export const GET_PROFILE = gql`
  query GetProfile($userId: Int!) {
    user(userId: $userId) {
      id
      username
      email
      followersCount
      followingCount
      isFollowing
    }
  }
`;

export const SEARCH_USERS = gql`
  query SearchUsers($query: String!) {
    searchUsers(query: $query) {
      id
      username
      email
    }
  }
`;
