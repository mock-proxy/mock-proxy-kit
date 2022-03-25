import { AddScenePayload, ApiResponse, OverviewApiResponse, ProjectConfig, ProjectResponse, SceneResponse } from "./common";

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
export type GetProjectRequest = (project: ProjectConfig, context: Context) => Promise<ProjectResponse>;

/**
 * 获取api详情的请求，由开发者自定义
 */
export type GetApiRequest<A extends OverviewApiResponse = OverviewApiResponse> = (project: ProjectConfig, api: A, context: Context) => Promise<ApiResponse>;

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

export interface UserScript {
  getProject: GetProjectRequest;
  getApi: GetApiRequest;
  updateApiScene?: UpdateApiSceneRequest;
  addApiScene?: AddApiSceneRequest;
  deleteApiScene?: DeleteApiSceneRequest;
}