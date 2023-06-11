import { Column } from "@ant-design/plots";
import { Card, Grid, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

// use colors from pallette based on #FF8C00
const charts = [
  {
    title: "Average Duration",
    yField: "avgDuration",
    color: "#6E44FF",
    label: "hours",
  },
  {
    title: "Average Energy Consumption",
    yField: "avgEnergyConsumption",
    color: "#EF7A85",
    label: "kWh",
  },
  {
    title: "Average Food Mass",
    yField: "avgFoodMass",
    color: "#FF1F93",
    label: "kg",
  },
  {
    title: "Average Fuel Mass",
    yField: "avgFuelMass",
    color: "#FF90B3",
    label: "kg",
  },
  {
    title: "Average Power",
    yField: "avgPower",
    color: "#EF7A85",
    label: "kW",
  },
  {
    title: "Average Temperature",
    yField: "avgTemperature",
    color: "#B892FF",
    label: "°C",
  },
  {
    title: "Maximum Temperature",
    yField: "maxTemperature",
    color: "#B892FF",
    label: "°C",
  },
  {
    title: "Average Energy Savings",
    yField: "avgEnergySavings",
    color: "#EF7A85",
    label: "kWh",
  },
  {
    title: "Average Useful Energy",
    yField: "avgUsefulEnergy",
    color: "#EF7A85",
    label: "kWh",
  },
];

export default function Charts({ data, groupBy, loading }) {
  const [config, setConfig] = useState({});

  useEffect(() => {
    const updatedConfig = {
      data,
      xField: groupBy,
      label: {
        position: "middle",
        style: {
          fill: "#FFFFFF",
          opacity: 0.6,
        },
      },
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
          formatter: (value) => {
            if (groupBy === "month") return value;
            return value.slice(5);
          },
        },
      },
      yAxis: {
        title: {
          style: {
            fill: "#000000",
            fontWeight: "bold",
          },
        },
      },
    };
    setConfig(updatedConfig);
  }, [data]);

  return (
    <Grid container spacing={2}>
      {charts.map(({ color, label, title, yField }) => (
        <Grid key={title} item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">{title}</Typography>
            {loading ? (
              <Skeleton height={200} />
            ) : (
              <Column
                {...{
                  ...config,
                  yField,
                  color,
                  yAxis: {
                    ...config.yAxis,
                    title: {
                      ...config.yAxis.title,
                      text: `${yField} (${label})`,
                    },
                  },
                }}
              />
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
