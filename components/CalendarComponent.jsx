import { text } from '@fortawesome/fontawesome-svg-core';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Calendar, DateObject } from 'react-native-calendars';
import calendarioEsp from './LocaleConfig';

const CalendarComponent = () => {
    
    calendarioEsp();    

  const [selectedRange, setSelectedRange] = useState({
    startDate: '',
    endDate: '',
  });

  const today = new Date().toISOString().split('T')[0];

  const onDayPress = (day) => {

    if (new Date(day.dateString) < new Date(today)) {        
        Alert.alert('Fecha Invalida', 'Las fechas de reserva no pueden estar en el pasado.');
        return;
    }
    if (!selectedRange.startDate || (selectedRange.startDate && selectedRange.endDate)) {
        setSelectedRange({ startDate: day.dateString, endDate: '' });        
    } else {
    if (new Date(day.dateString) < new Date(selectedRange.startDate)) {        
        Alert.alert('Fecha Invalida', 'La fecha de finalización debe ser posterior a la fecha de inicio.');
    } else {
        setSelectedRange({ ...selectedRange, endDate: day.dateString });        
    }
    }
  };

  const getMarkedDates = () => {
    const markedDates = {
        [today]: {             
            textColor: '#EBAD36',
        }
    };

    if (selectedRange.startDate) {
      markedDates[selectedRange.startDate] = {
        startingDay: true,
        color: '#EBAD36',
      };
    }

    if (selectedRange.endDate) {
      markedDates[selectedRange.endDate] = {
        endingDay: true,
        color: '#EBAD36',        
      };

      let start = new Date(selectedRange.startDate);
      let end = new Date(selectedRange.endDate);
      let date = new Date(start);

      while (date <= end) {
        const dateString = date.toISOString().split('T')[0];
        if (dateString !== selectedRange.startDate && dateString !== selectedRange.endDate) {
          markedDates[dateString] = {
            color: '#EEBA58',
          };
        }
        date.setDate(date.getDate() + 1);
      }
    }

    return markedDates;
  };

  return (
    <View style={styles.container}>
      <Calendar
        markingType={'period'}
        markedDates={getMarkedDates()}
        onDayPress={onDayPress}  
        theme={{arrowColor: '#EBAD36'}}        
        styles={styles.calendar}    
      />
      <Text style={styles.selectedDatesText}>
        {selectedRange.startDate && `Start Date: ${selectedRange.startDate}`}
        {selectedRange.endDate && `, End Date: ${selectedRange.endDate}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 20,
  },
  selectedDatesText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },    
  calendar: {
    borderRadius: 20,
  },
});

export default CalendarComponent;
