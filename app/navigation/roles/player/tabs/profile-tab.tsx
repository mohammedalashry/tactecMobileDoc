// roles/player/tabs/profile-tab.tsx
import {createTopTabs} from '../../../common/factories/create-top-tabs';
import {translate} from '@app/i18n';

// Import screens
import {
  WellnessCheckScreen,
  PersonalDataScreen,
  MedicalComplaintsScreen,
} from 'screens/Player/Profile/ProfileScreens';

// Define tab screens
const profileTabScreens = [
  {
    name: 'WellnessCheckScreen',
    component: WellnessCheckScreen,
    label: translate('tabs.WellnessCheck'),
  },
  {
    name: 'PersonalDataScreen',
    component: PersonalDataScreen,
    label: translate('tabs.PersonalData'),
  },
  {
    name: 'MedicalComplaintsScreen',
    component: MedicalComplaintsScreen,
    label: translate('tabs.MedicalComplaints'),
  },
];

// Create and export the profile tab
export const ProfileTab = createTopTabs(profileTabScreens);
