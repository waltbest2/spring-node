# spring-node-ts

## 基于ts语言的IOC框架

## 基本用法
```ts
import { autowired, component } from 'spring-node-ts/lib/ioc/decorator';
import { ValidatorService, symbol as validatorSymbol } from '../validator/validator.service';
export const symbol = Symbol('HttpClientService');
@component(symbol)
export class HttpClientService {
  @autowired(validatorSymbol)
  private validatorService: ValidatorService;
```

### 1.支持场景：
单例包含单例:单例在解析时就创建好
多例包含多例:需要在业务代码中创建
多例包含单例:在解析时就创建好
单例包含多例:从单例往下，所有多例都会创建一个，并且共用一个
例如单例包含多例：
```ts
@component(symbol)
export class Wheel implements IWheel {
  @autowired(IMSymbol, IocScope.CONTEXT)
  material: IMaterial;
}
```

### 2.准备条件
tsconfig.json 配置
```json
"experimentalDecorators": true,
"emitDecoratorMetadata": true,
"useDefineForClassFields": false
```

### 3.定义对外交互的接口，建议声明 interface 以及一个 symbol（可选，但是要有 symbol)
例如：
```ts
export interface ICar {
  drive(): string;
  clean(): void;
  repair(): void;
}
export const symbol = Symbol('ICar');
```
### 4.实现interface的类
```ts
import { component } from 'spring-node-ts/lib/ioc/decorator';
import { ICar, symbol as symICar } from './ICar';
@component(symICar)
export class Audi implements ICar {
}
```
通过symlCar标识类，后续好找到对应依赖注入的单例对象。
如果没有定义interface,symbol 可以在这里定义一个。

### 5.依赖注入
#### 5.1单例依赖注入
单例即全局共享一个对象
```ts
import { autowired } from 'spring-node-ts/lib/ioc/decorator';
import { ICar, symbol as symICar } from './ICar';
export class Company {
  @autowired(symICar)/／不带第二个参数，默认表示单例
  private car: ICar;

  public run() {
    return this.car.drive();
  }
}
```
通过 symlCar 从IOC 池子中找到对应的单例对象

#### 5.2多例依赖注入
多列模式即当new一个对象时，自动注入归属这个对象的单独的属性类，而不是共用一个单例。

autowired 注解增加第二个参数 locScope.CONTEXT 表明是多例依赖注入（单例，默认是locScope SINGLETON)

注意，这里需要在构造函数中执行 useContext(this)；因为类一旦定义，没法劫持修改，所以只能 开发者显式的调用。建议在构造函数中第一行或super(）之后调用。

```ts
import { autowired, useContext } from 'spring-node-ts/lib/ioc/decorator';
import { IocScope } from 'spring-node-ts/lib/ioc/container';
import { ICar, symbol as symICar } from './ICar';

export class Company {
  @autowired(symICar, IocScope.CONTEXT)
  private car: ICar;

  constructor(){
    useContext(this);
    /* 其他业务逻辑*/
  }

  public run() {
    return this.car.drive();
  }
}
```

#### 5.3 懒注入lazywired：只在使用的时候注入
例如想依赖注入angular原生service

1. 新建angular的service
```ts
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { container } from 'spring-node-ts/lib/ioc/decorator';
import { TranslateService } from '@ngx-translate/core';
export const symbolTranslateService = Symbol('TranslateService');
export const symbolActivatedRoute = Symbol('ActivatedRoute');
@Injectable({
  providedIn: 'root',
})
export class IocAdapterService {
  constructor(private translate: TranslateService, private activatedRouter: ActivatedRoute) {
  container.setInstance(symbolTranslateService, translate);
  container.setInstance(symbolActivatedRoute, activatedRouter);
}
```
将所有需要注入的 angular 单例 service都在这里声明symbol，并且注入到container中。

2. AppModule 中注入：
```ts
providers: [
  {
    provide: APP_INITIALIZER,
    useFactory: appInitializerFactory,
    deps: [TranslateService, Injector, IocAdapterService],
    multi: true,
  },
],
bootstrap: [AppComponent],
```

3. 懒注入
```ts
import { symbolTranslateService } from '../shared/services/ioc-adapter-service';
import { lazywired, component } from 'spring-node-ts/lib/ioc/decorator';
@component(symbolI18nService)
export class I18nService {
  @lazywired(symbolTranslateService)
  private declare translate: TranslateService;

  constructor() {}
```


### 6.注入时机
autowired(symbol)：在系统初始化的时候注入单例

autowired(symbol, locScope.CONTEXT)：在父 class 实例创建时注入

lazywired(symbol)：在引用属性是注入，也就是执行this.xxx时。

### 重要 注意点：
1. 自动注入的类必须要能够被加载才行，例如在公共入口处 import，否则类没法被注入到容器中。如果没有定义 interface，直接定义
肯定被引入，因此没有必要在另外地方再import
例如：
```ts
import'../../test/ioc/Wheel';
import'../../test/ioc/Audi';
import '../../test/ioc/context/Wheel';
import'../../test/ioc/context/Audi';
```
2. 依赖注入的类一般都是被自动new的，因此不允许自定义构造函数中带指定参数，否则没法知道依赖的参数是什么样。建议通过 set 设置

3. 由于ES2022后，默认启用useDefineForClassFields，会导致注解设置属性失效，因此建议定义依赖注入属性时，添加declare声明，例如：private declare translate: TranslateService;
   如果不想添加，则需要在tsconfig.json中设置useDefineForClassFields: false
