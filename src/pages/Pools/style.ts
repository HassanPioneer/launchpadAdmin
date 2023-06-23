import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
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
    fontFamily: 'Roboto-Medium',
    marginTop: 13,
  },
  refreshCampaignsIcon: {
    transition: '.2s all ease-in',
  },
  bntDownload: {
    marginLeft: 12,
    backgroundColor: '#FFCC00',
    border: 'none',
    borderRadius: 10,
    display: 'inline-block',
    fontFamily: 'Roboto-Medium',
    cursor: 'pointer',
    transition: '.2s all ease-in',
    alignItems: 'center',
    fontSize: 14,
    color: 'white',
    fontWeight: 500,
    transform: 'translateY(-7px)',
    '&:focus': {
      outline: 'none',
    },
    '&:hover': {
      boxShadow: '0px 15px 20px rgba(0, 0, 0, .1)',
      transform: 'translateY(-14px)'
    }
  },
  btnContent: {
    display: 'flex',
    padding: '12px 15px 0 15px',
    alignItems: 'center',
    fontSize: 14,
    color: 'white',
    fontWeight: 500
  },
}))

export default useStyles;
