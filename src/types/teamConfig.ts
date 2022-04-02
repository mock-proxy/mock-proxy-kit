/**
 * 操作权限
 */
export type OperationPermissions = {
  /**
   * 场景可否新增
   * @default true
   */
  sceneAdd?: boolean;
  /**
   * 场景可否更改（mock数据）
   * @default true
   */
  sceneUpdate?: boolean;
  /**
   * 场景可否删除
   * @default true
   */
  sceneDelete?: boolean;
  /**
  * 场景名称可否编辑，需要sceneUpdate为true才会生效
  * @default false
  */
  sceneNameEdit?: boolean;
  /**
   * 默认场景可否编辑（更改或删除）
   * @default true
   */
  defaultSceneEdit?: boolean;
  /**
   * 是否可移动api分组
   * @default true
   */
  apiMove?: boolean;
  /**
   * 是否可创建分组
   * @default true
   */
  groupAdd?: boolean;
  /**
   * 是否可删除分组
   * @default true
   */
  groupDelete?: boolean;
}

/**
 * 项目配置
 */
export interface ProjectConfig {
  /**
   * 项目名称
   */
  name: string;
  /**
   * 项目id
   */
  id: string | number;
  /**
   * 是否跨源。如果该项目请求与domain非同源，则跨源
   * 若跨源，会给redirect url加上标识，这样CORS处理时，匹配到该标识，AC头可返回null，解决跨源问题
   * @default false
   */
  crossOrigin?: boolean;
  /**
   * 其他开发者所需字段
   */
  [key: string]: any;
}

/**
 * 站点配置
 */
export interface SiteConfig {
  /**
   * 站点名称，比如github
   */
  name: string;
  /**
   * 负责人
   */
  owners?: string[];
  /**
   * 描述
   */
  desc?: string;
  /**
   * 站点的域名，暂不支持ip和端口
   */
  domains: string[];
  /**
   * 站点对应的项目配置。可能一个站点对应了多个项目（即oneapi、yapi的project）
   */
  projects: ProjectConfig[];
}

/**
 * 团队配置
 */
export interface TeamConfig {
  // TODO: 未来支持url配置
  sites: SiteConfig[];
  /**
   * 用户自定义crud mock平台脚本地址，脚本export参考UserScript类型
   */
  scriptUrl: string;
  /**
   * CORS配置
   */
  corsConfig: {
    /**
     * 主要是用于篡改access-control-allow-headers，避免引发cors问题
     * 默认会支持
     */
    accessControlAllowHeaders?: string[];
    /**
     * 重定向的目标地址，比如oneapi.alibaba-inc.com
     */
    redirectTarget: string | string[];
  };
  /**
   * 配置页面地址，用于在未匹配上配置时，提示跳转
   */
  configPageUrl?: string;
  /**
   * 操作权限，默认都开启，但面板会依据script的情况，进行展示
   */
  operationPermissions?: OperationPermissions;
  /**
   * 默认场景id，一是用于进入详情面板后匹配，二是用于未来支持其它平台的默认场景编辑匹配（如rap2）
   * @default 'default'
   */
  defaultSceneId?: string;
}