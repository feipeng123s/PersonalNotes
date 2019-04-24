## every

> `every`方法测试数组的所有元素是否都通过了指定函数的测试。

### 语法

> `arr.every(callback(currentValue[, index[, array]])[, thisArg])`
>
> `thisArg`是执行`callback`时使用的this值

```javascript
var arr = [1,2,3,4,5,6,7,8,9,0];
var result1 = arr.every(function(currentValue,index,array){
    return currentValue%2 === 0;
});
console.log(result1); // false
```

**空数组调用该方法时始终返回true**

## some

> `some`方法测试是否至少有一个元素通过提供的函数实现的测试。

### 语法

> `arr.some(callback(currentValue[, index[, array]])[, thisArg])`

```javascript
var result2 = arr.some(function(currentValue,index,array){
    return currentValue >= 8;
});
console.log(result2); // true
```

**空数组调用该方法时始终返回false**

## forEach

> `forEach`方法为每个数组元素执行一次提供的函数。

### 语法

> `arr.forEach(callback(currentValue[, index[, array]])[, thisArg])`
>
> 返回值：undefined

```javascript
arr.forEach(function(currentValue,index,array){
    array[index] = currentValue + 1;
});
console.log(arr); // [2, 3, 4, 5, 6, 7, 8, 9, 10, 1]
```



## map

> `map`方法创建一个新数组，其结果是在调用数组中的每个元素上调用提供的函数。

### 语法

> `arr.map(callback(currentValue[, index[, array]])[, thisArg])`
>
> 返回值：一个新数组，每个元素都是回调函数的结果。

```javascript
var result = arr.map(function(currentValue,index,array){
    return  ++currentValue;
});
console.log(result); // [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 1 ]
```



## filter

> `filter`方法创建一个新数组，其中包含通过所提供函数实现的测试的所有元素。

### 语法

> `arr.filter(callback(currentValue[, index[, array]])[, thisArg])`
>
> 返回值：一个新的、由通过测试的元素组成的数组，如果没有任何数组元素通过测试，则返回空数组。

```javascript
var result = arr.filter(function(currentValue,index,array){
    return currentValue > 5;
})
console.log(result); // [ 6, 7, 8, 9 ]
```



## reduce

> `reduce`方法对累加器和数组中的每个元素（从左到右）应用函数以将其减少为单个值。

### 语法

>`arr.reduce(callback(accumulator,currentValue[, index[, array]])[, initialValue])`
>
>accumulator：累计器，累计回调的返回值。
>
>initialValue：作为第一次调用`callback`函数时的第一个参数的值。若没有提供初始值，则将使用数组中的第一个元素，且起始索引为1，否则起始索引为0。
>
>**在没有初始值的空数组上调用reduce将报错**

```javascript
var result = arr.reduce(function(accumulator,currentValue,index,array){
    return accumulator + currentValue;
});
console.log(result); // 45
```

### 用reduce实现分组汇总

```javascript
// 返回数组
const groupBy = (arr, func) =>
  arr.map(typeof func === 'function' ? func : val => val[func])
    .reduce((acc, val, i) => {
      acc[val] = (acc[val] || []).concat(arr[i]);
      return acc;
    }, {});
console.log(groupBy([6.1, 4.2, 6.3], Math.floor));

// 返回总记录数
const countBy1 = (arr, fn) =>
  arr.map(typeof fn === 'function' ? fn : val => val[fn])
    .reduce((acc, val, i) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

console.log(countBy1(['one', 'two', 'three'], 'length'));

// 返回总和
const countBy2 = (arr, fn) =>
  arr.map(typeof fn === 'function' ? fn : val => val[fn])
    .reduce((acc, val, i) => {
      acc[val] = (acc[val] || 0) + arr[i].num
      return acc;
    }, {});

let arr = [
  { id: 1, num: 1 },
  { id: 1, num: 2 },
  { id: 2, num: 1 },
  { id: 2, num: 2 },
  { id: 2, num: 3 },
  { id: 3, num: 1 },
  { id: 3, num: 2 }
];
console.log(countBy2(arr, 'id'))
```

