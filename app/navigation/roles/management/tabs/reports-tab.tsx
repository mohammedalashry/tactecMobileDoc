// roles/management/tabs/reports-tab.tsx
import {TabIcons} from 'navigation/common/icons/tab-icons';
import {createTopTabs} from '../../../common/factories/create-top-tabs';
import {translate} from '@app/i18n';

// Import screens
import MedicalScreen from 'screens/Management/Reports/Medical/MedicalScreen';
import TacticalScreen from 'screens/Management/Reports/Tactical/TacticalScreen';

// Define tab screens
const reportsTabScreens = [
  {
    name: 'TacticalScreen',
    component: TacticalScreen,
    label: translate('tabs.Tactical'),
    icon: ({color}) => TabIcons.tacticalScreen({color}),
  },
  {
    name: 'MedicalScreen',
    component: MedicalScreen,
    label: translate('tabs.Medical'),
    icon: ({color}) => TabIcons.medicalScreen({color}),
  },
];

// Create and export the reports tab
export const ReportsTab = createTopTabs(reportsTabScreens, {
  showIcons: true,
});
