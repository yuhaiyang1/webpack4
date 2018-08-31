'use strict'
import React, {Component} from 'react'
import {render} from 'react-dom'
import 'isomorphic-fetch'

export default class Child extends Component {
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
    console.log('child WILL MOUNT!')
  }
  componentDidMount () {
    console.log('child DID MOUNT!')
  }
  shouldComponentUpdate (newProps, newState) {
    return true
  }
  componentWillUpdate (nextProps, nextState) {
    console.log('child WILL UPDATE!')
  }
  compnentDidUpdate (prevProps, prevState) {
    console.log('child DID UPDATE!')
  }
  componentWillUnmount () {
    console.log('child WILL UNMOUNT!')
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
