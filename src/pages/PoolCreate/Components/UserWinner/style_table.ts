import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  tableUserJoin: {
    minHeight: 300,
  },
  middleColumn: {
    width: 60,
  },
  smallColumn: {
    width: 60,
  },
  totalAllocation: {
    marginTop: 40,
    display: "flex",
    justifyContent: "flex-end",
    paddingRight: 85,
    "& .label": {
      marginRight: 80,
    },
  },
  errorMessage: {
    fontWeight: 500,
    marginTop: 30,
    textAlign: "center",
    fontSize: 15,
    color: "red",
  },
  noDataMessage: {
    fontWeight: 500,
    marginTop: 30,
    textAlign: "center",
    fontSize: 15,
  },
  pagination: {
    marginTop: 30,
    fontSize: 12,
    fontWeight: 400,
    "& .MuiPagination-ul": {
      justifyContent: "center",
    },
    "& .MuiPaginationItem-page.Mui-selected": {
      backgroundColor: "#FFCC00",
    },
  },
});

export default useStyles;
