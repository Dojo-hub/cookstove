import { Column } from "@ant-design/plots";
import { Card, Grid, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const charts = [
  {
    title: "Average Duration",
    yField: "avgDuration",
  },
  {
    title: "Average Energy Consumption",
    yField: "avgEnergyConsumption",
  },
  {
    title: "Average Food Mass",
    yField: "avgFoodMass",
  },
  {
    title: "Average Fuel Mass",
    yField: "avgFuelMass",
  },
  {
    title: "Average Power",
    yField: "avgPower",
  },
  {
    title: "Average Temperature",
    yField: "avgTemperature",
  },
  {
    title: "Maximum Temperature",
    yField: "maxTemperature",
  },
  {
    title: "Average Energy Savings",
    yField: "avgEnergySavings",
  },
  {
    title: "Average Useful Energy",
    yField: "avgUsefulEnergy",
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
        },
      },
    };
    setConfig(updatedConfig);
  }, [data]);

  return (
    <Grid container spacing={2}>
      {charts.map(({ title, yField }) => (
        <Grid key={title} item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">{title}</Typography>
            {loading ? (
              <Skeleton height={200} />
            ) : (
              <Column {...{ ...config, yField }} />
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
