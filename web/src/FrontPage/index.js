import React, { Component } from 'react';
import './frontpage.css';
import socketIOClient from "socket.io-client";
class Frontpage extends React.Component {
  constructor(props) {
    super(props);
    this.isAuthenticated = this.props.isAuthenticated.bind(this);
    this.state = {
      endpoint:"http://192.168.0.103:3001",
      answers:[],
      equation:'',
      chosenNumber: 0,
      numberOneList: [],
      numberTwoList: [],
      result: [],
      finalResult: 0,
      showFinalResult: false,
      phase: 'ONE',
      op: ''
    }
    this.setNumberTo = this.setNumberTo.bind(this);
    this.setOperation = this.setOperation.bind(this);
    this.getResult = this.getResult.bind(this);
    this.reset = this.reset.bind(this);
    this.softReset = this.softReset.bind(this);
    this.returnBack = this.returnBack.bind(this);
    this.upLoad = this.upLoad.bind(this);
    // this.downLoad = this.downLoad.bind(this);
    this.update = this.update.bind(this);
  }
  update =(res) =>{
    console.log("sending...");
    const date = new Date().valueOf();
    const socket = socketIOClient(this.state.endpoint);
    const ct = {num:res,name:this.props.profile.nickname,date:date};
    socket.emit('update result',ct);
  }
  componentDidMount(){
    // this.downLoad();
    const socket = socketIOClient(this.state.endpoint);
    socket.on('update result', (res) => {
      console.log("I am updating");
      var arr = this.state.answers.slice();

      arr.unshift({num:res.num,name:res.name,date:res.date});

      this.setState({answers:arr.slice(0,10)});
    })
  }
  isLoggedIn() {
    return this.isAuthenticated() && !!this.props.profile;
  }
  setNumberTo(num) {
    this.setState({chosenNumber: num, showFinalResult: false});
    if(this.state.phase === 'ONE') {
      this.setState({
        numberOneList: [...this.state.numberOneList, num], result: [...this.state.result, num]
      });
    } else if(this.state.phase === 'TWO') {
      this.setState({
        numberTwoList: [...this.state.numberTwoList, num], result: [...this.state.result, num]
      });
    }
  }
  setOperation(op) {
    if (this.state.phase === 'ONE') {
      this.setState({phase: 'TWO', op: op, result: [op]});
    } else if (this.state.phase === 'TWO') {
      this.setState({numberOneList: this.state.finalResult.toString().split(''), op: op, result: [op]});
    }
  }
  reset() {
    this.setState({showFinalResult: false, result: [], phase: 'ONE', numberOneList: [], numberTwoList: [], op: ''});
  }
  softReset() {
    this.setState({result: [], numberOneList: [], numberTwoList: [], op: '',phase:'ONE'});
  }
  returnBack() {
    if(this.state.phase === 'ONE') {
      this.setState({
        numberOneList: this.state.numberOneList.slice(0,-1), result: this.state.result.slice(0,-1)
      });
    } else if(this.state.phase === 'TWO') {
      this.setState({
        numberTwoList: this.state.numberTwoList.slice(0,-1), result: this.state.result.slice(0,-1)
      });
    }
  }
  // downLoad(){
  //   var myHeaders2 = new Headers();
  //   myHeaders2.append('Content-Type', 'application/json');
  //   let myRequest2 = new Request('/api/db/find', {
  //     method: 'POST',
  //     headers: myHeaders2,
  //   });
  //   fetch(myRequest2)
  //   .then(response => {
  //     if (!response.ok) {
  //     }
  //     return response;
  //   })
  //   .then(res =>res.json())
  //   .then(json =>this.setState({answers:json.ans}))
  //   .then(console.log(this.state.answers))
  //   .catch(function (error) {
  //     console.error(error);
  //   });
  // }
  upLoad(answer){
    // console.log(this.props.profile.nickname);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    if(this.isAuthenticated()){
      let myRequest = new Request('/api/db/add', {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
          nickname: this.props.profile.nickname,
          num:answer,
          date:new Date().valueOf()
        })
      });
      fetch(myRequest)
      .then(response => {
        if (!response.ok) {
        }
        return response;
      })
      // .then(this.downLoad())
      .catch(function (error) {
        console.error(error);
      });
    }

  }
  getResult() {
    switch(this.state.op) {
      case '+': {
        const resPlus = parseFloat(this.state.numberOneList.join('')) + parseFloat(this.state.numberTwoList.join(''));
        const eq = this.state.numberOneList.join('')+'+'+this.state.numberTwoList.join('')+'='+resPlus;
        this.setState({showFinalResult: true, finalResult: resPlus,equation:eq});
        this.softReset();
        this.update(resPlus);
        this.upLoad(eq);
        break;
      }
      case '-': {
        const resMinus = parseFloat(this.state.numberOneList.join('')) - parseFloat(this.state.numberTwoList.join(''));
        const eq = this.state.numberOneList.join('')+'-'+this.state.numberTwoList.join('')+'='+resMinus;
        this.setState({showFinalResult: true, finalResult: resMinus,equation:eq});
        this.softReset();
        this.update(eq);
        this.upLoad(eq);
        break;
      }
      case '*': {
        const resTimes = parseFloat(this.state.numberOneList.join('')) * parseFloat(this.state.numberTwoList.join(''));
        const eq = this.state.numberOneList.join('')+'*'+this.state.numberTwoList.join('')+'='+resTimes;
        this.setState({showFinalResult: true, finalResult: resTimes,equation:eq});
        this.softReset();
        this.update(eq);
        this.upLoad(eq);
        break;
      }
      case '/': {
        const resDivBy = parseFloat(this.state.numberOneList.join('')) / parseFloat(this.state.numberTwoList.join(''));
        const eq = this.state.numberOneList.join('')+'/'+this.state.numberTwoList.join('')+'='+resDivBy;
        this.setState({showFinalResult: true, finalResult: resDivBy,equation:eq});
        this.softReset();
        this.update(eq);
        this.upLoad(eq);
        break;
      }
      default: {
        console.log('There is no such operation!');

      }
    }
  }
  render() {
    // console.log(this.state.answers);
    const hello = this.isLoggedIn();
    const listItems = this.state.answers.map((answer)=>
    <li key = {answer.date.toString()}>
    <p>
    @{answer.name}:{answer.num}
    </p>
    </li>
  );
  if(hello){
    return (
      <div>
      <div className = "bg">

      <div className="container">
      <br />
      <div className="columns">
      <div className="column is-12">
      <a className="button is-fullwidth color">
      <span>{(this.state.result.length === 0 && !this.state.showFinalResult) ? '0' : ''}</span>
      <span>{this.state.showFinalResult ? this.state.finalResult : this.state.result.join('')}</span>
      </a>
      </div>
      </div>
      <div className="columns is-mobile">
      <div className="column is-3">
      <a className="button is-info is-fullwidth" onClick={() => this.setNumberTo(7)}>
      7
      </a>
      </div>
      <div className="column is-3">
      <a className="button is-info is-fullwidth" onClick={() => this.setNumberTo(8)}>
      8
      </a>
      </div>
      <div className="column is-3">
      <a className="button is-info is-fullwidth" onClick={() => this.setNumberTo(9)}>
      9
      </a>
      </div>
      <div className="column is-3">
      <a className="button is-info is-fullwidth" onClick={() => this.setOperation('/')}>
      /
      </a>
      </div>
      </div>
      <div className="columns is-mobile">
      <div className="column is-3">
      <a className="button is-info is-fullwidth" onClick={() => this.setNumberTo(4)}>
      4
      </a>
      </div>
      <div className="column is-3">
      <a className="button is-info is-fullwidth" onClick={() => this.setNumberTo(5)}>
      5
      </a>
      </div>
      <div className="column is-3">
      <a className="button is-info is-fullwidth" onClick={() => this.setNumberTo(6)}>
      6
      </a>
      </div>
      <div className="column is-3">
      <a className="button is-info is-fullwidth" onClick={() => this.setOperation('*')}>
      *
      </a>
      </div>
      </div>
      <div className="columns is-mobile">
      <div className="column is-3">
      <a className="button is-info is-fullwidth" onClick={() => this.setNumberTo(1)}>
      1
      </a>
      </div>
      <div className="column is-3">
      <a className="button is-info is-fullwidth" onClick={() => this.setNumberTo(2)}>
      2
      </a>
      </div>
      <div className="column is-3">
      <a className="button is-info is-fullwidth" onClick={() => this.setNumberTo(3)}>
      3
      </a>
      </div>
      <div className="column is-3">
      <a className="button is-info is-fullwidth" onClick={() => this.setOperation('-')}>
      -
      </a>
      </div>
      </div>
      <div className="columns is-mobile">
      <div className="column is-3">
      <a className="button is-info is-fullwidth" onClick={this.reset}>
      RESET
      </a>
      </div>
      <div className="column is-3">
      <a className="button is-info is-fullwidth" onClick={() => this.setNumberTo(0)}>
      0
      </a>
      </div>
      <div className="column is-3">
      <a className="button is-info is-fullwidth" onClick={() => this.setNumberTo('.')}>
      .
      </a>
      </div>
      <div className="column is-3">
      <a className="button is-info is-fullwidth" onClick={() => this.setOperation('+')}>
      +
      </a>
      </div>
      </div>
      <div className="columns is-mobile">
      <div className="column is-6">
      <a className="button is-info is-fullwidth" onClick={this.getResult}>
      =
      </a>
      </div>
      <div className="column is-6">
      <a className="button is-info is-fullwidth" onClick={this.returnBack}>
      RETURN
      </a>
      </div>
      </div>
      </div>
      <div className = 'container2'>
      <br />
      <ul className = "myList"><strong>{listItems}</strong></ul>
      </div>
      </div>
      </div>
    );
  }
  else{
    return(
      <div className="FrontPage">
      <div className="bg">
      </div>
      <div className="bg1">
      </div>
      <div className="welcome">
        <h1>
          <span className="icon"><i className="fa fa-home"></i></span>
          &nbsp;
          Welcome to Simple Calculator!
        </h1>
        <div>
        <span>This is a calculator application.</span>
        <span>Please <strong>sign in</strong> to start.</span>
        </div>
      </div>
      </div>
    )
  }

}
}
export default Frontpage;
