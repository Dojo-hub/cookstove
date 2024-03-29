// update the timestamp of the logs to be after a test device is created
// to allow calculation of the event.
const getDate = (timestamp) => {
  const oldDate = new Date(timestamp * 1000);
  const hours = oldDate.getHours();
  const minutes = oldDate.getMinutes();
  const seconds = oldDate.getSeconds();

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();

  const date = new Date(year, month, day + 1, hours, minutes, seconds);

  return date.getTime() / 1000;
};

module.exports = [
  {
    timestamp: getDate(1683625505),
    weight: "6.01",
    temperature: "72.62",
    longitude: "32.527561",
    latitude: "0.373462",
    imei: "1234567890123456",
  },
  {
    timestamp: getDate(1683625475),
    weight: "6.00",
    temperature: "81.37",
    longitude: "32.527561",
    latitude: "0.373462",
    imei: "1234567890123456",
  },
  {
    timestamp: getDate(1683625445),
    weight: "6.00",
    temperature: "95.50",
    longitude: "32.527553",
    latitude: "0.373462",
    imei: "1234567890123456",
  },
  {
    timestamp: getDate(1683625415),
    weight: "6.00",
    temperature: "110.75",
    longitude: "32.527553",
    latitude: "0.373463",
    imei: "1234567890123456",
  },
  {
    timestamp: getDate(1683625385),
    weight: "6.01",
    temperature: "128.63",
    longitude: "32.527549",
    latitude: "0.373467",
    imei: "1234567890123456",
  },
  {
    timestamp: getDate(1683625355),
    weight: "6.05",
    temperature: "154.88",
    longitude: "32.527549",
    latitude: "0.373468",
    imei: "1234567890123456",
  },
  {
    timestamp: getDate(1683625325),
    weight: "7.30",
    temperature: "168.63",
    longitude: "32.527553",
    latitude: "0.373468",
    imei: "1234567890123456",
  },
  {
    timestamp: getDate(1683625295),
    weight: "7.38",
    temperature: "167.13",
    longitude: "32.527553",
    latitude: "0.373467",
    imei: "1234567890123456",
  },
  {
    timestamp: getDate(1683625265),
    weight: "7.48",
    temperature: "167.63",
    longitude: "32.527553",
    latitude: "0.373473",
    imei: "1234567890123456",
  },
  {
    timestamp: getDate(1683625235),
    weight: "7.63",
    temperature: "161.88",
    longitude: "32.527553",
    latitude: "0.373480",
    imei: "1234567890123456",
  },
  {
    timestamp: getDate(1683625205),
    weight: "7.58",
    temperature: "156.63",
    longitude: "32.527553",
    latitude: "0.373473",
    imei: "1234567890123456",
  },
  {
    timestamp: getDate(1683625175),
    weight: "7.63",
    temperature: "152.00",
    longitude: "32.527534",
    latitude: "0.373473",
    imei: "1234567890123456",
  },
  {
    timestamp: getDate(1683625145),
    weight: "7.42",
    temperature: "147.63",
    longitude: "32.527530",
    latitude: "0.373468",
    imei: "1234567890123456",
  },
  {
    timestamp: getDate(1683625115),
    weight: "7.29",
    temperature: "141.63",
    longitude: "32.527526",
    latitude: "0.373463",
    imei: "1234567890123456",
  },
  {
    timestamp: getDate(1683625085),
    weight: "7.11",
    temperature: "124.25",
    longitude: "0.000000",
    latitude: "0.000000",
    imei: "1234567890123456",
  },
  {
    timestamp: getDate(1683625055),
    weight: "6.70",
    temperature: "70.37",
    longitude: "32.527599",
    latitude: "0.373458",
    imei: "1234567890123456",
  },
  {
    timestamp: getDate(1683625025),
    weight: "6.71",
    temperature: "71.00",
    longitude: "32.527595",
    latitude: "0.373457",
    imei: "1234567890123456",
  },
];
