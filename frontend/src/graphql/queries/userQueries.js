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
