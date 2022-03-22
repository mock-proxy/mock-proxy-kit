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

