const Rx = require('rxjs')
console.log(Rx, 'rx')
var observable = Rx.Observable
.create((observer) => {
  observer.next('Jerry') // RxJS 4.x 以前的版本用 onNext
  setTimeout(() => {
    observer.next('Anna')
  }, 2000)
})
console.log('start')
// 訂閱這個observable
observable.subscribe((value) => {
  console.log(value)
})
console.log('end')
