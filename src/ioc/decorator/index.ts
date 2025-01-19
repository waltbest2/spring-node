import { IocContainer, IocScope, InstanceToken } from '../container';

export const container = new IocContainer();

/**
 * 多列对象定义，依赖注入不会创建单例，只有在注入的父类new时动态创建
 * @param interfaceToken 该类对应的interface symbol标识，引用和提供唯一匹配，建议用symbol类型
 * @param immediate 是否立即创建实例
 */
export function component(interfaceToken?: InstanceToken, immediate: boolean = false): ClassDecorator {
  // 这里target是class本身，function类型
  return function(target) {
    let token = interfaceToken;
    if (!token) {
      token = target;
    }
    container.set(token, target);

    if (immediate) {
      const instance = container.getInstance(token);
      if (!instance) {
        container.setInstance(token, new (target as any)());
      }
    }

    return target;
  }
}

/**
 * 依赖注入的对象，支持单例和多例
 * @param interfaceName 该类对应的interface symbol标识，引用和提供唯一匹配，建议用Symbol类型
 * @param type 
 * @returns 
 */
export function autowired(interfaceName: InstanceToken, type = IocScope.SINGLETON): PropertyDecorator {
  // 这里target是class的prototype
  return function (target: any, propertyName: string) {
    // 记录当前父类的依赖，针对多例
    if (type === IocScope.CONTEXT) {
      if (!target.$contextDeps) {
        // 不能遍历出key、修改、删除
        Object.defineProperty(target, '$contextDeps', {
          value: [],
        });
      }

      target.$contextDeps.push({
        interfaceName,
        propertyName,
      });
    }

    const $class: any = container.get(interfaceName);
    if (!$class) {
      // 如果解析时还没有加入到container中，则添加任务，等待container中有后再触发回调fn
      container.addDep(interfaceName, ($class: any) => {
        setProp(target, propertyName, $class, type, interfaceName);
      })
    } else {
      setProp(target, propertyName, $class, type, interfaceName);
    }
  }
}

/**
 * 懒注入，只有在使用的时候动态获取单例
 * @param interfaceName 
 * @returns 
 */
export function lazywired(interfaceName: InstanceToken): PropertyDecorator {
  return function(target: any, propertyName: string) {
    Object.defineProperty(target, propertyName, {
      get() {
        return container.getInstance(interfaceName);
      }

    })
  }
}

/**
 * hooks构造方法执行，将对象中所有多例的对象进行依赖注入new
 * @param target 
 */
export function useContext(target: any) {
  container.addNewQueue(target);
}

function setProp(target: any, propName: string, $class: any, type: IocScope, interfaceName: InstanceToken) {
  if (type === IocScope.SINGLETON) {
    const instance = container.getInstance(interfaceName);
    if (instance) {
      target[propName] = instance;
    } else {
      target[propName] = new $class();
      container.setInstance(interfaceName, target[propName]);

      // 检查多例属性
      container.addNewQueue(target[propName]);
    }
  }
}