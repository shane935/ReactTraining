import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    if(props.logging){
      console.log('I am the constructor');
    }
    super(props);
    this.state = {
      counter: 1
    };
  }

  componentDidMount(){
    setTimeout(this.tick, 5000);
  }

  shouldComponentUpdate(nextProps, {counter}){
    const updateComponent = counter % 3 !== 0;
    return updateComponent;
  }

  tick = () => {
    this.setState(prevState => {
      return {
        counter: prevState.counter + 1
      }
    });
    setTimeout(this.tick, 5000);
  }

  render() {
    const {counter} = this.state;

    return (
      <div>
        <div>{counter}</div>
        <StatelessComponent counter={counter}/>
        {counter % 5 !== 0 && <CreatedClass counter={counter} logging={this.props.logging}/>}
        {React.createElement(NoJSX, {counter})}
      </div>

    );
  }
}

const CreatedClass = React.createClass({
  componentWillMount(){
    if(this.props.logging){
      console.log('CreatedClass mounted');
    }
  },

  shouldComponentUpdate({counter}){
    const updateComponent = counter % 3 !== 0;
    if(this.props.logging){
      console.log(`I ${updateComponent ? "should" : "shouldn't"} update`);
    }
    return updateComponent;
  },

  componentWillReceiveProps(nextProps){
      if(nextProps.logging){
        console.log("CreatedClass received props");
      }
    
  },

  componentWillUpdate(nextProps, nextState){
      if(nextProps.logging){
        console.log("CreatedClass will update");
      }
    
  },

   componentDidUpdate(prevProps, prevState){
       if(this.props.logging){
        console.log("CreatedClass did update");
      }
    
  },

  componentWillUnmount(){
    if(this.props.logging){
      console.log('CreatedClass unmounted');
    }
  },

  render(){
    const {counter} = this.props;
    if(this.props.logging){
      console.log('CreatedClass rendered');
    }
    return (
      <div>I am a stateless component the counter squared is: {counter * counter}</div>
    )    
  }
})


const StatelessComponent = ({counter}) => (
  <div>I am a stateless component the counter doubled is: {counter * 2}</div>
)

const NoJSX = ({counter}) => {
  return React.createElement("div", {
    children: `I am a JSX free component my counter is ${counter}`
  })
}

export default App;
