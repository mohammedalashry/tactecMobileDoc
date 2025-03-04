// roles/medical/tabs/medical-tab.tsx
import {createTopTabs} from '../../../common/factories/create-top-tabs';
import {TabIcons} from '../../../common/icons/tab-icons';
import {translate} from '@app/i18n';

// Import screens
import {
  WellnessCheckScreen,
  MedicalComplaintsScreen,
} from 'screens/Medical/Medical/MedicalScreen';

// Define tab screens
const medicalTabScreens = [
  {
    name: 'WellnessCheckScreen',
    component: WellnessCheckScreen,
    label: translate('tabs.WellnessCheck'),
    icon: ({color}) => TabIcons.wellness({color}),
  },
  {
    name: 'MedicalComplaintsScreen',
    component: MedicalComplaintsScreen,
    label: translate('tabs.MedicalComplaints'),
    icon: ({color}) => TabIcons.medicalComplaints({color}),
  },
];

// Create and export the medical tab
export const MedicalTab = createTopTabs(medicalTabScreens, {
  showIcons: true,
});
