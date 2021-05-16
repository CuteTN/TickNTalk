import { connect } from 'react-redux'
import { createActionSignIn, createActionSignOut } from '../actions/CreateActionSignedIn'

const mapStateToProps = (state) => {
    return {
        isSignedIn: state.reducerSignedIn.isSignedIn,
        signedInEmail: state.reducerSignedIn.email
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchSignIn: (email) => {
            dispatch(createActionSignIn(email));
        },

        dispatchSignOut: () => {
            dispatch(createActionSignOut());
        },
    }
}

export const connectSignedIn = connect(mapStateToProps, mapDispatchToProps);