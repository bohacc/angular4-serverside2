export class AuthActions {

  static AUTH_LOGIN_USER = '[Auth] Login Auth User';
  static AUTH_LOGIN_USER_IN_PROGRESS = '[Auth] Login Auth User In Progress';
  static AUTH_LOGIN_USER_FAIL = '[Auth] Login Auth User Fail';

  static AUTH_SIGNUP_USER = '[Auth] Signup Auth User';
  static AUTH_SIGNUP_USER_IN_PROGRESS = '[Auth] Signup Auth User In Progress';
  static AUTH_SIGNUP_USER_FAIL = '[Auth] Signup Auth User Fail';

  static AUTH_LOGOUT_USER = '[Auth] Logout Auth User';
  static AUTH_LOGOUT_USER_IN_PROGRESS = '[Auth] Logout Auth User In Progress';
  static AUTH_LOGOUT_USER_SUCCESS = '[Auth] Logout Auth User Success';

  static AUTH_USER_AUTHENTICATED = '[Auth] Auth User Authenticated';

  static AUTH_TOKEN_EXPIRED = '[Auth] Token Expired';

  static AUTH_INIT = '[Auth] Init';
  static AUTH_INIT_IN_PROGRESS = '[Auth] Init In Progress';
  static AUTH_INIT_FAIL = '[Auth] Init Fail';

  static INIT  = '[Auth] Service Init';


  /*
  // User Profile Actions
  static AUTH_UPDATE_PROFILE = '[Auth] Update Auth User Profile';
  static AUTH_UPDATE_PROFILE_SUCCESS = '[Auth] Update Auth User Profile Success';
  static AUTH_UPDATE_PROFILE_FAIL = '[Auth] Update Auth User Profile Fail';

  // Project Admin Actions
  static AUTH_ADD_TO_PROJECT_ADMINS = '[Auth] Add Auth User To Project Admins';
  static AUTH_ADD_TO_PROJECT_ADMINS_SUCCESS = '[Auth] Add Auth User To Project Admins Success';
  static AUTH_ADD_TO_PROJECT_ADMINS_FAIL = '[Auth] Add Auth User To Project Admins Fail';

  static AUTH_REMOVE_FROM_PROJECT_ADMINS = '[Auth] Remove Auth User From Project Admins';
  static AUTH_REMOVE_FROM_PROJECT_ADMINS_SUCCESS = '[Auth] Remove Auth User From Project Admins Success';
  static AUTH_REMOVE_FROM_PROJECT_ADMINS_FAIL = '[Auth] Remove Auth User From Project Admins Fail';

  // Task Admin Actions
  static AUTH_ADD_TO_TASK_ADMINS = '[Auth] Add Auth User To Task Admins';
  static AUTH_ADD_TO_TASK_ADMINS_SUCCESS = '[Auth] Add Auth User To Task Admins Success';
  static AUTH_ADD_TO_TASK_ADMINS_FAIL = '[Auth] Add Auth User To Task Admins Fail';

  static AUTH_REMOVE_FROM_TASK_ADMINS = '[Auth] Remove Auth User From Task Admins';
  static AUTH_REMOVE_FROM_TASK_ADMINS_SUCCESS = '[Auth] Remove Auth User From Task Admins Success';
  static AUTH_REMOVE_FROM_TASK_ADMINS_FAIL = '[Auth] Remove Auth User From Task Admins Fail';

  // Team Admin Actions
  static AUTH_ADD_TO_TEAM_ADMINS = '[Auth] Add Auth User To Team Admins';
  static AUTH_ADD_TO_TEAM_ADMINS_SUCCESS = '[Auth] Add Auth User To Team Admins Success';
  static AUTH_ADD_TO_TEAM_ADMINS_FAIL = '[Auth] Add Auth User To Team Admins Fail';

  static AUTH_REMOVE_FROM_TEAM_ADMINS = '[Auth] Remove Auth User From Task Admins';
  static AUTH_REMOVE_FROM_TEAM_ADMINS_SUCCESS = '[Auth] Remove Auth User From Task Admins Success';
  static AUTH_REMOVE_FROM_TEAM_ADMINS_FAIL = '[Auth] Remove Auth User From Task Admins Fail';
  
  // Assigned Task Actions
  static AUTH_ASSIGN_TO_TASK = '[Auth] Assign Auth User To Task';
  static AUTH_ASSIGN_TO_TASK_SUCCESS = '[Auth] Assign Auth User To Task Success';
  static AUTH_ASSIGN_TO_TASK_FAIL = '[Auth] Assign Auth User To Task Fail';

  static AUTH_UNASSIGN_FROM_TASK = '[Auth] Unassign Auth User From Task';
  static AUTH_UNASSIGN_FROM_TASK_SUCCESS = '[Auth] Unassign Auth User From Task Success';
  static AUTH_UNASSIGN_FROM_TASK_FAIL = '[Auth] Unassign Auth User From Task Fail';

  // Followed Project Actions
  static AUTH_FOLLOW_PROJECT = '[Auth] Auth User Follow Project';
  static AUTH_FOLLOW_PROJECT_SUCCESS = '[Auth] Auth User Follow Project Success';
  static AUTH_FOLLOW_PROJECT_FAIL = '[Auth] Auth User Follow Project Fail';

  static AUTH_UNFOLLOW_PROJECT = '[Auth] Auth User Unfollow Project';
  static AUTH_UNFOLLOW_PROJECT_SUCCESS = '[Auth] Auth User Unfollow Project Success';
  static AUTH_UNFOLLOW_PROJECT_FAIL = '[Auth] Auth User Unfollow Project Fail';

  // Member Projects
  static AUTH_LEAVE_PROJECT = '[Auth] Auth User Leave Project';
  static AUTH_LEAVE_PROJECT_SUCCESS = '[Auth] Auth User Leave Project Success';
  static AUTH_LEAVE_PROJECT_FAIL = '[Auth] Auth User Leave Project Fail';

  // Member Teams
  static AUTH_LEAVE_TEAM = '[Auth] Auth User Leave Team';
  static AUTH_LEAVE_TEAM_SUCCESS = '[Auth] Auth User Leave Team Success';
  static AUTH_LEAVE_TEAM_FAIL = '[Auth] Auth User Leave Team Fail';

  // Newsletter Actions
  static AUTH_JOIN_NEWSLETTER = '[Auth] Auth User Join Newsletter';
  static AUTH_JOIN_NEWSLETTER_SUCCESS = '[Auth] Auth User Join Newsletter Success';
  static AUTH_JOIN_NEWSLETTER_FAIL = '[Auth] Auth User Join Newsletter Fail';

  static AUTH_LEAVE_NEWSLETTER = '[Auth] Auth User Leave Newsletter';
  static AUTH_LEAVE_NEWSLETTER_SUCCESS = '[Auth] Auth User Leave Newsletter Success';
  static AUTH_LEAVE_NEWSLETTER_FAIL = '[Auth] Auth User Leave Newsletter Fail';

  // Notification Actions
  static AUTH_READ_NOTIFICATION = '[Auth] Auth User Read Notification';
  static AUTH_READ_NOTIFICATION_SUCCESS = '[Auth] Auth User Read Notification Success';
  static AUTH_READ_NOTIFICATION_FAIL = '[Auth] Auth User Read Notification Fail';

  static AUTH_DELETE_NOTIFICATION = '[Auth] Auth User Delete Notification';
  static AUTH_DELETE_NOTIFICATION_SUCCESS = '[Auth] Auth User Delete Notification Success';
  static AUTH_DELETE_NOTIFICATION_FAIL = '[Auth] Auth User Delete Notification Fail';

  // Application Actions
  static AUTH_CREATE_APPLICATION = '[Auth] Auth User Create Application';
  static AUTH_CREATE_APPLICATION_SUCCESS = '[Auth] Auth User Create Application Success';
  static AUTH_CREATE_APPLICATION_FAIL = '[Auth] Auth User Create Application Fail';

  static AUTH_UPDATE_APPLICATION = '[Auth] Auth User Update Application';
  static AUTH_UPDATE_APPLICATION_SUCCESS = '[Auth] Auth User Update Application Success';
  static AUTH_UPDATE_APPLICATION_FAIL = '[Auth] Auth User Update Application Fail';

  static AUTH_DELETE_APPLICATION = '[Auth] Auth User Delete Application';
  static AUTH_DELETE_APPLICATION_SUCCESS = '[Auth] Auth User Delete Application Success';
  static AUTH_DELETE_APPLICATION_FAIL = '[Auth] Auth User Delete Application Fail';

  // Chat Actions
  static AUTH_CREATE_CHAT = '[Auth] Auth User Create Chat';
  static AUTH_CREATE_CHAT_SUCCESS = '[Auth] CAuth User Create Chat Success';
  static AUTH_CREATE_CHAT_FAIL = '[Auth] Auth User Create Chat Fail';

  static AUTH_UPDATE_CHAT = '[Auth] Auth User Update Chat';
  static AUTH_UPDATE_CHAT_SUCCESS = '[Auth] Auth User Update Chat Success';
  static AUTH_UPDATE_CHAT_FAIL = '[Auth] Auth User Update Chat Fail';

  static AUTH_DELETE_CHAT = '[Auth] Auth User Delete Chat';
  static AUTH_DELETE_CHAT_SUCCESS = '[Auth] Auth User Delete Chat Success';
  static AUTH_DELETE_CHAT_FAIL = '[Auth] Auth User Delete Chat Fail';

  // File Actions
  static AUTH_CREATE_FILE = '[Auth] Auth User Create File';
  static AUTH_CREATE_FILE_SUCCESS = '[Auth] Auth User Create File Success';
  static AUTH_CREATE_FILE_FAIL = '[Auth] Auth User Create File Fail';

  static AUTH_UPDATE_FILE = '[Auth] Auth User Update File';
  static AUTH_UPDATE_FILE_SUCCESS = '[Auth] Auth User Update File Success';
  static AUTH_UPDATE_FILE_FAIL = '[Auth] Auth User Update File Fail';

  static AUTH_DELETE_FILE = '[Auth] Auth User Delete File';
  static AUTH_DELETE_FILE_SUCCESS = '[Auth] Auth User Delete File Success';
  static AUTH_DELETE_FILE_FAIL = '[Auth] Auth User Delete File Fail';

  // Message Actions
  static AUTH_CREATE_MESSAGE = '[Auth] Auth User Create Message';
  static AUTH_CREATE_MESSAGE_SUCCESS = '[Auth] Auth User Create Message Success';
  static AUTH_CREATE_MESSAGE_FAIL = '[Auth] Auth User Create Message Fail';

  static AUTH_UPDATE_MESSAGE = '[Auth] Auth User Update Message';
  static AUTH_UPDATE_MESSAGE_SUCCESS = '[Auth] Auth User Update Message Success';
  static AUTH_UPDATE_MESSAGE_FAIL = '[Auth] Auth User Update Message Fail';

  static AUTH_DELETE_MESSAGE = '[Auth] Auth User Delete Message';
  static AUTH_DELETE_MESSAGE_SUCCESS = '[Auth] Auth User Delete Message Success';
  static AUTH_DELETE_MESSAGE_FAIL = '[Auth] Auth User Delete Message Fail';

  // Milestone Actions
  static AUTH_CREATE_MILESTONE = '[Auth] Auth User Create Milestone';
  static AUTH_CREATE_MILESTONE_SUCCESS = '[Auth] Auth User Create Milestone Success';
  static AUTH_CREATE_MILESTONE_FAIL = '[Auth] Auth User Create Milestone Fail';

  static AUTH_UPDATE_MILESTONE = '[Auth] Auth User Update Milestone';
  static AUTH_UPDATE_MILESTONE_SUCCESS = '[Auth] Auth User Update Milestone Success';
  static AUTH_UPDATE_MILESTONE_FAIL = '[Auth] Auth User Update Milestone Fail';

  static AUTH_DELETE_MILESTONE = '[Auth] Auth User Delete Milestone';
  static AUTH_DELETE_MILESTONE_SUCCESS = '[Auth] Auth User Delete Milestone Success';
  static AUTH_DELETE_MILESTONE_FAIL = '[Auth] Auth User Delete Milestone Fail';

  // Post Actions
  static AUTH_CREATE_POST = '[Auth] Auth User Create Post';
  static AUTH_CREATE_POST_SUCCESS = '[Auth] Auth User Create Post Success';
  static AUTH_CREATE_POST_FAIL = '[Auth] Auth User Create Post Fail';

  static AUTH_UPDATE_POST = '[Auth] Auth User Update Post';
  static AUTH_UPDATE_POST_SUCCESS = '[Auth] Auth User Update Post Success';
  static AUTH_UPDATE_POST_FAIL = '[Auth] Auth User Update Post Fail';

  static AUTH_DELETE_POST = '[Auth] Auth User Delete Post';
  static AUTH_DELETE_POST_SUCCESS = '[Auth] Auth User Delete Post Success';
  static AUTH_DELETE_POST_FAIL = '[Auth] Auth User Delete Post Fail';

  // Project Actions
  static AUTH_CREATE_PROJECT = '[Auth] Auth User Create Project';
  static AUTH_CREATE_PROJECT_SUCCESS = '[Auth] Auth User Create Project Success';
  static AUTH_CREATE_PROJECT_FAIL = '[Auth] Auth User Create Project Fail';

  static AUTH_UPDATE_PROJECT = '[Auth] Auth User Update Project';
  static AUTH_UPDATE_PROJECT_SUCCESS = '[Auth] Auth User Update Project Success';
  static AUTH_UPDATE_PROJECT_FAIL = '[Auth] Auth User Update Project Fail';

  static AUTH_DELETE_PROJECT = '[Auth] Auth User Delete Project';
  static AUTH_DELETE_PROJECT_SUCCESS = '[Auth] Auth User Delete Project Success';
  static AUTH_DELETE_PROJECT_FAIL = '[Auth] Auth User Delete Project Fail';

  // Role Actions
  static AUTH_CREATE_ROLE = '[Auth] Auth User Create Role';
  static AUTH_CREATE_ROLE_SUCCESS = '[Auth] Auth User Create Role Success';
  static AUTH_CREATE_ROLE_FAIL = '[Auth] Auth User Create Role Fail';

  static AUTH_UPDATE_ROLE = '[Auth] Auth User Update Role';
  static AUTH_UPDATE_ROLE_SUCCESS = '[Auth] Auth User Update Role Success';
  static AUTH_UPDATE_ROLE_FAIL = '[Auth] Auth User Update Role Fail';

  static AUTH_DELETE_ROLE = '[Auth] Auth User Delete Role';
  static AUTH_DELETE_ROLE_SUCCESS = '[Auth] Auth User Delete Role Success';
  static AUTH_DELETE_ROLE_FAIL = '[Auth] Auth User Delete Role Fail';

  // Team Actions
  static AUTH_CREATE_TEAM = '[Auth] Auth User Create Team';
  static AUTH_CREATE_TEAM_SUCCESS = '[Auth] Auth User Create Team Success';
  static AUTH_CREATE_TEAM_FAIL = '[Auth] Auth User Create Team Fail';

  static AUTH_UPDATE_TEAM = '[Auth] Auth User Update Team';
  static AUTH_UPDATE_TEAM_SUCCESS = '[Auth] Auth User Update Team Success';
  static AUTH_UPDATE_TEAM_FAIL = '[Auth] Auth User Update Team Fail';

  static AUTH_DELETE_TEAM = '[Auth] Auth User Delete Team';
  static AUTH_DELETE_TEAM_SUCCESS = '[Auth] Auth User Delete Team Success';
  static AUTH_DELETE_TEAM_FAIL = '[Auth] Auth User Delete Team Fail';*/

}
