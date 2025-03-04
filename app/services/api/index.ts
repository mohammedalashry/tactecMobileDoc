// services/api/index.ts

// Export base services
export * from './baseApiService';
export * from './cachedApiService';

// Export domain services
export * from './taskService';
export * from './matchService';
export * from './trainingService';
export * from './medicalComplaintService';
export * from './checkInService';
export * from './userProfileService';

// You can also re-export specific instances if needed
import {taskService} from './taskService';
import {matchService} from './matchService';
import {trainingService} from './trainingService';
import {medicalComplaintService} from './medicalComplaintService';
import {checkInService} from './checkInService';
import {userProfileService} from './userProfileService';

export {
  taskService,
  matchService,
  trainingService,
  medicalComplaintService,
  checkInService,
  userProfileService,
};
