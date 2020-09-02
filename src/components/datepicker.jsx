import React, { useState } from "react";
import DatePicker from "react-datepicker";
import setHours from 'date-fns/setHours'
import setMinutes from 'date-fns/setMinutes'
import "react-datepicker/dist/react-datepicker.css";

const Datepicker = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [excludedTimes, setExcludedTimes] = useState();

  let handleColor = time => {
    // return time.getHours() > 12 ? "text-success" : "text-error";
  };
  const getMinTime = () => {
    if (selectedDate.getDate() === new Date().getDate()) {
      return setHours(setMinutes(new Date(), 0), new Date().getHours() + 3)
    } else {
      return setHours(setMinutes(new Date(), 0), 0)
    }
  }

  const getMaxTime = () => {
    if (selectedDate.getDate() === new Date().getDate()) {
      return setHours(setMinutes(new Date(), 30), 23);
    } else {
      return setHours(setMinutes(new Date(), 30), 23);
    }
  }


  return (
    <DatePicker
      showTimeSelect
      selected={selectedDate}
      minDate={new Date()}
      // excludeTimes={getExcludedTimes()}
      minTime={getMinTime()}
      maxTime={getMaxTime()}
      onChange={date => {
        setSelectedDate(date);
        props.onDateSelect(date);
      }}
      dateFormat="MMMM d, yyyy h:mm aa"
      timeClassName={handleColor}
    />
  );
};

export default Datepicker


//   check product quantity available before checkout
//    check is consent
//  check prev date and time disable

