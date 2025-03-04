// components/CustomDatePicker.tsx
import React from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";

interface CustomDatePickerProps {
  currentDate: Dayjs;
  onChangeDate: (date: Dayjs) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ currentDate, onChangeDate }) => (
  <DatePicker
    onChange={onChangeDate}
    value={currentDate}
    presets={[
      { label: "Yesterday", value: dayjs().add(-1, "d") },
      { label: "Last Week", value: dayjs().add(-7, "d") },
      { label: "Last Month", value: dayjs().add(-1, "month") },
    ]}
  />
);

export default CustomDatePicker;
