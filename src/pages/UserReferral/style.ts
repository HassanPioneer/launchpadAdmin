import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "20px 25px 30px 25px",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
    background: "#fff",
  },
  referralLink: {
    display: "Grid",
    gridTemplateColumns: "1fr 1fr",
    columnGap: 150,
  },
  userList: {
    display: "flex",
    flexDirection: "column",
    marginTop: 30,
    paddingTop: 30,
    borderTop: "1px solid #AEAEAE",
  },
  formTitle: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    width: "40%",
    fontSize: 20,
    fontWeight: 700,
  },
  formControl: {
    marginTop: 24,
    display: "flex",
    alignItems: "center",
  },
  formControlLabel: {
    width: "40%",
    letterSpacing: "0.25px",
    fontWeight: 500,
  },
  formErrorMessage: {},
  formControlInput: {
    width: "60%",
    display: "block",
    border: "1px solid #DFDFDF",
    padding: "13px",
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: "white",
    transition: ".1s all ease-in",

    "&:focus": {
      borderColor: "#FFCC00",
      outline: "none",
    },
    "& .MuiSelect-select": {
      paddingRight: 0,
    },
  },
  navBottom: {
    color: "#ffffff",
    display: "flex",

    "& li": {
      fontSize: 16,
      lineHeight: "32px",
      marginRight: 40,
      color: "#000",

      "&:last-child": {
        marginRight: 0,
      },
    },

    "&.multilTabBottom": {
      borderBottom: "1px solid rgb(255 255 255 / 10%)",

      "& li": {
        cursor: "pointer",
        paddingBottom: 7,
        marginBottom: -2,

        "&:after": {
          content: '""',
          display: "block",
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "100%",
          height: 3,
          borderRadius: 20,
          background: "transparent",
        },

        "&.active": {
          fontWeight: "bold",
          position: "relative",

          "&:after": {
            background: "#000",
          },
        },
      },
    },
  },
  btnImage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 12px",
    border: "none",
    borderRadius: 10,
    fontFamily: "Roboto-Medium",
    cursor: "pointer",
    transition: ".2s all ease-in",
    "&:focus": {
      outline: "none",
    },
    "&:hover": {
      boxShadow: "0px 15px 20px rgba(0, 0, 0, .1)",
      transform: "translateY(-5px)",
    },
    "&:disabled": {
      cursor: "not-allowed",
    },
    "& img": {
      width: 14,
      height: 14,
      marginRight: 8,
    },
  },
  btnEdit: { backgroundColor: "#FFCC00" },
  btnSave: { backgroundColor: "#00af12" },
  btnCancel: {
    backgroundColor: "#D01F37",
    color: "#fff",
    marginLeft: 12,
  },

  tableContainer: {
    padding: "30px 0px",
    borderRadius: 10,
    boxShadow: "none",
  },
  table: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 14,
    backgroundColor: "white",
  },
  tableHeader: {
    padding: "0px 0px 25px 30px",
    color: "#363636",
    fontWeight: 600,
    // display: "flex",
    // alignItems: "center",
    "& img": {
      width: 12,
      height: 18,
      marginLeft: 4,
      cursor: "pointer",
    },
  },
  tableBody: {
    "& > .MuiTableRow-root:last-child": {
      borderBottom: "1px solid #E5E5E5",
    },
    "& > .MuiTableRow-root:nth-child(odd)": {
      backgroundColor: "white",
    },
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
  skeleton: {
    padding: "25px 0px",
    marginTop: 10,
  },
  noDataMessage: {
    fontWeight: 500,
    marginTop: 30,
    textAlign: "center",
    fontSize: 15,
  },
  errorMessage: {
    fontWeight: 500,
    marginTop: 30,
    textAlign: "center",
    fontSize: 15,
    color: "red",
  },
  refreshCampaigns: {
    display: "flex",
    alignItems: "center",
    marginTop: 20,
    justifyContent: "space-between",
  },
  refreshCampaignsContainer: {
    display: "flex",
    cursor: "pointer",
    alignItems: "center",

    "&:hover .refreshCampaignsIcon": {
      transform: "rotateZ(180deg)",
      fill: "#FFCC00",
    },
  },
  refreshCampaignsText: {
    marginLeft: 10,
    fontWeight: 500,
    fontSize: 15,
    transition: ".2s all ease-in",
    fontFamily: "Roboto-Medium",
    marginTop: 13,
  },
  refreshCampaignsIcon: {
    transition: ".2s all ease-in",
  },
  bntDownload: {
    marginLeft: 12,
    backgroundColor: "#FFCC00",
    border: "none",
    borderRadius: 10,
    display: "inline-block",
    fontFamily: "Roboto-Medium",
    cursor: "pointer",
    transition: ".2s all ease-in",
    alignItems: "center",
    fontSize: 14,
    color: "white",
    fontWeight: 500,
    transform: "translateY(-7px)",
    "&:focus": {
      outline: "none",
    },
    "&:hover": {
      boxShadow: "0px 15px 20px rgba(0, 0, 0, .1)",
      transform: "translateY(-14px)",
    },
  },
  btnContent: {
    display: "flex",
    padding: "12px 15px 0 15px",
    alignItems: "center",
    fontSize: 14,
    color: "white",
    fontWeight: 500,
  },
  status: {
    display: "flex",
    alignItems: "center",
    "& img": {
      width: 15,
      height: 15,
      marginRight: 4,
    },
    "& .success": {
      color: "#00af12",
    },
    "& .pending": {
      color: "#D01F37",
    },
  },
  filterBar: {
    display: "flex",
    alignItems: "center",
    marginTop: 20,
    "& .title": {
      fontSize: 20,
      fontWeight: 500,
    },
  },
  selectBox: {
    font: "14px/24px Helvetica",
    color: "#000000",
    height: 36,
    // width: 160,
    marginRight: 6,
    backgroundColor: "#F0F0F0",
    // border: "1px solid #44454B",
    borderRadius: 4,

    "&::before, &::after": {
      display: "none",
    },

    "& select": {
      padding: 0,
      paddingLeft: 12,
      height: "100%",
    },

    "& .MuiSelect-select option": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },

    "& .MuiSelect-icon": {
      color: "#000",
      fontSize: 20,
      top: "calc(50% - 10px)",
      right: 4,
    },
    [theme.breakpoints.only("xs")]: {
      width: "100% !important" as any,
    },
  },
  dialog: {
    "& .MuiDialog-paperWidthSm": {
      width: 600,
    },
  },
  dialogTitle: {
    display: "flex",
    alignItems: "center",

    "& .title": {
      fontSize: 20,
      fontWeight: 700,
    },
    "& .wallet": {
      fontSize: 20,
      marginLeft: 50,
      fontWeight: 500,
    },
    "& .icon-close": {
      marginLeft: "auto",
      cursor: "pointer",
    },
    "& .icon-copy": {
      marginLeft: 20,
      cursor: "pointer",
    },
  },
  dialogContent: {
    padding: "8px 24px",
    overflowY: "initial",
  },
  dialogActions: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "8px 24px",
    marginTop: 15,

    "& > *:not(:last-child)": {
      marginRight: 5,
    },
  },
  dialogInput: {
    borderRadius: 5,
    border: "1px solid black",
    padding: "10px",
    transition: ".1s all ease-in",

    "&:focus": {
      borderColor: "#FFCC00",
      outline: "none",
    },
  },
  dialogLabel: {
    marginRight: 10,
    color: "#363636",
  },
  dialogButton: {
    textTransform: "inherit",
    backgroundColor: "#FFCC00",
    color: "white",
    fontWeight: 600,

    "&:hover": {
      backgroundColor: "#c29f15",
    },
  },
  dialogButtonCancel: {
    backgroundColor: "#e51d1d",

    "&:hover": {
      backgroundColor: "#a0033b",
    },
  },
  tableRow: {
    backgroundColor: "#f3f3f3",
    borderRadius: 5,

    "& > .MuiTableCell-root:first-child": {
      "border-top-left-radius": 5,
      "border-bottom-left-radius": 5,
    },

    "& > .MuiTableCell-root:last-child": {
      "border-top-right-radius": 5,
      "border-bottom-right-radius": 5,
    },
  },
  tableCell: {
    color: "#636363",
    fontSize: 14,
    fontWeight: 400,
    padding: "25px 30px",
    borderBottom: "none",

    "& .campaign-status": {
      width: 10,
      height: 10,
      borderRadius: "50%",
      display: "inline-block",
      marginRight: 6,
    },

    "& .campaign-paused": {
      backgroundColor: "red",
    },

    "& .campaign-active": {
      backgroundColor: "#56b022",
    },

    "& .campaign-suspend": {
      backgroundColor: "red",
    },

    "& .campaign-processing": {
      backgroundColor: "#FFCC00",
    },
    "& .campaign-fail": {
      backgroundColor: "red",
    },
  },
  tableCellFlex: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    "& .left": {
      display: "flex",
      alignItems: "center",

      "& > span": {
        marginLeft: 5,
      },
      "& > .check": {
        color: "#00AF12",
      },
      "& > .cancel": {
        color: "#B9B9B9",
      },
    },

    "& .right": {
      cursor: "pointer",
      position: "relative",
    },
  },
  tableCellTitle: {
    fontSize: 14,
    color: "#3A39BB",
    padding: "25px 30px",
    borderBottom: "none",
    width: 275,
    fontWeight: 600,
  },
  btnView: {
    width: "fit-content",
    background: "#585858",
    padding: "7px 38px",
    color: "#fff",
    cursor: "pointer",
    outline: "none",
    border: "none",
    fontWeight: 600,
    "&:disabled": {
      cursor: "not-allowed",
    },
  },
  walletCopy: {
    display: "flex",
    alignItems: "center",
    "& img": {
      marginLeft: 7,
      cursor: "pointer",
      outline: "none",
    },
  },
}));

export default useStyles;
