import React from "react";
import {connect} from "react-redux";
import {canUseDOM} from "canUseDOM"
import {getIdentity, togglePage} from "../Actions/Identity";
import {logoutUser, getUser} from "../Actions/Account";
import {Map, List} from "immutable";
import {startCase} from "lodash";

const PagesWrapper = React.createClass({
  componentWillMount(){
    this.props.getUser();
    this.props.getIdentity();
  },
  componentWillUpdate(nextProps){
    if (this.props.location.pathname !== nextProps.location.pathname) {
      nextProps.getIdentity();
    }
  },
  render() {
    return React.cloneElement(this.props.children, this.props)
  }
});

const mapStateToProps = (state) => {
  return {
    user: state.getIn(['AccountState', 'user']),
    identity: state.getIn(['IdentityState', 'Identity'])
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const pageType = ownProps.params.identity ? "supporter" : ownProps.params.team ? "team" : "campaign";
  return {
    getIdentity: () => {
      if (canUseDOM) {
        dispatch(getIdentity(pageType))
      }
    },
    getUser: (e) => {
      if (canUseDOM) {
        dispatch(getUser());
      }
    }
  }
};

const WrappedPages = connect(mapStateToProps, mapDispatchToProps)(PagesWrapper);

export default (url) => {
  return (
    <Route>
      <Route component={Container}>
        <Route component={WrappedPages}>
          <Route path=":organisation/:campaign(/:team)(/:identity)/action/editPage" component={AccountPage}/>
          <Route path=":organisation/:campaign(/:team)(/:identity)/action/login" component={AccountLogin}/>
          <Route path=":organisation/:campaign(/:team)(/:identity)/action/details" component={AccountAccount}/>
          <Route path=":organisation/:campaign(/:team)(/:identity)/action/donate" component={Donate}/>
          <Route path=":organisation/:campaign(/:team)(/:identity)/action/success" component={Success}/>
          <Route path=":organisation/:campaign(/:team)(/:identity)/action/join" component={Join}/>
          <Route path=":organisation/:campaign(/:team)(/:identity)/action/createAccount" component={CreateAccount}/>
          <Route path=":organisation/:campaign(/:team)(/:identity)" component={Identity}/>
        </Route>
      </Route>
    </Route>
  );
}
