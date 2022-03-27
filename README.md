## 安装
```bash
npm i mock-proxy-kit -S
```



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
   * 默认场景可否编辑（更改或删除）
   * @default true
   */
  defaultSceneEditable?: boolean;
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

export interface SceneResponse {
  /**
   * 场景id
   */
  id: string | number;
  /**
   * 场景名称
   */
  name: string;
  /**
   * 场景数据
   */
  mockData: any;
  /**
   * 场景mock地址
   */
  mockUrl: string;
  /**
   * 用户自定义数据
   */
  [key: string]: any;
}

export interface AddScenePayload {
  /**
   * 场景名称
   */
  name: string;
  /**
   * 场景数据
   */
  mockData: any;
}

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH' | 'ALL';

export type OverviewApiResponse = {
  /**
   * api id
   */
  id: number | string;
  /**
   * api path, 标识mock平台的api路径，未必是真实的路径
   */
  path: string;
  /**
   * 真实的api路径，界面展示路径也会用此字段。如果没有，则用path。
   * @example 比如oneapi如果存在某个资源的get和delete restful接口，那么api path会是get/api/* resource/ resourceId和delete/api/resource/resourceId
   * 但真实路径其实是：api/resource/{resourceId}
   * @caution 注意，如果真实路径带有{}，插件会自动将其转为regexp，当网页中发送，api/resource/* xxx时，可顺利匹配到规则进行转发
   */
  realPath?: string;
  /**
   * 如果申明了，会以此为规则的regexFilter。优先级 regexFilter > realPath > path
   * @see RE2 syntax
   */
  regexFilter?: string;
  /**
   * api method
   */
  method: ApiMethod;
  /**
   * api名称
   */
  name: string;
  /**
   * api描述
   */
  desc?: string;
  /**
   * api创建者
   */
  creator?: string;
  /**
   * mock地址
   */
  mockUrl: string;
  /**
   * 原接口地址
   */
  sourceUrl?: string;
  /**
   * 用户自定义数据
   */
  [key: string]: any;
}

export interface ApiResponse {
  /**
   * api id
   */
  id: number | string;
  /**
   * api path, 标识mock平台的api路径，未必是真实的路径
   */
  path: string;
  /**
   * 真实的api路径，界面展示路径也会用此字段。如果没有，则用path。
   * @example 比如oneapi如果存在某个资源的get和delete restful接口，那么api path会是get/api/* resource/ resourceId和delete/api/resource/resourceId
   * 但真实路径其实是：api/resource/{resourceId}
   * @caution 注意，如果真实路径带有{}，插件会自动将其转为regexp，当网页中发送，api/resource/* xxx时，可顺利匹配到规则进行转发
   */
  realPath?: string;
  /**
   * 如果申明了，会以此为规则的regexFilter。优先级 regexFilter > realPath > path
   * @see RE2 syntax
   */
  regexFilter?: string;
  /**
   * api method
   */
  method: ApiMethod;
  /**
   * api名称
   */
  name: string;
  /**
   * api描述
   */
  desc?: string;
  /**
   * api创建者
   */
  creator?: string;
  /**
   * mock地址
   */
  mockUrl: string;
  /**
   * mock数据
   */
  mockData: any;
  /**
   * 原接口地址
   */
  sourceUrl?: string;
  /**
   * 多场景数据
   */
  scenes?: SceneResponse[];
  /**
   * 用户自定义数据
   */
  [key: string]: any;
}

export interface GroupResponse {
  /**
  * 分组id
  */
  id: number | string;
  /**
   * 分组名
   */
  name: string;
  /**
   * api返回
   */
  apis: OverviewApiResponse[];
}

export interface ProjectResponse {
  /**
   * 分组返回
   */
  groups: GroupResponse[];
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
import {
  AddScenePayload,
  ApiResponse,
  OverviewApiResponse,
  ProjectConfig,
  ProjectResponse,
  SceneResponse
} from "./common";

/**
 * 开发者自定义函数上下文。
 * 可通过fetchJson，拉取或向服务端传递json数据，不受同源限制，拥有高权限
 */
export interface Context {
  fetchJSON: <Response = any>(...args: Parameters<typeof fetch>) => Promise<Response>;
  tabInfo: {
    url: string;
    userAgent: string;
  }
}

/**
 * 获取project详情的请求，由开发者自定义
 */
export type GetProjectRequest<
  P extends ProjectConfig = ProjectConfig,
  R extends ProjectResponse = ProjectResponse
  > = (
    project: P,
    context: Context
  ) => Promise<R>;

/**
 * 获取api详情的请求，由开发者自定义
 */
export type GetApiRequest<
  P extends ProjectConfig = ProjectConfig,
  A extends OverviewApiResponse = OverviewApiResponse,
  R extends ApiResponse = ApiResponse
  > = (project: P, api: A, context: Context) => Promise<R>;

/**
 * 更改api场景数据，由开发者自定义
 */
export type UpdateApiSceneRequest<
  P extends ProjectConfig = ProjectConfig,
  A extends ApiResponse = ApiResponse,
  S extends SceneResponse = SceneResponse,
  R = any
  > = (
    project: P,
    api: A,
    scene: S,
    context: Context
  ) => Promise<R>;

/**
 * 添加api场景，由开发者自定义
 */
interface AddApiSceneResponse {
  id: string | number;
  [k: string]: any;
}

export type AddApiSceneRequest<
  P extends ProjectConfig = ProjectConfig,
  A extends ApiResponse = ApiResponse,
  R extends AddApiSceneResponse = AddApiSceneResponse,
  > = (
    project: P,
    api: A,
    scene: AddScenePayload,
    context: Context
  ) => Promise<R>;

/**
 * 删除api场景，由开发者自定义
 */
export type DeleteApiSceneRequest<
  P extends ProjectConfig = ProjectConfig,
  A extends ApiResponse = ApiResponse,
  S extends SceneResponse = SceneResponse,
  R = any
  > = (
    project: P,
    api: A,
    scene: S,
    context: Context
  ) => Promise<R>;

export interface UserScript {
  getProject: GetProjectRequest;
  getApi: GetApiRequest;
  updateApiScene?: UpdateApiSceneRequest;
  addApiScene?: AddApiSceneRequest;
  deleteApiScene?: DeleteApiSceneRequest;
}
```





## 示例自定义脚本（oneapi）

```typescript
import {
  ProjectConfig,
  GroupResponse,
  OverviewApiResponse,
  ApiResponse,
  SceneResponse,
  userScript,
  AddScenePayload
} from 'mock-proxy-kit';
import { OneApiQueryApi, OneApiQueryProject, ApiOverview } from './types';

interface RequestMap {
  /**
   * key为api path；value为realPath
   */
  [path: string]: string;
}

interface OneapiProjectConfig extends ProjectConfig {
  requestMap?: RequestMap;
}

const oneapiBaseUrl = 'xxxx.com';

const DEFAULT_SCENE_NAME = 'default';

function getMockUrl(project: OneapiProjectConfig, api: ApiOverview, groupName?: string): string {
  return `${oneapiBaseUrl}/mock/${project.id}/${api.apiName}${groupName ? `?_tag=${groupName}` : ''}`;
}

function getSourceUrl(project: OneapiProjectConfig, api: ApiOverview): string {
  return `${oneapiBaseUrl}/eapi/interface-manager?projectCode=${project.id}&apiName=${encodeURIComponent(api.apiName)}&method=${api.method}`;
}

/**
 * 获取项目及分组及接口概览（项目 => 分组 => 接口概览）
 * @required
**/
export const getProject: userScript.GetProjectRequest = (project: OneapiProjectConfig, context: userScript.Context) => {
  return context.fetchJSON<OneApiQueryProject>(`${oneapiBaseUrl}/api/oneapi/group/query?projectCode=${project.id}`).then((res) => {
    if (!res.success) throw new Error('获取项目失败');

    const defaultGroup: GroupResponse = {
      id: 'default',
      name: '默认分组',
      apis: (res.content.apis || []).map(api => {
        const realPath = project.requestMap?.[api.apiName] || api.apiName;
        const ret: OverviewApiResponse = {
          id: api.id,
          name: api.description,
          method: api.method,
          path: api.apiName,
          realPath,
          creator: api.creator?.nickName,
          mockUrl: getMockUrl(project, api),
          sourceUrl: getSourceUrl(project, api),
          // 补充restful、多前缀等逻辑
          // regexFilter
        };
        return ret;
      }),
    }

    const otherGroups: GroupResponse[] = (res.content.catalogs || []).map(group => {
      const ret: GroupResponse = {
        id: group.id,
        name: group.name,
        apis: (group.apis || []).map(api => {
          const realPath = project.requestMap?.[api.apiName] || api.apiName;
          const ret: OverviewApiResponse = {
            id: api.id,
            name: api.description,
            method: api.method,
            path: api.apiName,
            realPath,
            creator: api.creator?.nickName,
            mockUrl: getMockUrl(project, api),
            sourceUrl: getSourceUrl(project, api),
            // 补充多前缀等逻辑
            // regexFilter
          };
          return ret;
        }),
      };
      return ret;
    });

    const groups = [defaultGroup, ...otherGroups]

    return {
      groups
    }
  });
}

/**
 * 获取api及场景详情
 * @required
**/
export const getApi: userScript.GetApiRequest = (project: OneapiProjectConfig, api: OverviewApiResponse, context: userScript.Context) => {
  return context.fetchJSON<OneApiQueryApi>(`${oneapiBaseUrl}/api/info/getApi?projectCode=${project.id}&apiName=${encodeURIComponent(api.path)}`).then((res) => {
    if (!res.success) throw new Error('获取接口失败');
    const scenes: SceneResponse[] = [];

    Object.entries(res.content.tagResponses).forEach(([groupName, mockData]) => {
      scenes.push({
        // oneapi不允许存在相同的场景名称
        id: groupName,
        name: groupName,
        // 如果mockUrl没有queryString，则当接口匹配上后，会将后面的queryString拼接到mockUrl上，从而可以实现：同一个接口，带不同tag，代理到不同场景
        mockUrl: getMockUrl(project, res.content, groupName === DEFAULT_SCENE_NAME ? '' : groupName),
        mockData: mockData,
      })
    })

    const realPath = project.requestMap?.[res.content.apiName] || res.content.apiName;

    const ret: ApiResponse = {
      id: res.content.id,
      name: res.content.description,
      // desc: res.content.description,
      method: res.content.method,
      path: res.content.apiName,
      realPath,
      creator: res.content.creator?.nickName,
      mockUrl: getMockUrl(project, res.content),
      sourceUrl: getSourceUrl(project, res.content),
      mockData: res.content.tagResponses?.default,
      scenes
    };
    return ret;
  });
}

/**
 * 更新api场景
 * @notrequired
**/
export const updateApiScene: userScript.UpdateApiSceneRequest<{
  success: boolean
}> = (project: OneapiProjectConfig, api: ApiResponse, scene: SceneResponse, context: userScript.Context) => {
  const payload = {
    apiName: api.path,
    projectCode: project.id,
    tagName: scene.name,
    tagResponse: scene.mockData,
    csrf: '',
  };

  return context.fetchJSON<{
    success: boolean
  }>(`${oneapiBaseUrl}/api/info/updateTag`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => {
    if (!res.success) throw new Error('更新失败');
    return res;
  });
}

/**
 * 添加api场景
 * @notrequired
**/
export const addApiScene: userScript.AddApiSceneRequest = (
  project: OneapiProjectConfig,
  api: ApiResponse,
  scene: AddScenePayload,
  context: userScript.Context
) => {
    const payload = {
      apiName: api.path,
      projectCode: project.id,
      tagName: scene.name,
      tagResponse: scene.mockData,
      csrf: '',
    };

    return context.fetchJSON<{
      success: boolean
      content: string
    }>(`${oneapiBaseUrl}/api/info/createTag`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      if (!res.success) throw new Error('创建失败');
      return {
        id: res.content
      };
    });
  }

/**
 * 删除api场景
 * @notrequired
**/
export const deleteApiScene: userScript.DeleteApiSceneRequest<{
  success: boolean
}> = (
  project: OneapiProjectConfig,
  api: ApiResponse,
  scene: SceneResponse,
  context: userScript.Context
) => {
    const payload = {
      apiName: api.path,
      projectCode: project.id,
      tagName: scene.name,
      csrf: '',
    };

    return context.fetchJSON<{
      success: boolean
    }>(`${oneapiBaseUrl}/api/info/deleteTag`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      if (!res.success) throw new Error('删除失败');
      return res;
    });
  }

```

