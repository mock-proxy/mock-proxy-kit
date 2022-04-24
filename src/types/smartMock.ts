export interface SmartMockRule {
  /**
   * 规则名称
   */
  name: string;
  /**
   * 规则条件
   */
  condition: {
    /**
     * key匹配类型
     */
    keyPatternType: 'exact' | 'regexp';
    /**
     * key匹配pattern，若是exact，则为字符串；若为regexp，则支持RE2 syntax，可以理解为 new RegExp(keyPattern)
     */
    keyPattern: string;
    /**
     * 上述key匹配是否忽略大小写
     * @default false
     */
    keyIgnoreCase?: boolean;
    /**
     * 值的类型
     * @default 'any'
     */
    valueType?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'any';
    /**
     * 当前record层级
     * @default 'any'
     * TODO: 未来可支持 > 2等
     */
    depth?: number | 'any';
  }
  action: {
    /**
     * 对key的修改
     * 支持substitution，即：$1、$2等，代表正则的括号匹配
     */
    modifyKey?: string;
    /**
     * 对值的修改
     */
    modifyValue?: any;
  }
}

export type SubstitutionKey = '$1' | '$2' | '$3' | '$4' | '$5' | '$6' | '$7' | '$8' | '$9';

export type SubstitutionType = {
  [key in SubstitutionKey]: string;
};