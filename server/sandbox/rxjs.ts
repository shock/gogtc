import readline from 'readline';
import { Observable, fromEvent, interval, of } from 'rxjs';
import { switchMap, switchAll, map } from 'rxjs/operators';

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else {
    return
    console.log(`You pressed the "${str}" key`);
    console.log();
    console.log(key);
    console.log();
  }
});

console.clear()
console.log('RxJS sandbox started.  Press CTRL-C to quit');

const simpleSubscribers = () => {
  console.log('Running simpleSubscribers...')
  const observable = new Observable(function subscribe(subscriber) {
    // Keep track of the interval resource
    const intervalId = setInterval(() => {
      subscriber.next('hi');
    }, 1000);

    // Provide a way of canceling and disposing the interval resource
    return function unsubscribe() {
      clearInterval(intervalId);
    };
  });

  const sub1 = observable.subscribe( x => {
    console.log(x)
  })

  const sub2 = observable.subscribe( x => {
    console.log('second: '+x)
  })

  setTimeout( () => sub2.unsubscribe(), 5000)
  setTimeout( () => sub1.unsubscribe(), 6000)
}

const rerunIntervalSwitchMap = () => {
  console.log('Running rerunIntervalSwitchMap')

  const clicks = fromEvent(process.stdin, 'keypress');
  const result = clicks.pipe(switchMap((ev) => interval(1000)));
  result.subscribe(x => console.log(x));

}

const regenObservableSwitchMap = () => {
  console.log('Running regenObservableSwitchMap')

  const clicks = fromEvent(process.stdin, 'keypress');
  // const obs = clicks.pipe(switchMap((ev) => interval(2000)));
  const obs = interval(2000)
  const switched = obs.pipe(
    switchMap((x: number) => of(x*100, x*200, x*300)),
  // ).pipe(
    switchMap((x: number) => of(x+1, x+2, x+3))
  );
  obs.subscribe(x => console.log('obs: ',x));
  switched.subscribe(x => console.log('switched: ', x));

}

// simpleSubscribers()
// rerunIntervalSwitchMap()
regenObservableSwitchMap()
