import { InstanceToken } from './ioc/container';
import { container } from './ioc/decorator';

/**
 * 直接获取缓存注入的实例
 * @param instanceToken 实例token
 * @returns 
 */
export function inject(instanceToken: InstanceToken): any {
  return container.getInstance(instanceToken);
}

/**
 * 注入实例
 * @param instanceToken 实例token
 * @param instance 实例
 * @returns true表示成功，false表示已经存在
 */
export function provide(instanceToken: InstanceToken, instance: any): boolean {
  if (!instanceToken) {
    throw new Error('instanceToken is empty');
  }

  const existInstance = container.getInstance(instanceToken);
  if (existInstance) {
    console.warn(`[spring-node-ts]: the instance of this token already exist!`);
    return false;
  }

  container.setInstance(instanceToken, instance);
  return true;

}