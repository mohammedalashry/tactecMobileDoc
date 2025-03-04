import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {color} from 'theme';
import {formatAMPM} from 'utils/dates/date';
import {sameDay} from 'utils/utility';
import {Agenda} from 'react-native-calendars';

const ProfileAgenda = ({
  navigation,
  navigateToMatch,
  navigateToTraining,
  navigateToTask,
  events,
  loadItems,
}) => {
  return (
    <View style={styles.calender}>
      <Agenda
        style={{width: '100%', backgroundColor: '#000'}}
        items={events}
        loadItemsForMonth={loadItems} // Function
        theme={{
          backgroundColor: color.blackbg,
          calendarBackground: color.blackbg,
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#fff',
          textDisabledColor: '#aaa',
        }}
        renderList={item => {
          const events: any = item?.items;

          return (
            <ScrollView style={{backgroundColor: color.blackbg}}>
              {Object.keys(item)?.length &&
                Object.values(events)?.map((event: any, index) => {
                  return sameDay(
                    new Date(event?.start),
                    new Date(item?.selectedDay),
                  ) ? (
                    <TouchableOpacity
                      onPress={() => {
                        if (event.type === 'match') {
                          navigation?.navigate(navigateToMatch, {
                            _id: event?._id,
                          });
                        } else if (event.type === 'task') {
                          navigation?.navigate(navigateToTask, {
                            _id: event?._id,
                          });
                        } else if (event.type === 'training') {
                          navigation?.navigate(navigateToTraining, {
                            _id: event?._id,
                          });
                        }
                      }}>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginVertical: 20,
                          borderBottomColor: '#ccc',
                          paddingBottom: 5,
                          borderBottomWidth: 1,
                        }}
                        key={index}>
                        <Text style={{fontSize: 18, color: '#fff'}}>
                          {event?.title}
                        </Text>
                        <Text style={{color: '#fff'}}>{event?.summary}</Text>
                        <View style={{marginTop: 10}}>
                          {event?.type === 'match' ? (
                            <Text style={{color: '#fff'}}>
                              Start At: {formatAMPM(new Date(event.start))}
                            </Text>
                          ) : (
                            <Text style={{color: '#fff'}}>
                              Assigned At: {formatAMPM(new Date(event.start))}
                            </Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : null;
                })}
            </ScrollView>
          );
        }}
        // markingType={'custom'}
        // markedDates={marksDate}
      />
    </View>
  );
};

export default ProfileAgenda;

const styles = StyleSheet.create({
  calender: {
    flex: 1,
    zIndex: -1,
    height: 500,
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: color.line,
    // borderWidth: 2,
    borderRadius: 20,
    marginTop: 50,
  },
  button: {
    width: '80%',
    height: 50,
    alignSelf: 'center',
    marginTop: 30,
    backgroundColor: color.background,
    borderColor: color.line,
    borderWidth: 2,
    borderRadius: 25,
    marginBottom: 20,
  },
});
