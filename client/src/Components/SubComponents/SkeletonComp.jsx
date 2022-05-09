import { Paper, Grid, Avatar, Typography, Skeleton } from "@mui/material";
import React from "react";

const SkeletonComp = () => {
  return (
    <>
      {[1, 2].map((val) => {
        return (
          <Paper
            key={val}
            sx={{
              p: 2,
              margin: "10px 0px",
              flexGrow: 1,
              overflowWrap: "anywhere",
            }}
          >
            <Grid
              xs={12}
              // sm={2}
              item
              container
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                <Skeleton animation="wave" variant="circular">
                  <Avatar sx={{ width: 56, height: 56 }} />
                </Skeleton>
              </Grid>
              <Grid
                item
                container
                sm
                direction="column"
                style={{ marginLeft: "20px" }}
              >
                <Grid item>
                  <Typography component="div" variant={"h3"}>
                    <Skeleton animation="wave" />
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography component="div" width="15%" variant={"caption"}>
                    <Skeleton animation="wave" />
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography component="div" variant={"h3"}>
                    <Skeleton animation="wave" />
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        );
      })}
    </>
  );
};

export default SkeletonComp;
