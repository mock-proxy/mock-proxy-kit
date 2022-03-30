import {
  ApiMethod
} from "./common";
import { ProjectConfig } from "./teamConfig";

/**
 * 面板中api场景的返回值
 */
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

/**
 * 面板中添加api场景的payload
 */
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

/**
 * 面板中添加api场景的response
 */
export interface AddSceneResponse {
  /**
   * 新增场景id
   */
  id: string | number;
  /**
   * 用户自定义数据
   */
  [key: string]: any;
}

/**
 * 面板中接口概览的返回值
 */
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

/**
 * 面板中接口详情的返回值
 */
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

/**
 * 面板中接口分组的返回值
 */
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
  /**
   * 用户自定义数据
   */
  [key: string]: any;
}

/**
 * 面板中项目的返回值
 */
export interface ProjectResponse {
  /**
   * 分组返回
   */
  groups: GroupResponse[];
  /**
   * 用户自定义数据
   */
  [key: string]: any;
}

interface RequestParams {
  projectConfig: ProjectConfig;
  projectResponse: ProjectResponse;
  groupResponse: GroupResponse;
  overviewApiResponse: OverviewApiResponse;
  apiResponse: ApiResponse;
  sceneResponse: SceneResponse;
}

/**
 * 开发者自定义函数上下文。
 * 可通过fetchJson，拉取或向服务端传递json数据，不受同源限制，拥有高权限
 */
export interface Context {
  /**
   * 跟fetch一致，会自动res.json()
   */
  fetchJSON: <Response = any>(...args: Parameters<typeof fetch>) => Promise<Response>;
  /**
   * 当前页面信息
   */
  tabInfo: {
    /**
     * 页面的url
     */
    url: string;
    /**
     * 页面的ua
     */
    userAgent: string;
  }
}

/**
 * 获取project详情的请求，由开发者自定义
 */
export type GetProjectRequestParams = Pick<RequestParams, 'projectConfig'>;
export type GetProjectRequest<
  P extends GetProjectRequestParams = GetProjectRequestParams,
  R extends ProjectResponse = ProjectResponse
  > = (
    params: {
      projectConfig: P['projectConfig']
    },
    context: Context
  ) => Promise<R>;

/**
 * 获取api详情的请求，由开发者自定义
 */
export type GetApiRequestParams = Pick<RequestParams, 'projectConfig' | 'projectResponse' | 'overviewApiResponse'>;
export type GetApiRequest<
  P extends GetApiRequestParams = GetApiRequestParams,
  R extends ApiResponse = ApiResponse
  > = (params: {
    projectConfig: P['projectConfig'];
    projectResponse: P['projectResponse'];
    overviewApiResponse: P['overviewApiResponse'];
  }, context: Context) => Promise<R>;

/**
* 移动api到其它分组的请求，由开发者自定义
*/
export type MoveApiRequestParams = Pick<RequestParams, 'projectConfig' | 'projectResponse' | 'groupResponse' | 'apiResponse'>;
export type MoveApiRequest<
  P extends MoveApiRequestParams = MoveApiRequestParams,
  R = any
  > = (
    params: {
      projectConfig: P['projectConfig'];
      projectResponse: P['projectResponse'];
      groupPayload: P['groupResponse'];
      apiResponse: P['apiResponse'];
    },
    context: Context
  ) => Promise<R>;

/**
 * 更改api场景数据，由开发者自定义
 */
export type UpdateApiSceneRequestParams = Pick<RequestParams, 'projectConfig' | 'projectResponse' | 'apiResponse' | 'sceneResponse'>;
export type UpdateApiSceneRequest<
  P extends UpdateApiSceneRequestParams = UpdateApiSceneRequestParams,
  R = any
  > = (
    params: {
      projectConfig: P['projectConfig'];
      projectResponse: P['projectResponse'];
      apiResponse: P['apiResponse'];
      sceneResponse: P['sceneResponse'];
    },
    context: Context
  ) => Promise<R>;

/**
 * 添加api场景，由开发者自定义
 */
export type AddApiSceneRequestParams = Pick<RequestParams, 'projectConfig' | 'projectResponse' | 'apiResponse'> & {
  addScenePayload: AddScenePayload
};
export type AddApiSceneRequest<
  P extends AddApiSceneRequestParams = AddApiSceneRequestParams,
  R extends AddSceneResponse = AddSceneResponse,
  > = (
    params: {
      projectConfig: P['projectConfig'];
      projectResponse: P['projectResponse'];
      apiResponse: P['apiResponse'];
      addScenePayload: P['addScenePayload'];
    },
    context: Context
  ) => Promise<R>;

/**
 * 删除api场景，由开发者自定义
 */
type DeleteApiSceneRequestParams = Pick<RequestParams, 'projectConfig' | 'projectResponse' | 'apiResponse' | 'sceneResponse'>;
export type DeleteApiSceneRequest<
  P extends DeleteApiSceneRequestParams = DeleteApiSceneRequestParams,
  R = any
  > = (
    params: {
      projectConfig: P['projectConfig'];
      projectResponse: P['projectResponse'];
      apiResponse: P['apiResponse'];
      sceneResponse: P['sceneResponse'];
    },
    context: Context
  ) => Promise<R>;

export interface UserScript {
  getProject: GetProjectRequest;
  getApi: GetApiRequest;
  moveApi?: MoveApiRequest;
  updateApiScene?: UpdateApiSceneRequest;
  addApiScene?: AddApiSceneRequest;
  deleteApiScene?: DeleteApiSceneRequest;
}