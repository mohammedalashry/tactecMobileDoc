import {Text} from 'react-native';

export const eventHour = eventDate => {
  const date = new Date(eventDate);

  var minutes = date.getMinutes();
  var hour = date.getHours();

  return `${hour}:${minutes}`;
};

export const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
export const eventDate = eventDate => {
  const date = new Date(eventDate);
  var month = date.getMonth(); //months from 1-12
  var day = date.getUTCDate();
  var dayString = date.toLocaleString('en-us', {weekday: 'long'});

  return (
    <Text>
      <Text style={{fontSize: 11}}>{dayString}</Text>, {day} {monthNames[month]}
    </Text>
  );
};

export const findMonthNum = (monthStr: string): number => {
  const selectedMonthNumIndex = monthNames?.findIndex(
    month => month === monthStr,
  );
  return selectedMonthNumIndex + 1;
};

export function formatAMPM(date) {
  var hours = date?.getHours();
  var minutes = date?.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

// ======================================================
export function timeTo12HrFormat(time) {
  // Take a time in 24 hour format and format it in 12 hour format
  var time_part_array = time.split(':');
  var ampm = 'AM';

  if (time_part_array[0] >= 12) {
    ampm = 'PM';
  }

  if (time_part_array[0] > 12) {
    time_part_array[0] = time_part_array[0] - 12;
  }

  const formatted_time = time_part_array[0];

  return formatted_time;
}
