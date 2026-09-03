import { gql } from "@apollo/client";

export const NOTIFICATIONS_UPDATED_SUBSCRIPTION = gql`
  subscription NotificationsUpdated($userId: Int!) {
    notificationsUpdated(userId: $userId) {
      notificationId
    }
  }
`;
