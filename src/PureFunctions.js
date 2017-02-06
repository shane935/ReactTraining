import {connect} from "redux";

const BasicPureFunction = (props) => (
  <span>{props.name}</span>
);

const PureFunctionBCStyle = ({name}) => (
  <span>{name}</span>
);

const PureFunctionConnected = ({clicked, data}) => (
  <button onClick={clicked}>{data}</button>
);

const mapStateToProps = (state) => {
  return {
    data: state.getIn(['DataState', 'Data'])
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    clicked: (e) => {
      e.preventDefault();
      dispatch({type: "clicked"});
    }
  }
};

const Connected = connect(mapStateToProps, mapDispatchToProps)(PureFunctionConnected);





