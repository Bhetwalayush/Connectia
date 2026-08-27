import { gql } from "@apollo/client";

export const GET_MUTUAL_SUGGESTIONS = gql`
  query GetMutualSuggestions($limit: Int!) {
    suggestedUsers(limit: $limit) {
      id
      username
      email
      mutualCount
      followsYou
    }
  }
`;
