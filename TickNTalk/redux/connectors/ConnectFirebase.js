import { connect } from 'react-redux'
import { createActionUpdateFirebase } from '../actions/CreateActionUpdateFirebase'

const mapStateToProps = (state) => {
    return {
        db: state.reducerFirebase
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // client cannot modify firebase data in reduxStore directly
    }
}

export const connectFirebase = connect(mapStateToProps, mapDispatchToProps);