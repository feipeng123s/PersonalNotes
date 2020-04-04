## Number类型的表示范围

- 表示数字的绝对值范围`Number.MIN_VALUE=5e-324`~`Number.MAX_VALUE=1.7976931348623157e+308`
- 表示数字的最大安全整数范围`Number.MIN_SAFE_INTEGER=-9007199254740991`~`Number.MAX_SAFE_INTEGER=9007199254740991`

> 超过最大安全整数的运算是不安全的。



JS中Number类型使用的是双精度浮点型，也就是其他语言中的double类型，是使用64bit来存储的。也就是说一个Number类型的数字在内存中会被表示成：`s x m x 2^e`这样的格式。

> s表示正负号，占用1bit
>
> m表示尾数，占52bit。范围就是1~52个1
>
> e表示指数（10的次方数），占11bit，es规定e的范围在-1074 ~ 971（包含）

**二进制的第一位有效数字必定是1，因此这个1不会被存储，可以节省一个存储位，因此尾数部分可以存储的范围是1 ~ 2^(52+1)**

所以表示值得绝对值范围就是`2^(-1074)` ~ `2^53*2^971`即前面的`5e-324` ~ `1.7976931348623157e+308`。



## 精度丢失

[0.1 + 0.2 不等于 0.3](https://juejin.im/post/5a6fce10f265da3e261c3c71)

[(2.55).toFixed(1)等于2.5](https://juejin.im/post/5a11a9fef265da43284073b4)



由于浮点数转换成二进制时存在精度丢失，所以0.1 +  0.2 不等于0.3，2.55转化为二进制时，实际值小于2.55，四舍五入后为2.5。

修正toFixed方案：

```javascript
if (!Number.prototype._toFixed) {
    Number.prototype._toFixed = Number.prototype.toFixed;
}
Number.prototype.toFixed = function(n) {
    return (this + 1e-14)._toFixed(n);
};
```

