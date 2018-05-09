'use strict'
import React, {Component} from 'react'
import {render} from 'react-dom'
import 'isomorphic-fetch'
class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }
  render () {
    return (
      <div>
        hello
      </div>
    )
  }
}

render(
  <App />
, document.getElementById('main'))
