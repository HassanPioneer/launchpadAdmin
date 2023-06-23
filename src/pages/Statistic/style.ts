import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    formControlLabel: {
        marginBottom: 10,
        display: 'inline-block',
        position: 'initial',
        fontSize: '13px',
        color: 'rgba(0, 0, 0, .54)'
    },
    formInputBox: {
        border: '1px solid #DFDFDF',
        padding: '10px',
        maxWidth: 300,
        width: 250,
        fontSize: 14,
        borderRadius: 5,
        'border-top-right-radius': 0,
        'border-bottom-right-radius': 0,

        '&:focus': {
            outline: 'none'
        },
        marginRight: '10px'
    },
    formErrorMessage: {
        marginTop: 7,
        color: 'red',
    },
    mainStatistic: {
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: 10,
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px',
    },
    formButtonUpdateStatistic: {
        backgroundColor: '#FFCC00',
        boxShadow: '0px 0px 30px rgba(243, 203, 25, 0.15)',
        borderRadius: 10,
        padding: '14px 0px',
        border: 'none',
        display: 'inline-block',
        width: '45%',
        color: 'white',
        fontWeight: 600,
        fontSize: 14,
        marginTop: 25,
        marginBottom: 60,
        marginLeft: 10,
        marginRight: 10,
        cursor: 'pointer',
        transition: '.2s all ease-in',

        '&:hover': {
            boxShadow: '0px 15px 20px rgba(0, 0, 0, .1)',
            transform: 'translateY(-7px)'
        },
        '&:focus': {
            outline: 'none'
        }
    }
}))

export default useStyles;
