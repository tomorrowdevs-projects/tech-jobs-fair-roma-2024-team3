import { useState } from "react";

interface Props {
  updateWeek: (weeksDayupdate: any[]) => void;
}

const WeeklyRepeatC = ({ updateWeek }: Props) => {
  const weeksDaySet = [
    {
      day: "Monday",
      check: false,
    },
    {
      day: "Tuesday",
      check: false,
    },
    {
      day: "Wednesday",
      check: false,
    },
    {
      day: "Thursday",
      check: false,
    },
    {
      day: "Friday",
      check: false,
    },
    {
      day: "Saturday",
      check: false,
    },
    {
      day: "Sunday",
      check: false,
    },
  ];

  const [weeksDay, setWeeksDay] = useState(weeksDaySet);

  const handleInput = (index: number) => {
    const tempWeek = [...weeksDay];
    tempWeek[index].check = !tempWeek[index].check;
    console.log(index);
    console.log(tempWeek[index].check);
    setWeeksDay(tempWeek);
    updateWeek(weeksDay);
  };

  return (
    <>
      <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        {weeksDay.map((date, index) => {
          return (
            <li
              key={index}
              onClick={() => handleInput(index)}
              className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600"
            >
              <div className="flex items-center ps-3">
                <input
                  checked={date.check}
                  id={index + "-" + date.day}
                  type="checkbox"
                  value={date.day}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                />
                <label
                  htmlFor="vue-checkbox"
                  className="w-full py-3 text-sm font-medium text-gray-900 ms-2 dark:text-gray-300"
                >
                  {date.day}
                </label>
              </div>
            </li>
          );
        })}
      </ul>

      {/* <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
          <div className="flex items-center ps-3">
            <input
              id="vue-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
            <label
              htmlFor="vue-checkbox"
              className="w-full py-3 text-sm font-medium text-gray-900 ms-2 dark:text-gray-300"
            >
              Vue JS
            </label>
          </div>
        </li>
        <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
          <div className="flex items-center ps-3">
            <input
              id="react-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
            <label
              htmlFor="react-checkbox"
              className="w-full py-3 text-sm font-medium text-gray-900 ms-2 dark:text-gray-300"
            >
              React
            </label>
          </div>
        </li>
        <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
          <div className="flex items-center ps-3">
            <input
              id="angular-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
            <label
              htmlFor="angular-checkbox"
              className="w-full py-3 text-sm font-medium text-gray-900 ms-2 dark:text-gray-300"
            >
              Angular
            </label>
          </div>
        </li>
        <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
          <div className="flex items-center ps-3">
            <input
              id="laravel-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
            <label
              htmlFor="laravel-checkbox"
              className="w-full py-3 text-sm font-medium text-gray-900 ms-2 dark:text-gray-300"
            >
              Laravel
            </label>
          </div>
        </li>
      </ul> */}
    </>
  );
};

export default WeeklyRepeatC;
