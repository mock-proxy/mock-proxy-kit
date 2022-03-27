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