# acumulus

[![Build Status](https://secure.travis-ci.org/zenmoto/acumulus.png?branch=master)](http://travis-ci.org/user/acumulus)


## Installation

Install with npm:

```
npm install --save acumulus
```


## API

### acumulus()


```javascript
    var accum = acumulus().max_samples(5 * 60).sample_interval(1000);
```

From here on out, you can simply start accumulating (using 5 samples to make it easy to see what's going on):

```javascript
   // Add one
   accum.add("foo");

   // Wait four seconds
   accum.add("foo", 5);
   accum.add("bar");
```

Now we can use it:

```javascript
   accum.get("foo"); //=> 5
   accum.series("foo"); //=> [1, 0, 0, 0, 5]
   accum.sum("foo"); //=> 6
   accum.sum_all(); //=> [{series: "foo", value: 6}, {series: "bar", value: 1}]
   accum.top(1); //=> [{series: "foo", value: 6}]
```

Wait another couple seconds:

```javascript
    accum.series("foo"); //=> [0, 0, 5, 0, 0]
```

## Testing

From the repo root:

```
npm install
npm test
```
