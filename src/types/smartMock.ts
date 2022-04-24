export interface SmartMockRule {
  name: string;
  condition: {
    keyPatternType: 'exact' | 'regexp';
    keyPattern: string;
    keyIgnoreCase?: boolean;
    valueType?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'any';
    /**
     * TODO: 可支持 > 2等
     */
    depth?: number | 'all';
  }
  action: {
    /**
     * $1等代表正则匹配
     */
    modifyKey?: string;
    modifyValue?: any;
  }
}

export type SubstitutionKey = '$1' | '$2' | '$3' | '$4' | '$5' | '$6' | '$7' | '$8' | '$9';

export type SubstitutionType = {
  [key in SubstitutionKey]: string;
};