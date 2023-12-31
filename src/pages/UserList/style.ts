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
  header: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  headerRight: {
    display: 'flex',
  },
  tableContainer: {
    padding: '30px 20px',
    borderRadius: 10,
    boxShadow: 'none',
    marginTop: 25
  },
  table: {
    fontFamily: 'Roboto',
    fontWeight: 500,
    fontSize: 14,
    backgroundColor: 'white',
  },
  tableHeader: {
    padding: '0px 0px 25px 30px',
    color: '#363636',
    fontWeight: 600
  },
  tableBody: {
    '& > .MuiTableRow-root:last-child': {
      borderBottom: '1px solid #E5E5E5'
    },
    '& > .MuiTableRow-root:nth-child(odd)': {
      backgroundColor: 'white'
    },
  },
  pagination: {
    marginTop: 30,
    fontSize: 12,
    fontWeight: 400,
    '& .MuiPagination-ul': {
      justifyContent: 'center',
    },
    '& .MuiPaginationItem-page.Mui-selected': {
      backgroundColor: '#FFCC00'
    }
  },
  skeleton: {
    padding: '25px 0px',
    marginTop: 10
  },
  exportBtn: {
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
  noDataMessage: {
    fontWeight: 500,
    marginTop: 30,
    textAlign: 'center',
    fontSize: 15
  },
  errorMessage: {
    fontWeight: 500,
    marginTop: 30,
    textAlign: 'center',
    fontSize: 15,
    color: 'red'
  },
  refreshCampaigns: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  refreshCampaignsContainer: {
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center',

    '&:hover .refreshCampaignsIcon': {
      transform: 'rotateZ(180deg)',
      fill: '#FFCC00'
    }
  },
  refreshCampaignsText: {
    marginLeft: 10,
    fontWeight: 500,
    fontSize: 15,
    transition: '.2s all ease-in',
    fontFamily: 'Roboto-Medium'
  },
  refreshCampaignsIcon: {
    transition: '.2s all ease-in',
  }
}))

export default useStyles;
