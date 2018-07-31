'use strict'
import React, {Component} from 'react'
import {render} from 'react-dom'
import 'isomorphic-fetch'
class App extends Component {
  static defaultProps = {
    number: 1
  }
  // static propTypes = {
  //   number: React.PropTypes.number.isRequired,
  // }
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }
  componentWillMount () {
    console.log('Component WILL MOUNT!')
  }
  componentDidMount () {
    console.log('Component DID MOUNT!')
  }
  shouldComponentUpdate (newProps, newState) {
    return true
  }
  componentWillUpdate (nextProps, nextState) {
    console.log('Component WILL UPDATE!')
  }
  compnentDidUpdate (prevProps, prevState) {
    console.log('Component DID UPDATE!')
  }
  componentWillUnmount () {
    console.log('Component WILL UNMOUNT!')
  }
  componentDidCatch () {
    console.log('报错了')
  }
  render () {
    // console.log(this)
    return (
      <div>
        {this.props.number}
      </div>
    )
  }
}

render(
  <App />
, document.getElementById('main'))
