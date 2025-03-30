import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import BarChartIcon from "@mui/icons-material/BarChart";
import FunctionsIcon from "@mui/icons-material/Functions";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Button,
  Card,
  CardContent,
  GlobalStyles,
  Grid,
  Paper,
  Stack,
  Theme,
  Typography,
} from "@mui/material";

import vector2 from './assets/Vector 2.svg';
import vector4 from './assets/Vector 4.svg';
import vector5 from './assets/Vector 5.svg';
import vector6 from './assets/Vector 6.svg';
import vector23 from './assets/Vector 23.svg';
import vector24 from './assets/Vector 24.svg';
import vector25 from './assets/Vector 25.svg';
import { useState } from "react";


const HomeScreen = () => {
    // Oryginał
    // const [data, setData] = useState([{}])

    // const fetchTimeSeries = async () =>{
    //   fetch("/timeseries").then(
    //     res => res.json()

    //   ).then(
    //     data => {
    //       setData(data)
    //       console.log(data)
    //     }
    //   )
    // }
    
    // Nowe
    const [data, setData] = useState<any[]>([])

    const fetchTimeSeries = async () => {
        try {
            const response = await fetch("/timeseries");
            const result = await response.json();
            setData(result);
            console.log("Pobrane dane:", result);
        } catch (error) {
            console.error("Błąd pobierania danych:", error);
        }
    }

  // Data for metric cards
  const metricCards = [
    { id: 1, title: "Jakaś miara", value: "1 234" },
    { id: 2, title: "Jakaś miara", value: "5 678" },
    { id: 3, title: "Jakaś miara", value: "2 137" },
  ];

  // Data for chart months
  const months = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun"];

  // Data for chart legend
  const chartLegend = [
    { color: "primary.main", label: "Content" },
    { color: "error.main", label: "Content" },
    { color: "warning.main", label: "Content" },
  ];

  // Y-axis labels
  const yAxisLabels = [60, 20, -20, -60];

  return (
    <>
      {/* Globalne style - usunięcie marginesów */}
      <GlobalStyles
        styles={{
          "html, body": {
            margin: 0,
            padding: 0,
            height: "100%",
            width: "100%",
          },
        }}
      />
      
    <Box
      sx={{ 
        position: "relative",
        width: "100vw",
        height: "100vh",
        bgcolor: "common.white",
        }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          position: "absolute",
          width: "75px",
          height: "100%",
          top: 0,
          left: 0,
          bgcolor: "#e2e2e2",
        }}
      >
        <Box
          sx={{
            height: "74px",
            bgcolor: "#2a2a2a",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MenuIcon sx={{ width: 35, height: 35, color: "common.white" }} />
        </Box>

        <Stack spacing={2} alignItems="center" sx={{ mt: 5 }}>
          <Paper
            elevation={0}
            sx={{
              width: 60,
              height: 60,
              borderRadius: "15px",
              bgcolor: "common.white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <HomeIcon sx={{ width: 32, height: 32 }} />
          </Paper>

          <Paper
            elevation={0}
            sx={{
              width: 60,
              height: 60,
              borderRadius: "15px",
              bgcolor: "#d9d9d9",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <BarChartIcon sx={{ width: 32, height: 32 }} />
          </Paper>

          <Paper
            elevation={0}
            sx={{
              width: 60,
              height: 60,
              borderRadius: "15px",
              bgcolor: "#d9d9d9",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SettingsIcon sx={{ width: 32, height: 32 }} />
          </Paper>
        </Stack>
      </Box>

      {/* Main Content */}
      <Box sx={{ ml: "75px", p: 3 }}>
        {/* Options Dropdown */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Paper
            sx={{
              width: 350,
              height: 40,
              borderRadius: "25px",
              border: "1px solid black",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Poppins-Medium, Helvetica",
                fontSize: "22.9px",
                letterSpacing: "0.69px",
              }}
            >
              Options
            </Typography>
            <ArrowDropDownIcon sx={{ width: 38, height: 38 }} />
          </Paper>

          <Button
            variant="contained"
            sx={{
              bgcolor: "#afafaf",
              borderRadius: 2,
              fontFamily: "Inter-Bold, Helvetica",
              fontWeight: 700,
              
            }}
            onClick={fetchTimeSeries}
          >
            Wczytaj dane
          </Button>
        </Box>

        {/* Metric Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {metricCards.map((card) => (
            <Grid item xs={12} sm={4} key={card.id}>
              <Card
                sx={{
                  height: 149,
                  bgcolor: "#f7f7f7",
                  borderRadius: "25px",
                  border: "1px solid rgba(0, 0, 0, 0.2)",
                  position: "relative",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: "Roboto-Regular, Helvetica",
                      fontSize: "24px",
                      letterSpacing: "0.1px",
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="h1"
                    sx={{
                      fontFamily: "Roboto-Bold, Helvetica",
                      fontWeight: 700,
                      fontSize: "36px",
                      letterSpacing: "0.1px",
                      mt: 1,
                    }}
                  >
                    {card.value}
                  </Typography>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                    }}
                  >
                    <FunctionsIcon sx={{ width: 40, height: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Chart Section */}
        <Card
          sx={(theme: Theme) => ({
            p: 3,
            border: `1px solid ${theme.palette.grey[200]}`,
            borderRadius: 2,
          })}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Poppins-Medium, Helvetica",
                fontWeight: 500,
              }}
            >
              CHART TITLE
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontFamily: "Poppins-Medium, Helvetica",
                  fontWeight: 500,
                  fontSize: "12px",
                  mr: 1,
                }}
              >
                This Week
              </Typography>
              <ArrowDropDownIcon />
            </Box>
          </Box>

          <Typography
            variant="h1"
            color="secondary.main"
            sx={{
              fontFamily: "Poppins-Regular, Helvetica",
              fontWeight: 400,
              fontSize: "32px",
              letterSpacing: "-1.2px",
            }}
          >
            5.000,00
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontFamily: "Poppins-Regular, Helvetica",
              mb: 2,
            }}
          >
            50 Orders
          </Typography>

          {/* Chart */}
          <Box sx={{ display: "flex", height: 400, mb: 2 }}>
            {/* Y-axis labels */}
            <Stack justifyContent="space-between" sx={{ pr: 2, py: 1 }}>
              {yAxisLabels.map((label) => (
                <Typography
                  key={label}
                  variant="body2"
                  sx={{ fontFamily: "Inter, Helvetica" }}
                >
                  {label}
                </Typography>
              ))}
            </Stack>

            {/* Chart area */}
            <Box
              sx={(theme: Theme) => ({
                flex: 1,
                border: `1px solid ${theme.palette.grey[200]}`,
                position: "relative",
                backgroundImage: `url(${vector2}), url(${vector4})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "0 133px, 0 266px",
                backgroundSize: "100% 1px, 100% 1px",
              })}
            >
              {/* Chart grid lines */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${vector5}), url(${vector6}), url(${vector23}), url(${vector24}), url(${vector25})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition:
                    "204px 0, 408px 0, 613px 0, 817px 0, 1022px 0",
                  backgroundSize:
                    "1px 100%, 1px 100%, 1px 100%, 1px 100%, 1px 100%",
                }}
              />

              {/* Chart lines */}
              <Box
                component="img"
                sx={{
                  position: "absolute",
                  width: "calc(100% - 4px)",
                  height: "122px",
                  top: "133px",
                  left: "2px",
                }}
              />
              <Box
                component="img"
                sx={{
                  position: "absolute",
                  width: "calc(100% - 21px)",
                  height: "172px",
                  top: "5px",
                  left: "13px",
                }}
              />
              <Box
                component="img"
                sx={{
                  position: "absolute",
                  width: "calc(100% - 21px)",
                  height: "151px",
                  top: "4px",
                  left: "17px",
                }}
              />

              {/* Chart data points would be rendered here */}
              {/* This is a simplified representation */}
            </Box>
          </Box>

          {/* X-axis labels */}
          <Grid container>
            {months.map((month) => (
              <Grid item xs={2} key={month}>
                <Typography
                  variant="caption"
                  align="center"
                  sx={{ fontFamily: "Inter, Helvetica" }}
                >
                  {month}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {/* Chart Legend */}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            {chartLegend.map((item, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", mr: 0.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: item.color,
                      borderRadius: "50%",
                      mx: 1,
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "Poppins-Medium, Helvetica",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Card>
      </Box>
    </Box>
    </>
  );
};

export default HomeScreen;