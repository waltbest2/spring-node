import { isRealObject } from '../utils';

export enum IocScope {
  SINGLETON = 'singleton', // 单例模式
  CONTEXT = 'context', // 多例模式
  REQUEST = 'request', // 请求上下文单例，暂未使用
}

export interface ToNew {
  object: any;
  propName: string;
  interfaceName: InstanceToken;
}

/**
 * 兼容class也可以作为唯一token，对标angular
 */
export type InstanceToken = Symbol | Function;

/**
 * 依赖注入的全局容器
 * 解析注解顺序：先解析类内部属性和方法的注解，最后再解析类自己的注解
 */
export class IocContainer {
  // 依赖注入赋值回调
  private depMaps = new Map<InstanceToken, Function[]>();

  // 准备去new的任务回调队列
  private toNewQueue: ToNew[] = [];

  // 保存所有的类定义
  private classMap = new Map<InstanceToken, any>();

  // 保存单例的对象
  private singletonMap = new Map<InstanceToken, any>();

  public get(key: InstanceToken): any {
    return this.classMap.get(key);
  }

  public set(key: InstanceToken, $class: any): void {
    this.classMap.set(key, $class);
    this.trigger(key, $class);
  }

  public setInstance(key: InstanceToken, instance: any): void {
    this.singletonMap.set(key, instance);
  }

  public getInstance(key: InstanceToken): any {
    return this.singletonMap.get(key);
  }

  /**
   * 添加引用，等到定义时再回调处理
   * @param key 
   * @param fn 
   */
  public addDep(key: InstanceToken, fn: Function): void {
    let deps = this.depMaps.get(key);
    if (!deps) {
      deps = [fn];
      this.depMaps.set(key, deps);
    } else {
      deps.push(fn);
    }
  }

  /**
   * 针对单例引多例，将多例都new一个，只有context类型才会在deps中
   * @param obj 
   * @returns 
   */
  public addNewQueue(obj:any): void {
    const proto = obj.__proto__;
    const deps = proto.$contextDeps;
    if (!deps) {
      return;
    }

    for (const dep of deps) {
      const { interfaceName, propertyName } = dep;
      const $class: any = this.get(interfaceName);
      if (!$class) {
        const toNew: ToNew = {
          object: obj,
          propName: propertyName,
          interfaceName,
        };
        this.toNewQueue.push(toNew);
      } else {
        if (!isRealObject(obj[propertyName])) {
          obj[propertyName] = new $class();
          this.addNewQueue(obj[propertyName]);
        }
      }
    }
  }

  /**
   * 当加载一个实现类时，触发的回调
   * @param key 
   * @param $class 
   */
  private trigger(key: InstanceToken, $class: any): void {
    // 针对之前没有拿到具体类
    const deps = this.depMaps.get(key);
    while (deps?.length) {
      const fn = deps.shift();
      fn($class);
    }

    // 针对单例引多例，将多例都new一个
    const tempQueue = [];
    while (this.toNewQueue.length > 0) {
      const toNew: ToNew = this.toNewQueue.shift();
      const { object, interfaceName, propName } = toNew;
      if (interfaceName === key) {
        if (!isRealObject(object[propName])) {
          object[propName] = new $class();
          this.addNewQueue(object[propName]);
        }
      } else {
        tempQueue.push(toNew);
      }
    }
    this.toNewQueue = tempQueue;
  }
}