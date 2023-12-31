import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({

  formControl: {
    marginBottom: 20,
    position: 'relative',
  },
  formControlLabel: {
    fontSize: 14,
    letterSpacing: '0.25px',
    color: '#363636'
  },
  formControlInput: {
    display: 'block',
    border: '1px solid #DFDFDF',
    width: '100%',
    padding: '13px',
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: 'white',
    transition: '.1s all ease-in',

    '&:focus': {
      borderColor: '#FFCC00',
      outline: 'none'
    }
  },
  bonusBtn: {
    padding: '13px 20px',
    backgroundColor: '#FFCC00',
    border: 'none',
    borderRadius: 10,
    color: 'white',
    fontWeight: 600,
    cursor: 'pointer',

    '&:focus': {
      outline: 'none'
    }
  },
  tableRow: {
    backgroundColor: '#f3f3f3',
    borderRadius: 5,

    '& > .MuiTableCell-root:first-child': {
      'border-top-left-radius': 5,
      'border-bottom-left-radius': 5
    },

    '& > .MuiTableCell-root:last-child': {
      'border-top-right-radius': 5,
      'border-bottom-right-radius': 5,

    }
  },
  tableCell: {
    color: '#636363',
    fontSize: 14,
    fontWeight: 400,
    padding: '25px 30px',
    borderBottom: 'none',

    '& .admin-status': {
      width: 10,
      height: 10,
      borderRadius: '50%',
      display: 'inline-block',
      marginRight: 6,
    },

    '& .admin-paused': {
      backgroundColor: 'red'
    },

    '& .admin-active': {
      backgroundColor: '#56b022'
    },

    '& .admin-suspend': {
      backgroundColor: 'red'
    },

    '& .admin-processing': {
      backgroundColor: '#FFCC00'
    },
    '& .admin-inactive': {
      backgroundColor: 'red'
    },
  },
  tableCellFlex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    '& .left': {
      display: 'flex',
      alignItems: 'center',

      '& > span': {
        marginLeft: 5
      },
      '& > .check': {
        color: '#00AF12'
      },
      '& > .cancel': {
        color: '#B9B9B9'
      }
    },

    '& .right': {
      cursor: 'pointer',
      position: 'relative'
    }
  },
  tableCellTitle: {
    fontSize: 14,
    color: '#3A39BB',
    padding: '25px 30px',
    borderBottom: 'none',
    width: 275,
    fontWeight: 600
  },
  wordBreak: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: 150,
    maxWidth: 150
  },
  editDialog: {
    position: 'absolute !important' as any,
    right: "30px !important" as any,
    inset: "unset !important" as any,
    bottom: "-20px !important" as any,
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.15)',
    borderRadius: 10,
    backgroundColor: 'white',

    '& .MuiDialogContent-root': {
      padding: '15px 25px',
      width: 130,
      textAlign: 'center',
      color: '#636363',
    },

    '& .MuiDialog-paper': {
      borderRadius: 10,
      margin: 0,
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.15)'
    },
  },
  editDialogContent: {
    '& hr': {
      marginTop: 15
    }
  },
  editDialogView: {
    fontSize: 14,
    display: 'inline-block',
    color: '#636363',
    transition: '.2s all ease-in',
    fontFamily: 'Roboto, sans-serif',

    '&:hover': {
      color: 'black'
    }
  },
  editDialogButton: {
    background: 'none',
    border: 'none',
    fontSize: 14,
    marginTop: 15,
    cursor: 'pointer',
    color: '#636363',
    transition: '.2s all ease-in',
    display: 'inline-block',

    '&:hover': {
      color: 'black'
    }
  }
}))

export default useStyles;
