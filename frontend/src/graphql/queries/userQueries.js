import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql`
  query Me {
    me {
      id
      email
      username
      bio
      profilePictureUrl
    }
  }
`;

export const GET_PROFILE = gql`
  query GetProfile($userId: Int!) {
    user(userId: $userId) {
      id
      username
      email
      bio
      profilePictureUrl
      followersCount
      followingCount
      isFollowing
      followsYou
    }
  }
`;

export const SEARCH_USERS = gql`
  query SearchUsers($query: String!) {
    searchUsers(query: $query) {
      id
      username
      email
      profilePictureUrl
    }
  }
`;
