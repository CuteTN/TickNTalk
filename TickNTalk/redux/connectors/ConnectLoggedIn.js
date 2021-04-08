import { connect } from 'react-redux'
import { createActionLogIn, createActionLogOut } from '../actions/CreateActionLoggedIn'

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.reducerLoggedIn.isLoggedIn,
        loggedInEmail : state.reducerLoggedIn.email
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (email) => {
            dispatch(createActionLogIn(email));
        },

        logOut: () => {
            dispatch(createActionLogOut());
        },
    }
}

export const connectLoggedIn = connect(mapStateToProps, mapDispatchToProps);