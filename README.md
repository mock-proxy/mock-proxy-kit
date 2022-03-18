## 团队配置

```typescript
/**
 * api场景可否编辑
 */
export type ApiSceneEditable = {
  /**
   * 场景可否更改
   * @default false
   */
  updatable?: boolean;
  /**
  * 场景名称可否编辑，需要updatable为true才会生效
  * @default true
  */
  nameEditable?: boolean;
  /**
   * 场景可否删除
   * @default false
   */
  deletable?: boolean;
  /**
   * 场景可否新增
   * @default false
   */
  addable?: boolean;
} | boolean;

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
   * TODO: api配置，可配置api的restful路径，最终在发送请求的时候，会以此配置为准来转发
   */
  apisConfig?: ApiConfig[];
  /**
   * 其他开发者所需字段
   */
  [key: string]: any;
}

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
   * 站点的域名
   */
  domains: string[];
  /**
   * 站点对应的项目配置。可能一个站点对应了多个项目（即oneapi、yapi的project）
   */
  projects: ProjectConfig[];
  /**
   * 跨站点配置：可能该站点需要调用其他site的接口
   */
  // crossSiteConfig: unknown;
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
   * 可否编辑api场景（增加场景、修改mock数据）
   * @default false
   */
  apiSceneEditable?: ApiSceneEditable;
  /**
   * 默认场景id，一是用于进入详情面板后匹配，二是用于未来支持其它平台的默认场景编辑匹配（如rap2）
   * @default 'default'
   */
  defaultSceneId?: string;
}
```





## 用户自定义脚本

```typescript
import { AddScenePayload, ApiResponse, OverviewApiResponse, ProjectConfig, ProjectResponse, SceneResponse } from "./common";

/**
 * 开发者自定义函数上下文。
 * 可通过fetchJson，拉取或向服务端传递json数据，不受同源限制，拥有高权限
 */
export interface Context {
  fetchJSON: <Response = any>(...args: Parameters<typeof fetch>) => Promise<Response>;
}

/**
 * 获取project详情的请求，由开发者自定义
 */
export type GetProjectRequest = (project: ProjectConfig, context: Context) => Promise<ProjectResponse>;

/**
 * 获取api详情的请求，由开发者自定义
 */
export type GetApiRequest = (project: ProjectConfig, api: OverviewApiResponse, context: Context) => Promise<ApiResponse>;

/**
 * 更改api场景数据，由开发者自定义
 */
export type UpdateApiSceneRequest<Response = any> = (
  project: ProjectConfig,
  api: ApiResponse,
  scene: SceneResponse,
  context: Context
) => Promise<Response>;

/**
 * 添加api场景，由开发者自定义
 */
export type AddApiSceneRequest = (
  project: ProjectConfig,
  api: ApiResponse,
  scene: AddScenePayload,
  context: Context
) => Promise<{
  id: string | number;
  [k: string]: any;
}>;

/**
 * 删除api场景，由开发者自定义
 */
export type DeleteApiSceneRequest<Response = any> = (
  project: ProjectConfig,
  api: ApiResponse,
  scene: SceneResponse,
  context: Context
) => Promise<Response>;

/**
 * 用户自定义脚本集合
 */
export interface UserScript {
  getProject: GetProjectRequest;
  getApi: GetApiRequest;
  updateApiScene?: UpdateApiSceneRequest;
  addApiScene?: AddApiSceneRequest;
  deleteApiScene?: DeleteApiSceneRequest;
}
```

