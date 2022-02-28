export interface SceneResponse {
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
}

export interface ApiResponse {
  /**
   * api id
   */
  id: number | string;
  /**
   * api path
   */
  path: string;
  /**
   * api method
   */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH' | 'ALL';
  /**
   * api名称
   */
  name?: string;
  /**
   * api描述
   */
  desc?: string;
  /**
   * api创建者
   */
  creator?: string;
  /**
   * 如果申明了，会以此为规则的regexFilter。一般用于restful接口
   * @see RE2 syntax
   */
  regexFilter?: string;
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
}

export type OverviewApiResponse = Omit<ApiResponse, 'mockUrl' | 'mockData' | 'sourceUrl' | 'scenes'>;

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

export interface ContextInfo {
  fetchJson: (...args: Parameters<typeof fetch>) => Promise<any>;
}
