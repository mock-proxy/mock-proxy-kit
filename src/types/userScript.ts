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
  id: string | number;
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
}

/**
 * 面板中项目的返回值
 */
export interface ProjectResponse {
  /**
   * 分组返回
   */
  groups: GroupResponse[];
}

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
export type AddApiSceneRequest<
  P extends ProjectConfig = ProjectConfig,
  A extends ApiResponse = ApiResponse,
  R extends AddSceneResponse = AddSceneResponse,
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